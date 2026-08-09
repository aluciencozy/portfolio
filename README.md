# Alex Cosentino Portfolio

A Catppuccin Mocha portfolio inspired by Alex's real WezTerm, Starship, and
NvChad setup. The site boots through a simulated Zsh terminal, types `nvim .`,
and transitions into a recruiter-friendly Neovim workspace.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
npx tsc --noEmit
npm run build
```
