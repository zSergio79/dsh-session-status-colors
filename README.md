# Session status colours

Colours a sidebar Session's **title** by the state the Harness already renders on
the row, so the list reads at a glance:

| State | Colour |
| --- | --- |
| Open in the main view **and** working | the most vivid green |
| Open in the main view, at rest | the middle green |
| Working while you look elsewhere | the quietest green |
| Waiting on you — approval, plan review, or a question | amber |
| Archived | grey |
| Everything else | the theme's normal label colour |

Only Session titles change. Timestamps, the compact waiting label, the pin
marker, the status dots, workspace rows, and the hover buttons keep the colours
the host gives them. Search-result rows follow the same rules.

The two green tones answer "is it working, or just open?" without a second
glance. The state is never carried by colour alone: the host replaces a waiting
row's timestamp with a compact **Approval** / **Answer** / **Plan** label, and it
keeps its status dot on every live row.

## How it works

The sidebar row already carries everything needed: it is a `treeitem` with
`data-row-key="session:<id>"`, it marks the Session open in the main view with
`aria-selected="true"`, it sets `aria-description` only on an archived row, and
its leading cell holds a status dot whose `data-state` is `ongoing` while the
Session works and `warning` while it waits for the user. The plugin therefore
installs one stylesheet and nothing else — no Session subscription, no DOM
rewriting, no polling, no Host calls.

Every colour is mixed at runtime from `--dsw-*` theme tokens
(`--dsw-alias-state-success-primary`, `--dsw-alias-state-warn-label`,
`--dsw-alias-label-primary`, `--dsw-alias-label-caption`). Light and dark use
separate mixes, because a single formula cannot stay readable in both: mixed
toward the near-black label colour a green darkens on the light palette, while
the same mix turns near-white and washes out on the dark one.

Measured against the selected row's own fill — the worst case — the greens are
4.9 : 1, 6.2 : 1 and 7.9 : 1 in the light theme and 6.0 : 1, 6.9 : 1 and
8.1 : 1 in the dark one; amber is 5.0 : 1 and 5.6 : 1. All are at or above
WCAG AA for this 14px text. Archived rows keep the host's own caption step, so
they read exactly as inactive as before.

## Install

The bundle is a normal DSH profile bundle: **Plugins → Add plugin** (or the
official `dsh plugin --profile <name> add <dir>`), pointing at this directory.
It has no configuration and no settings page.

## Turn it off

Disabling the bundle removes its stylesheet immediately; the rows return to the
stock look.
"# dsh-session-status-colors"  git init git add README.md git commit -m "first commit" git branch -M main git remote add origin https://github.com/zSergio79/dsh-session-status-colors.git git push -u origin main
