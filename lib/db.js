import { Pool } from "pg";
import { COURSES } from "./courses-data";

const g = globalThis;

function pool() {
  if (!g.__pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Add it in Vercel -> Settings -> Environment Variables (or in .env.local for local use)."
      );
    }
    const isLocal = /localhost|127\.0\.0\.1|host=\//.test(connectionString);
    g.__pgPool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10000,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return g.__pgPool;
}

async function ensureSchema() {
  const p = pool();

  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            serial PRIMARY KEY,
      name          text NOT NULL,
      email         text NOT NULL UNIQUE,
      phone         text NOT NULL DEFAULT '',
      password_hash text NOT NULL,
      created_at    timestamptz NOT NULL DEFAULT now()
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id             serial PRIMARY KEY,
      slug           text NOT NULL UNIQUE,
      title          text NOT NULL,
      subtitle       text NOT NULL DEFAULT '',
      description    text NOT NULL DEFAULT '',
      price_inr      integer NOT NULL,
      list_price_inr integer NOT NULL DEFAULT 0,
      level          text NOT NULL DEFAULT '',
      duration       text NOT NULL DEFAULT '',
      lessons        jsonb NOT NULL DEFAULT '[]'::jsonb,
      accent         text NOT NULL DEFAULT '#14304a',
      icon           text NOT NULL DEFAULT 'book',
      sort_order     integer NOT NULL DEFAULT 0
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id           serial PRIMARY KEY,
      user_id      integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id    integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      amount       integer NOT NULL,
      name         text NOT NULL DEFAULT '',
      email        text NOT NULL DEFAULT '',
      phone        text NOT NULL DEFAULT '',
      utr          text,
      status       text NOT NULL DEFAULT 'pending',
      created_at   timestamptz NOT NULL DEFAULT now(),
      confirmed_at timestamptz
    )
  `);

  await p.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id         serial PRIMARY KEY,
      user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id  integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      order_id   integer REFERENCES orders(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (user_id, course_id)
    )
  `);

  // Seed the catalogue only when the table is empty, so a course deleted from
  // the admin panel is never resurrected by a cold start.
  const { rows: existing } = await p.query(`SELECT count(*)::int AS n FROM courses`);
  if (existing[0].n === 0) {
  for (const c of COURSES) {
    await p.query(
      `INSERT INTO courses
         (slug, title, subtitle, description, price_inr, list_price_inr,
          level, duration, lessons, accent, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12)
       ON CONFLICT (slug) DO NOTHING`,
      [
        c.slug,
        c.title,
        c.subtitle,
        c.description,
        c.price_inr,
        c.list_price_inr,
        c.level,
        c.duration,
        JSON.stringify(c.lessons),
        c.accent,
        c.icon,
        c.sort_order,
      ]
    );
    }
  }
}

/**
 * Creates the schema on first use in each server process.
 */
async function ensureReady() {
  if (!g.__schemaReady) {
    g.__schemaReady = ensureSchema().catch((err) => {
      g.__schemaReady = null;
      throw err;
    });
  }
  await g.__schemaReady;
}

/**
 * Run a query. Creates the schema on first use in each server process.
 */
export async function query(text, params) {
  await ensureReady();
  return pool().query(text, params);
}

/**
 * Run several statements atomically. `fn` receives a client.
 */
export async function transaction(fn) {
  await ensureReady();
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getCourses() {
  const { rows } = await query(
    `SELECT id, slug, title, subtitle, description, price_inr, list_price_inr,
            level, duration, lessons, accent, icon
       FROM courses ORDER BY sort_order ASC, id ASC`
  );
  return rows;
}

export async function getCourseBySlug(slug) {
  const { rows } = await query(
    `SELECT id, slug, title, subtitle, description, price_inr, list_price_inr,
            level, duration, lessons, accent, icon
       FROM courses WHERE slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

export async function isEnrolled(userId, courseId) {
  const { rows } = await query(
    `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  return rows.length > 0;
}
