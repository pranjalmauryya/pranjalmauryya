# GitHub Profile: Design Prompt & Build Plan

## 1. The design prompt

> Design and build a **professional GitHub profile README** for a developer focused on
> **AI agents / LLM tooling and full-stack engineering**. It should look polished enough
> that a recruiter, a collaborator or a senior engineer forms a strong first impression
> within **5 seconds**, and read clearly on desktop and mobile in both GitHub dark and light themes.
>
> **Visual identity**
> - Dark, modern "cyber gradient" look: near-black base `#0d1117` (GitHub dark), accent
>   gradient violet `#a78bfa` to cyan `#22d3ee`, with a pink highlight `#f472b6` used sparingly.
> - One consistent palette across *every* element (banner, stat cards, badges, dividers).
>   Nothing should look like it came from a different template.
> - Typography: bold system sans for headings, monospace for code-flavored details.
> - Motion stays subtle: slow drifting gradient orbs, a shimmer on the name, a pulsing
>   "agent graph" motif and a typing tagline. No flashing and no motion clutter.
>
> **Structure (top to bottom)**
> 1. **Hero banner**: a custom animated SVG (owned in-repo, no third-party dependency) showing
>    the name, role, a short value statement and an "open to collaborate" status pill.
> 2. **Typing tagline**: 3–4 rotating lines that say what I build.
> 3. **Quick badges**: profile views, followers, and links to portfolio, LinkedIn, X and email.
> 4. **About me**: a TypeScript object literal (`const me = {...}`) giving role, focus areas,
>    what I'm building, what I'm learning, what to ask me about and one fun fact. It's scannable
>    and reads like code, which suits a developer profile.
> 5. **Tech stack**: icon rows grouped as *Languages · Frameworks · AI & Data · Cloud & DevOps ·
>    Tools*, using one consistent icon set.
> 6. **Featured projects**: 2-column repo cards themed in the palette, 4–6 projects, each with
>    a one-line impact-focused description.
> 7. **GitHub analytics**: stats card + top languages side by side, streak card, contribution
>    activity graph, all matching the palette with borders hidden.
> 8. **Contribution snake**: auto-regenerated daily by a GitHub Action, with dark and light variants.
> 9. **Connect** section + animated footer wave.
>
> **Quality bar**
> - Every external image has `alt` text; layout is centered and consistent.
> - Dark/light handled with `<picture>` + `prefers-color-scheme` where it matters.
> - No broken images: optional sections disappear when not configured.
> - All personal content lives in **one config file**, and the README is *generated*, so
>   updating the profile means editing JSON, not hand-editing HTML.

## 2. Build plan

| Step | What | Output |
|---|---|---|
| 1 | Single source of truth for all personal data | `profile.config.json` |
| 2 | Generator that renders the banner, divider, footer and README from config | `build.mjs` |
| 3 | Custom animated hero banner (SMIL + CSS animation, works inside GitHub `<img>`) | `assets/banner.svg` |
| 4 | Animated gradient divider + footer wave | `assets/divider.svg`, `assets/footer.svg` |
| 5 | README assembled from sections; empty sections are skipped | `README.md` |
| 6 | Daily contribution-snake workflow (Platane/snk → `output` branch) | `.github/workflows/snake.yml` |
| 7 | Local preview page that renders the README GitHub-style | `preview.html` |
| 8 | Log in with `gh auth login` (done by you), read username, repos and bio, fill the config | config updated |
| 9 | Create the special repo `<username>/<username>` and push (only after your go-ahead) | live profile |

## 3. How to update later

```powershell
# edit profile.config.json, then:
node build.mjs
git add -A; git commit -m "Update profile"; git push
```

## 4. Notes

- Stat cards use the public `github-readme-stats` / `streak-stats` instances. They are free but
  occasionally rate-limited; if a card stops loading, those projects can be self-hosted on Vercel
  in a few minutes and the base URL changed in `build.mjs`.
- The snake needs **Settings → Actions → General → Workflow permissions → Read and write**
  on the profile repo, then one manual run from the Actions tab.
