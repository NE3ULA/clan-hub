# Clan Hub — Lords of Chaos

A reusable, standalone clan hub for game-release weekends, in Jesse's GitHub
repo architecture: own repo under NE3ULA, plain static site (no build step, no
dependencies), GitHub Pages via Actions, browser-local data only.

**Live:** https://ne3ula.github.io/clan-hub/
**Repo:** NE3ULA/clan-hub
**Sharing with a collaborator?** Send the one link to
[COLLABORATOR_BRIEF.md](https://github.com/NE3ULA/clan-hub/blob/main/COLLABORATOR_BRIEF.md)
— written for Taylor, the clan's PoE Legend: the hub, both mixes, the stream,
the weekend plan, and exactly what his input is needed on, all on one page.

## The bigger idea

Jesse / NE3ULA attaches to a gaming clan for game releases and brings:

1. **The soundtrack** — a custom NE3ULA mix per release (Spotify + SoundCloud)
2. **The stream** — live on Twitch (`ne3ula_db`) for launch weekend
3. **The hub** — this app: countdown, music, stream, Discord party finder

Event #1 is the Lords of Chaos Path of Exile run. The next release (already
stubbed in the system: PoE2 1.0 — Conquerors of Wraeclast, Dec 11 2026) is
not a new app — it's a new event in `data.js`.

## Event #1 — Path of Exile 3.30: Covens of Umbra

- **Launch:** Fri Nov 13, 2026, 19:00 UTC (11:00 AM PST)
- **Clan run:** Lords of Chaos (user wrote "Lourdes of chaos"; mixes brand it Lord of Kaos)
- **Spotify:** "PoE League Weekend '26 — Lord • Kaos Mix" by NE3ULA (24 tracks)
  https://open.spotify.com/playlist/33U09gTplZ4R0NqG1Rgp2T
- **SoundCloud:** "Lord Of Kaos — PoE League Mix '26" by NE3ULA
  https://soundcloud.com/ne3ula/sets/lord-of-kaos-leauge-mix-26
- **Official league:** https://www.pathofexile.com/covens

## How it works

- **War Room** — live countdown to launch, weekend schedule, event switcher
- **Music** — Spotify and SoundCloud players embedded and playable in-app,
  with a player toggle for mobile; "Copy for Discord" playlist pack
- **Live** — Twitch embed built from the saved channel (defaults to
  `ne3ula_db`, parent domain handled from the current host), host LIVE toggle,
  and a one-tap "Going Live" Discord announcement
- **Discord / Party** — the Discord integration is a workflow, not a link:
  - Save invite link, Server ID, and voice channel once (localStorage)
  - If a Server ID is saved, the real Discord widget embeds in-app
    (Server Settings → Widget → Server ID, widget enabled)
  - **Party Finder / LFG board** — post a party, filter by activity, and
    copy a formatted Discord LFG post per card, or the full roster at once
  - **Ready Check** — add members, toggle ready, progress bar, copy the
    formatted ready check to Discord
- **Plan** — league-start checklist (saved per event) + the host playbook
  for future releases

Mobile: bottom nav, touch-friendly. Desktop: top nav, two-column layout.
Add to Home Screen via `manifest.webmanifest`; the service worker is
network-first for navigations (bump `CACHE` in `sw.js` on every release).

## Adding a future release

Copy an event in `data.js`, change `id`, game, `launchISO`, playlists,
schedule, and checklist. Nothing else changes. See the PoE2 event already
in `data.js` as the template.

## Data

All user data (settings, LFG board, ready check, checklists) is stored only
in the browser under `clan-hub-v1-*` keys. Nothing is sent anywhere; Discord
integration works by copying formatted posts the player pastes themselves,
plus the official Discord widget when a Server ID is provided.

## Run locally

```sh
python3 -m http.server 8080
# → http://localhost:8080
```

Twitch embeds require the serving hostname to be passed as `parent` —
the app does this automatically from `location.hostname`.
