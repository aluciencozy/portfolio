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
- Use the virtual shell like a small portfolio filesystem. Commands including
  `cd projects`, `ls`, `cat fe-arena`, `pwd`, and Arrow Up/Down history recall
  never execute a real shell process.
- Press `:` outside an input to open the Neovim command line. Supported commands
  include `:edit`, `:quit`, `:bnext`, `:bprevious`, `:terminal`, `:Explore`, and
  `:buffers`. Vim motions `j`, `k`, `gg`, `G`, `Ctrl+d`, `Ctrl+u`, `g` then `t`,
  and `g` then `Shift+t` work in the portfolio content area. Portfolio mappings
  use Space as leader: `Space e` focuses the explorer and `Space t` toggles the
  terminal. Once focused, the explorer supports `j`, `k`, `h`, `l`, `Enter`,
  `Escape`, and `q`.
- Open the subtle question-mark button in the status line for the complete,
  always-current command and shortcut reference.
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
- Add or change keyboard shortcuts in `neovim-keymaps.ts`, editor commands in
  `neovim-commands.ts`, and simulated shell commands in `terminal-commands.ts`.

## Quality checks

```bash
npm run lint
npx next typegen && npx tsc --noEmit
npm run build
```
