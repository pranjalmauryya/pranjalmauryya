// Generates assets/*.svg, README.md and preview.html from profile.config.json.
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(root, "profile.config.json"), "utf8"));
const t = cfg.theme;
const U = cfg.username;

const xml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const q = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

const SANS = "'Segoe UI', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

// ---------------------------------------------------------------- banner.svg
function banner() {
  const nameSize = Math.min(68, Math.floor(720 / (cfg.name.length * 0.58)));
  const cx = 965, cy = 160, R = 100;
  const sats = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return { x: +(cx + R * Math.cos(a)).toFixed(1), y: +(cy + R * Math.sin(a)).toFixed(1), i };
  });
  const labels = (cfg.bannerNodes || ["LLM", "MCP", "API", "UI", "DB", "CI"]).map(xml);

  const links = sats
    .map(
      (s) => `
    <line x1="${cx}" y1="${cy}" x2="${s.x}" y2="${s.y}" stroke="url(#edge)" stroke-width="2" stroke-dasharray="6 8">
      <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="${2 + (s.i % 3) * 0.6}s" repeatCount="indefinite"/>
    </line>`
    )
    .join("");
  const ring = sats
    .map((s, k) => {
      const n = sats[(k + 1) % sats.length];
      return `<line x1="${s.x}" y1="${s.y}" x2="${n.x}" y2="${n.y}" stroke="#${t.border}" stroke-width="1.5"/>`;
    })
    .join("\n    ");
  const nodes = sats
    .map(
      (s) => `
    <g>
      <circle cx="${s.x}" cy="${s.y}" r="22" fill="#${t.bg}" stroke="#${s.i % 2 ? t.icon : t.title}" stroke-width="2">
        <animate attributeName="r" values="22;25;22" dur="3s" begin="${s.i * 0.5}s" repeatCount="indefinite"/>
      </circle>
      <text x="${s.x}" y="${s.y + 4}" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="700" fill="#${t.text}">${labels[s.i]}</text>
    </g>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" width="1200" height="320" role="img" aria-label="${xml(cfg.name)}, ${xml(cfg.role)}">
  <title>${xml(cfg.name)}, ${xml(cfg.role)}</title>
  <defs>
    <clipPath id="card"><rect width="1200" height="320" rx="24"/></clipPath>
    <linearGradient id="name" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="900" y2="0" spreadMethod="repeat">
      <stop offset="0" stop-color="#${t.title}"/>
      <stop offset="0.35" stop-color="#${t.icon}"/>
      <stop offset="0.65" stop-color="#${t.accent}"/>
      <stop offset="1" stop-color="#${t.title}"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="900 0" dur="8s" repeatCount="indefinite"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#${t.title}"/><stop offset="1" stop-color="#${t.icon}"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" x2="1">
      <stop offset="0" stop-color="#${t.title}"/><stop offset="0.5" stop-color="#${t.icon}"/><stop offset="1" stop-color="#${t.accent}"/>
    </linearGradient>
    <radialGradient id="hub"><stop offset="0" stop-color="#${t.title}"/><stop offset="1" stop-color="#7c3aed"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.045"/>
    </pattern>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="55"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>

  <g clip-path="url(#card)">
    <rect width="1200" height="320" fill="#${t.bg}"/>
    <g filter="url(#blur)" opacity="0.55">
      <circle r="150" fill="#7c3aed">
        <animate attributeName="cx" values="150;320;150" dur="18s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="60;140;60" dur="14s" repeatCount="indefinite"/>
      </circle>
      <circle r="130" fill="#0891b2">
        <animate attributeName="cx" values="1050;880;1050" dur="16s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="280;200;280" dur="12s" repeatCount="indefinite"/>
      </circle>
      <circle r="90" fill="#db2777" opacity="0.6">
        <animate attributeName="cx" values="640;760;640" dur="20s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="330;260;330" dur="15s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect width="1200" height="320" fill="url(#grid)"/>

    <!-- status pill -->
    <g transform="translate(64 58)">
      <rect width="${36 + cfg.status.length * 8.2}" height="30" rx="15" fill="#ffffff" fill-opacity="0.06" stroke="#${t.border}"/>
      <circle cx="18" cy="15" r="5" fill="#3fb950">
        <animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x="32" y="20" font-family="${SANS}" font-size="14" font-weight="600" fill="#${t.text}">${xml(cfg.status)}</text>
    </g>

    <text x="62" y="${148 + nameSize * 0.25}" font-family="${SANS}" font-size="${nameSize}" font-weight="800" letter-spacing="-1.5" fill="url(#name)">${xml(cfg.name)}</text>
    <text x="64" y="${206 + nameSize * 0.15}" font-family="${MONO}" font-size="22" font-weight="600" fill="#${t.icon}">&gt; <tspan fill="#${t.text}">${xml(cfg.role)}</tspan><tspan fill="#${t.title}">_<animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></tspan></text>
    <text x="64" y="${248 + nameSize * 0.15}" font-family="${SANS}" font-size="18" fill="#8b949e">${xml(cfg.headline)}</text>

    <!-- agent graph -->
    <g>
    ${ring}
    ${links}
    <circle cx="${cx}" cy="${cy}" r="36" fill="url(#hub)" filter="url(#glow)">
      <animate attributeName="r" values="34;38;34" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="${MONO}" font-size="17" font-weight="800" fill="#ffffff">&lt;/&gt;</text>
    ${nodes}
    </g>

    <rect y="314" width="1200" height="6" fill="url(#bar)"/>
  </g>
  <rect x="0.5" y="0.5" width="1199" height="319" rx="23.5" fill="none" stroke="#${t.border}"/>
</svg>
`;
}

// ---------------------------------------------------------------- divider.svg
const divider = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 8" width="1200" height="8" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" x2="1200" spreadMethod="repeat">
      <stop offset="0" stop-color="#${t.title}" stop-opacity="0"/>
      <stop offset="0.25" stop-color="#${t.title}"/>
      <stop offset="0.5" stop-color="#${t.icon}"/>
      <stop offset="0.75" stop-color="#${t.accent}"/>
      <stop offset="1" stop-color="#${t.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect y="3" width="1200" height="2" rx="1" fill="url(#g)"/>
  <circle cy="4" r="3.5" fill="#${t.icon}">
    <animate attributeName="cx" values="120;1080;120" dur="9s" repeatCount="indefinite"/>
  </circle>
</svg>
`;

// ---------------------------------------------------------------- footer.svg
function footer() {
  const a1 = "M0,70 C200,110 400,30 600,70 C800,110 1000,30 1200,70 L1200,140 L0,140 Z";
  const a2 = "M0,70 C200,30 400,110 600,70 C800,30 1000,110 1200,70 L1200,140 L0,140 Z";
  const b1 = "M0,95 C250,65 450,125 700,95 C900,70 1050,120 1200,95 L1200,140 L0,140 Z";
  const b2 = "M0,95 C250,125 450,65 700,95 C900,120 1050,70 1200,95 L1200,140 L0,140 Z";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 140" width="1200" height="140">
  <defs>
    <linearGradient id="w" x1="0" x2="1">
      <stop offset="0" stop-color="#${t.title}"/><stop offset="0.5" stop-color="#${t.icon}"/><stop offset="1" stop-color="#${t.accent}"/>
    </linearGradient>
  </defs>
  <path fill="url(#w)" opacity="0.35" d="${a1}">
    <animate attributeName="d" values="${a1};${a2};${a1}" dur="10s" repeatCount="indefinite"/>
  </path>
  <path fill="url(#w)" opacity="0.8" d="${b1}">
    <animate attributeName="d" values="${b1};${b2};${b1}" dur="7s" repeatCount="indefinite"/>
  </path>
</svg>
`;
}

// ---------------------------------------------------------------- README.md
const statsTheme = { bg_color: t.bg, title_color: t.title, icon_color: t.icon, text_color: t.text, hide_border: "true" };
const STATS = "https://github-readme-stats.vercel.app";

function badge(label, message, logo, href) {
  const src = `https://img.shields.io/badge/${encodeURIComponent(label.replace(/-/g, "--"))}-${encodeURIComponent(
    message.replace(/-/g, "--")
  )}-${t.title}?style=for-the-badge&logo=${logo}&logoColor=white&labelColor=${t.bg}`;
  return `<a href="${href}"><img src="${src}" alt="${xml(label)}"/></a>`;
}

function readme() {
  const typing = `https://readme-typing-svg.demolab.com?${q({
    font: "Fira Code",
    weight: "600",
    size: "22",
    duration: "3500",
    pause: "900",
    color: t.title.toUpperCase(),
    center: "true",
    vCenter: "true",
    width: "620",
    height: "45",
  })}&lines=${cfg.typing.map((l) => encodeURIComponent(l)).join(";")}`;

  const top = [
    `<img src="https://komarev.com/ghpvc/?username=${U}&label=Profile%20views&color=${t.title}&style=for-the-badge" alt="Profile views"/>`,
    `<a href="https://github.com/${U}?tab=followers"><img src="https://img.shields.io/github/followers/${U}?label=Followers&style=for-the-badge&logo=github&logoColor=white&color=${t.icon}&labelColor=${t.bg}" alt="Followers"/></a>`,
    `<a href="https://github.com/${U}?tab=repositories"><img src="https://img.shields.io/github/stars/${U}?label=Stars&style=for-the-badge&logo=github&logoColor=white&color=${t.accent}&labelColor=${t.bg}" alt="Total stars"/></a>`,
  ].join("\n  ");

  const a = cfg.about;
  const arr = (v) => `[${v.map((x) => JSON.stringify(x)).join(", ")}]`;
  const about = `\`\`\`ts
const ${U.replace(/[^A-Za-z0-9_$]/g, "_").replace(/^[0-9]/, "_$&")} = {
  role:              ${JSON.stringify(a.role)},
  location:          ${JSON.stringify(cfg.location)},
  focus:             ${arr(a.focus)},
  currentlyBuilding: ${JSON.stringify(a.currentlyBuilding)},
  learning:          ${arr(a.learning)},
  askMeAbout:        ${arr(a.askMeAbout)},
  funFact:           ${JSON.stringify(a.funFact)},
};
\`\`\``;

  const stack = Object.entries(cfg.stack)
    .map(([group, v]) => {
      const { icons = "", badges = [] } = typeof v === "string" ? { icons: v } : v;
      const parts = [];
      if (icons)
        parts.push(
          `<img src="https://skillicons.dev/icons?i=${icons}&theme=dark&perline=12" alt="${xml(group)}: ${icons.replace(/,/g, ", ")}"/>`
        );
      if (badges.length)
        parts.push(
          badges
            .map(
              (b) =>
                `<img src="https://img.shields.io/badge/${encodeURIComponent(b.name.replace(/-/g, "--"))}-21262d?style=for-the-badge&logo=${
                  b.logo
                }&logoColor=${t.icon}" alt="${xml(b.name)}"/>`
            )
            .join(" ")
        );
      return `<p><sub><b>${xml(group.toUpperCase())}</b></sub><br/>${parts.join("<br/>")}</p>`;
    })
    .join("\n\n");

  const projects = cfg.projects
    .map((p) => {
      const [owner, repo] = p.repo.includes("/") ? p.repo.split("/") : [U, p.repo];
      const src = `${STATS}/api/pin/?${q({ username: owner, repo, ...statsTheme, description_lines_count: "2" })}`;
      return `<a href="https://github.com/${owner}/${repo}"><img src="${src}" width="48%" alt="${xml(repo)}"/></a>`;
    })
    .join("\n  ");

  const stats = `${STATS}/api?${q({ username: U, show_icons: "true", count_private: "true", rank_icon: "github", ...statsTheme })}`;
  const langs = `${STATS}/api/top-langs/?${q({ username: U, layout: "compact", langs_count: "8", ...statsTheme })}`;
  const streak = `https://streak-stats.demolab.com?${q({
    user: U,
    hide_border: "true",
    background: t.bg,
    ring: t.title,
    fire: t.accent,
    currStreakLabel: t.title,
    currStreakNum: t.text,
    sideNums: t.text,
    sideLabels: t.icon,
    dates: "8b949e",
    stroke: t.border,
  })}`;
  const graph = `https://github-readme-activity-graph.vercel.app/graph?${q({
    username: U,
    bg_color: t.bg,
    color: t.text,
    line: t.title,
    point: t.icon,
    area: "true",
    area_color: t.title,
    hide_border: "true",
    radius: "12",
  })}`;

  const s = cfg.socials;
  const socials = [
    s.portfolio && badge("Portfolio", "Visit", "googlechrome", s.portfolio),
    s.linkedin && badge("LinkedIn", "Connect", "linkedin", s.linkedin),
    s.x && badge("X", "Follow", "x", s.x),
    s.email && badge("Email", "Say hi", "gmail", `mailto:${s.email}`),
  ].filter(Boolean);

  const hr = `<img src="./assets/divider.svg" width="100%" alt=""/>`;
  const section = (title, body) => `\n${hr}\n\n<h2 align="center">${title}</h2>\n\n${body}\n`;

  let out = `<!-- Generated by build.mjs from profile.config.json. Edit the config, not this file. -->
<div align="center">

<img src="./assets/banner.svg" width="100%" alt="${xml(cfg.name)}, ${xml(cfg.role)}"/>

<a href="https://github.com/${U}"><img src="${typing}" alt="${xml(cfg.typing.join(" · "))}"/></a>

<p>
  ${top}
</p>

</div>
${section("About me", about)}
${section("Tech stack", `<div align="center">\n\n${stack}\n\n</div>`)}`;

  if (projects) out += section("Featured projects", `<div align="center">\n  ${projects}\n</div>`);

  const an = { stats: true, languages: true, streak: true, activityGraph: true, snake: true, ...cfg.analytics };
  const rows = [
    [an.stats && `<img src="${stats}" height="170" alt="GitHub stats"/>`, an.languages && `<img src="${langs}" height="170" alt="Top languages"/>`]
      .filter(Boolean)
      .join("\n  "),
    an.streak && `<img src="${streak}" width="70%" alt="Contribution streak"/>`,
    an.activityGraph && `<img src="${graph}" width="100%" alt="Contribution activity graph"/>`,
  ].filter(Boolean);
  if (rows.length) out += section("GitHub analytics", `<div align="center">\n  ${rows.join("\n  <br/><br/>\n  ")}\n</div>`);

  if (an.snake) out += `
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${U}/${U}/output/github-snake-dark.svg"/>
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${U}/${U}/output/github-snake.svg"/>
    <img src="https://raw.githubusercontent.com/${U}/${U}/output/github-snake-dark.svg" width="100%" alt="Snake eating my contribution graph"/>
  </picture>
</div>
`;

  if (socials.length)
    out += section("Let's connect", `<div align="center">\n  ${socials.join("\n  ")}\n</div>`);

  out += `
<img src="./assets/footer.svg" width="100%" alt=""/>
`;
  return out;
}

// ---------------------------------------------------------------- preview.html
const preview = (md) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Profile preview: ${xml(cfg.name)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-dark.css">
<style>body{background:#0d1117;margin:0;padding:32px 16px}.wrap{max-width:1012px;margin:0 auto;border:1px solid #30363d;border-radius:6px;padding:32px}
.crumb{max-width:1012px;margin:0 auto 8px;color:#8b949e;font:14px ${SANS}}</style></head>
<body><div class="crumb">${xml(U)} / README.md</div><article class="wrap markdown-body" id="md"></article>
<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
<script>document.getElementById("md").innerHTML = marked.parse(${JSON.stringify(md).replace(/</g, "\\u003c")});</script>
</body></html>
`;

mkdirSync(join(root, "assets"), { recursive: true });
writeFileSync(join(root, "assets/banner.svg"), banner());
writeFileSync(join(root, "assets/divider.svg"), divider());
writeFileSync(join(root, "assets/footer.svg"), footer());
const md = readme();
writeFileSync(join(root, "README.md"), md);
writeFileSync(join(root, "preview.html"), preview(md));
console.log(`Built profile for @${U}: README.md, preview.html, assets/{banner,divider,footer}.svg`);
