# ⚽ WC26 Sweepstakes Dashboard

A family World Cup 2026 sweepstakes dashboard — everyone draws teams, the wall
(and everyone's phone) shows how they're doing.

**Live site:** https://jackjames-cs.github.io/wc26-sweepstakes/

## How it works

- **No backend.** A static React site on GitHub Pages.
- **Match data** from [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json)
  (fixtures, results, goalscorers — refreshed every 5 minutes).
- **Live scores** overlaid from ESPN's public scoreboard API (polled every 60
  seconds on matchdays).
- **Team metadata** (FIFA codes, flags) is a static file generated from
  [rezarahiminia/worldcup2026](https://github.com/rezarahiminia/worldcup2026).

## After the draw

Edit `src/config/participants.ts` and fill each player's `teams` array with
team names exactly as they appear in `src/data/teams.ts` (openfootball naming,
e.g. `"Czech Republic"`, `"South Korea"`, `"USA"`). Push — that's it.

## Development (only needed to change the code)

The live site needs nothing running — it's static files on GitHub Pages, and
each visitor's browser fetches the match data itself. These commands are only
for editing the site on your own machine:

```bash
npm install
npm run dev      # preview your changes locally before pushing
npm run build    # type-check + production build (GitHub runs this on deploy)
```

Push to `main` and GitHub rebuilds + redeploys the live site automatically.

## Tabs

- **Overview** — the pool: each player's teams + alive/eliminated status, next
  fixtures, Golden Boot top scorers
- **Groups** — all 12 group tables with qualification markers
- **History** — completed results with goalscorers, grouped by day
- **Teams** — all 48 teams with owner badges; tap through for detail

Select a player in the left column (or the Players drawer on mobile) to filter
every tab to their teams.
