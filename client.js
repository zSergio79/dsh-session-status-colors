/**
 * Client half of the session status colours bundle.
 *
 * The Harness already renders every fact this plugin needs on the sidebar row
 * itself: a Session row is a `treeitem` with `data-row-key="session:<id>"`, it
 * carries `aria-selected="true"` while it is the Session open in the main view,
 * and the 16px leading cell holds a status dot whose `data-state` is `ongoing`
 * while the Session works and `warning` while it waits for the user. An
 * archived row is marked by `aria-description` and by the `_archived` half of
 * its CSS-module class name. The whole feature is therefore one stylesheet: no
 * Session subscription, no DOM rewriting, no polling, no Host calls.
 *
 * Only Session titles are re-coloured. The timestamp, the compact waiting
 * label, the pin marker, the workspace rows, and the hover buttons keep the
 * colours the host gave them. Every colour is mixed from `--dsw-*` theme
 * tokens, with one explicit palette per light and dark mode, and nothing
 * survives the plugin's disposal.
 */
window.__ModuleLoader__.load({
  id: 'dsh-session-status-colors',
  factory() {
    const TAG_ID = 'dsh-session-status-colors/styles';

    /**
     * Row identities.
     *
     * `aria-selected` is the semantic hook for "open in the main view": the
     * host marks the current Session with it on both browsing and search rows.
     * An archived row is recognised by `aria-description`, which the host sets
     * only there, or by the stable half of its CSS-module class name, so a
     * renamed class does not disable the gray on its own.
     */
    const SESSION = '[data-row-key^="session:"]';
    const SEARCH = '[class*="_searchResultRow"]';
    const OPEN = '[aria-selected="true"]';
    const ARCHIVED = ':is([class*="_archived"], [aria-description])';
    const WORKING = ':has([data-state="ongoing"])';
    const WAITING = ':has([data-state="warning"])';
    const NOT = (value) => `:not(${value})`;

    /**
     * `:root` in front of every rule outranks the host's own
     * `.sessionRow.archived .title` (three classes), so the gray never depends
     * on which stylesheet was appended last.
     */
    const ROOT = ':root ';

    /**
     * The title of a browsing row, and of a search-result row. The browsing
     * title is matched as a direct child of the row, which is where the host
     * renders it, so a status chip or plugin decoration deeper in the row can
     * never be mistaken for the label.
     */
    const TITLE = ' > :is(span, div)[class*="_title"]';
    const SEARCH_TITLE = ' [class*="_searchResultTitle"]';

    /**
     * Two palettes, because one formula cannot serve both. Mixed toward the
     * near-black label colour, a light-theme green darkens; mixed toward the
     * near-white one, a dark-theme green would wash out into the plain title
     * beside it. So the dark palette mixes the other way round.
     *
     * In both palettes the most vivid green marks the open Session that is
     * working, the middle tone the open Session at rest, and the palest or
     * deepest the Session that works while you look elsewhere.
     *
     * Measured against the selected row's own fill — the worst case in each
     * palette — light is 4.9 : 1, 6.2 : 1 and 7.9 : 1, dark is 6.0 : 1,
     * 6.9 : 1 and 8.1 : 1. The waiting amber is 5.0 : 1 and 5.6 : 1. All are at
     * or above WCAG AA for this 14px text.
     *
     * Amber is not the only channel for the waiting state: the host replaces
     * the row's timestamp with a compact "Approval" / "Answer" / "Plan" label
     * while a pending interaction exists, so that state keeps a text signal.
     */
    const css = `
/* Session status colours — the sidebar Session title, by state. */
:root {
  --dsc-open-working: color-mix(in srgb, var(--dsw-alias-state-success-primary) 56%, var(--dsw-alias-label-primary));
  --dsc-open: color-mix(in srgb, var(--dsw-alias-state-success-primary) 46%, var(--dsw-alias-label-primary));
  --dsc-working: color-mix(in srgb, var(--dsw-alias-state-success-primary) 36%, var(--dsw-alias-label-primary));
  --dsc-waiting: color-mix(in srgb, var(--dsw-alias-state-warn-label) 62%, var(--dsw-alias-label-primary));
  --dsc-archived: var(--dsw-alias-label-caption);
}

body[data-ds-dark-theme] {
  --dsc-open-working: var(--dsw-alias-state-success-primary);
  --dsc-open: color-mix(in srgb, var(--dsw-alias-state-success-primary) 80%, var(--dsw-alias-label-primary));
  --dsc-working: color-mix(in srgb, var(--dsw-alias-state-success-primary) 60%, var(--dsw-alias-label-primary));
  --dsc-waiting: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 88%, var(--dsw-alias-label-primary));
}

/* Works while you look elsewhere: the quietest green. */
${ROOT}${SESSION}${NOT(ARCHIVED)}${NOT(OPEN)}${NOT(WAITING)}${WORKING}${TITLE},
${ROOT}${SEARCH}${NOT(ARCHIVED)}${NOT(OPEN)}${NOT(WAITING)}${WORKING}${SEARCH_TITLE} {
  color: var(--dsc-working);
}

/* The open Session at rest: the middle green. A finished run you have not
   looked at yet is one of these, so it keeps the "open" tone and the stock
   status dot still tells the two apart. */
${ROOT}${SESSION}${OPEN}${NOT(ARCHIVED)}${NOT(WAITING)}${NOT(WORKING)}${TITLE},
${ROOT}${SEARCH}${OPEN}${NOT(ARCHIVED)}${NOT(WAITING)}${NOT(WORKING)}${SEARCH_TITLE} {
  color: var(--dsc-open);
}

/* The open Session that is also working: the most vivid green. */
${ROOT}${SESSION}${OPEN}${NOT(ARCHIVED)}${NOT(WAITING)}${WORKING}${TITLE},
${ROOT}${SEARCH}${OPEN}${NOT(ARCHIVED)}${NOT(WAITING)}${WORKING}${SEARCH_TITLE} {
  color: var(--dsc-open-working);
}

/* Approval, plan review, or a question: amber. The row is not colour-only —
   the host replaces its timestamp with a compact "Approval" / "Answer" /
   "Plan" label whenever a pending interaction exists, so the state has a text
   channel of its own. */
${ROOT}${SESSION}${WAITING}${NOT(ARCHIVED)}${TITLE},
${ROOT}${SEARCH}${WAITING}${NOT(ARCHIVED)}${SEARCH_TITLE} {
  color: var(--dsc-waiting);
}

/* Archived: grey, matching the host's own caption step. */
${ROOT}${SESSION}${ARCHIVED}${TITLE},
${ROOT}${SEARCH}${ARCHIVED}${SEARCH_TITLE} {
  color: var(--dsc-archived);
}
`;

    return {
      apply(ctx) {
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {};
          const existing = document.querySelector(`style[data-plugin-css="${TAG_ID}"]`);
          if (existing !== null) return () => { existing.remove(); };
          const tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-session-status-colors';
          tag.dataset.pluginCss = TAG_ID;
          tag.textContent = css;
          document.head.appendChild(tag);
          return () => { tag.remove(); };
        }, 'session-status-colors: row stylesheet');
      },
    };
  },
});
