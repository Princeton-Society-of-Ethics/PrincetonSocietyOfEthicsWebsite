/**
 * Form preview mode: add ?preview to a form's URL to click through every step
 * without filling anything in. Nothing is ever submitted to the Google Sheet.
 *
 * Works only on the local dev server (`npm run dev`) and on Vercel preview
 * deployments, so it can be shared for review. Production builds compile it
 * out entirely, so visitors to the live site can't trigger it.
 */
export function isPreviewMode(): boolean {
  return (
    (import.meta.env.DEV || __FORM_PREVIEW_ALLOWED__) &&
    new URLSearchParams(window.location.search).has("preview")
  );
}
