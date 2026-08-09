# Alex Cosentino Portfolio

A Catppuccin Mocha portfolio inspired by Alex's real WezTerm, Starship, and
NvChad setup. On the first visit of a browser session, a fastfetch-style Zsh
boot types `nvim .` and transitions into a recruiter-friendly Neovim workspace.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Use the portfolio

- Open sections from the file explorer or buffer tabs. Section hashes are
  shareable, for example [http://localhost:3000/#projects](http://localhost:3000/#projects).
- Toggle the simulated bottom terminal from the status line or with
  `Ctrl+Backquote`, then enter `help` to see its locally simulated commands.
- Select **Skip intro** to bypass the boot. Reduced-motion preferences shorten
  the transition automatically, and later visits in the same browser session
  open the workspace directly.
- Small screens use a collapsible explorer, while browsers without JavaScript
  receive a scrollable static portfolio.

## Customize the portfolio

- Edit professional content, links, projects, experience, and skills in
  `app/_components/portfolio/data.ts`.
- Replace `public/alex_cosentino_resume.pdf` to update the downloadable resume.
- Set a project's optional `image` field to a public asset path to replace its
  generated visual summary with a screenshot.
- Change `--glass-opacity` or `--glass-blur` in `app/globals.css` to adjust or
  remove the translucent backdrop treatment.

## Quality checks

```bash
npm run lint
npx next typegen && npx tsc --noEmit
npm run build
```
