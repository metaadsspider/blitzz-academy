/**
 * Turns the plain-text lesson bodies into blocks for rendering.
 * Blocks are separated by blank lines. A block is a heading, a code block,
 * or a paragraph.
 */

const CODE_START =
  /^(print|return|def|import|from|if|elif|else|for|while|with|try|except|finally|class|async|await|const|let|var|function|SELECT|INSERT|UPDATE|DELETE|GET|POST|PUT|HTTP\/|<\w|\*|\.|#|--|\/\/)/;

function isCodeBlock(block) {
  const lines = block.split("\n").filter((l) => l.trim() !== "");
  if (lines.length === 0) return false;

  if (lines.length === 1) {
    const line = lines[0].trim();
    if (line.endsWith(".") && line.length > 40) return false;
    if (CODE_START.test(line)) return true;
    if (/^[A-Za-z_][\w.[\]]*\s*=\s*\S/.test(line)) return true; // assignment
    if (/^[A-Za-z_][\w.[\]]*\(.*\)\s*$/.test(line)) return true; // call
    if (/^[A-Z][A-Za-z-]+:\s+\S/.test(line)) return true; // header line
    return false;
  }

  const codey = lines.filter((l) => {
    const t = l.trim();
    return (
      CODE_START.test(t) ||
      /^[A-Za-z_][\w.[\]]*\s*=\s*\S/.test(t) ||
      /^[A-Za-z_][\w.[\]]*\(.*\)\s*;?$/.test(t) ||
      /[=:{;]$/.test(t) ||
      /^(<\/?[a-z]|\}|\{|\[)/.test(t) ||
      /^[A-Z][A-Za-z-]+:\s+\S/.test(t) ||
      /^[A-Z]+ \/\S* HTTP/.test(t) ||
      /^\s{2,}\S/.test(l)
    );
  }).length;

  return codey / lines.length >= 0.6;
}

export function parseLessonBody(body) {
  const blocks = String(body || "")
    .split(/\n{2,}/)
    .map((b) => b.replace(/\s+$/, ""))
    .filter((b) => b.trim() !== "");

  return blocks.map((block) => {
    if (block.startsWith("## ")) {
      return { type: "h2", text: block.slice(3).trim() };
    }
    if (block.startsWith("# ")) {
      return { type: "h2", text: block.slice(2).trim() };
    }
    if (isCodeBlock(block)) {
      return { type: "pre", text: block };
    }
    return { type: "p", text: block.split("\n").join(" ").trim() };
  });
}
