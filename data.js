/* Clan Hub — event data.
   HOW TO ADD A FUTURE RELEASE: copy an event object, change id/game/launch/playlists.
   The app reads ONLY this file for event content — no code changes needed for a new drop.
   This is the reusable system: Jesse / NE3ULA attaches to a clan per release,
   brings a custom mix + a live stream, and the hub is the clan's home for that weekend. */
window.CLAN_HUB_DATA = {
  clan: {
    name: "Lords of Chaos",
    altName: "Lord of Kaos",
    tagline: "One clan. One launch weekend. One soundtrack.",
    hostName: "NE3ULA",
    hostRole: "Soundtrack + Stream — custom mixes for every release, live on Twitch",
    twitchDefault: "ne3ula_db",
    twitchUrl: "https://www.twitch.tv/ne3ula_db",
    soundcloudArtistUrl: "https://soundcloud.com/ne3ula",
    spotifyArtistName: "NE3ULA"
  },
  events: [
    {
      id: "poe-covens-2026",
      status: "active",
      game: "Path of Exile",
      expansion: "3.30 — Covens of Umbra",
      title: "League Weekend ’26",
      clanRun: "Lords of Chaos Clan Run",
      launchISO: "2026-11-13T19:00:00Z",
      launchLabel: "Fri, Nov 13 · 11:00 AM PST / 2:00 PM EST",
      weekendLabel: "Fri Nov 13 — Sun Nov 15, 2026",
      officialUrl: "https://www.pathofexile.com/covens",
      description: "Ancient witches, forbidden powers, Wickermen built from boss corpses, and Fates that make bosses harder — and far more rewarding. Scarabs are gone: Threads of Creation now let you guarantee the league mechanics you actually want in your maps.",
      mechanics: ["Wickerman system — build effigies from slain bosses", "Fates — manipulate boss difficulty & rewards", "Threads of Creation — replaces Scarabs, guarantee up to 3 mechanics per map", "Atlas & endgame overhaul"],
      spotify: {
        title: "PoE League Weekend ’26 — Lord • Kaos Mix",
        by: "NE3ULA",
        tracksLabel: "24 tracks",
        url: "https://open.spotify.com/playlist/33U09gTplZ4R0NqG1Rgp2T?si=GvAtTHCYQWS6TXzxbCElsw&utm_source=sms&pi=4qJDlEoPSAOA1",
        embedUrl: "https://open.spotify.com/embed/playlist/33U09gTplZ4R0NqG1Rgp2T?utm_source=generator&theme=0"
      },
      soundcloud: {
        title: "Lord Of Kaos — PoE League Mix ’26",
        by: "NE3ULA",
        url: "https://soundcloud.com/ne3ula/sets/lord-of-kaos-leauge-mix-26",
        shortUrl: "https://on.soundcloud.com/FKCYCXNAy4C4DQoQhT",
        embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/ne3ula/sets/lord-of-kaos-leauge-mix-26&color=%23ff3300&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
      },
      schedule: [
        { day: "Friday · Nov 13", time: "11:00 AM PST — Launch", title: "League Start", detail: "Queue together, campaign in Discord voice, mixes on. First to maps calls it in #lfg." },
        { day: "Friday · Nov 13", time: "Evening PST", title: "Campaign Push + Stream", detail: "NE3ULA live on Twitch. Campaign groups form in Party Finder — no one solos the queue alone." },
        { day: "Saturday · Nov 14", time: "All day", title: "Mapping & First Wickermen", detail: "Atlas progression, Threads of Creation testing, first boss Fates. Share drops in Discord." },
        { day: "Sunday · Nov 15", time: "All day", title: "Bossing, Builds & Wrap", detail: "Boss runs, build check-ins, best drops showcase. Vote next event in Discord." }
      ],
      checklist: [
        "Update Path of Exile + pre-download the patch",
        "Loot filter updated for 3.30",
        "Starter build / PoB ready",
        "Spotify or SoundCloud mix queued",
        "Joined the clan Discord + voice channel",
        "Character name planned",
        "Snacks, water, and a second monitor for the stream"
      ]
    },
    {
      id: "poe2-conquerors-2026",
      status: "upcoming",
      game: "Path of Exile 2",
      expansion: "1.0 Full Release — Conquerors of Wraeclast",
      title: "Full Release Weekend",
      clanRun: "Lords of Chaos Clan Run — Next",
      launchISO: "2026-12-11T20:00:00Z",
      launchLabel: "Fri, Dec 11 · 12:00 PM PST",
      weekendLabel: "Fri Dec 11 — Sun Dec 13, 2026",
      officialUrl: "https://pathofexile2.com/conquerors",
      description: "PoE2 leaves Early Access. New Shadow class, final acts, and a territorial-war league — raise an army, build a stronghold, siege bosses and rival camps. This event is already in the system: playlists and stream go here when NE3ULA drops the mix.",
      mechanics: ["Full 1.0 release — free to play on all platforms", "Conquerors of Wraeclast territorial war league", "Choose Ezomyte, Maraketh, or Karui — 23 campaign battles", "New Shadow class"],
      spotify: null,
      soundcloud: null,
      schedule: [
        { day: "Friday · Dec 11", time: "12:00 PM PST — Launch", title: "PoE2 1.0 League Start", detail: "Details land here as the date closes in. Same hub, same clan, new game." }
      ],
      checklist: ["Watch this hub — mix and stream details drop here first"]
    }
  ]
};
