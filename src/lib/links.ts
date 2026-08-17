/**
 * One rule for when a link leaves the page.
 *
 * Two kinds of link open in a new tab: anything on another origin, and anything
 * that resolves to a file rather than a page. The second is the one that gets
 * forgotten. A visitor who taps a PDF and lands in a viewer has lost the page
 * they were reading, and on a phone the back gesture does not always bring it
 * back.
 *
 * mailto: and tel: are deliberately excluded. Those hand off to another
 * application, and opening a blank tab first leaves the visitor staring at one.
 */

/** File extensions we serve as documents rather than pages. */
const DOC_EXTENSIONS = [
  ".pdf", ".zip", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".csv", ".txt",
];

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function isDocumentHref(href: string): boolean {
  // split always returns at least one element, but noUncheckedIndexedAccess
  // does not know that, so fall back explicitly rather than assert.
  const path = (href.split(/[?#]/)[0] ?? href).toLowerCase();
  return DOC_EXTENSIONS.some((ext) => path.endsWith(ext));
}

export function opensInNewTab(href: string): boolean {
  return isExternalHref(href) || isDocumentHref(href);
}

/**
 * Spread onto an anchor or a next/link. Returns nothing for same-page links, so
 * it is safe to spread unconditionally.
 */
export function newTabProps(href: string): { target?: "_blank"; rel?: string } {
  return opensInNewTab(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
