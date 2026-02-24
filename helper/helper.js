/**
 * helpers/helper.js
 *
 * Reusable Modal / Dialog Component
 * ----------------------------------
 * Zero-dependency modal utility. Styles live in styles/styles.css (global).
 *
 * USAGE:
 * ──────
 *   import createModal from '../../helper/helper.js';
 *
 *   const { open, close, overlay, dialog } = createModal({
 *     content        : domElement | htmlString,  // required – modal body content
 *     footer         : domElement | htmlString,  // optional – pinned footer content
 *     id             : 'my-modal',               // optional – used for aria-labelledby
 *     className      : 'my-extra-class',         // optional – extra class on dialog box
 *     onClose        : () => {},                 // optional – callback fired after close
 *     closeOnOverlay : true,                     // optional – click backdrop to dismiss
 *     closeOnEscape  : true,                     // optional – Esc key to dismiss
 *     focusTarget    : null,                     // optional – Element to focus on open
 *   });
 *
 *   open();           // show the modal
 *   close();          // hide the modal (does NOT remove from DOM)
 *   overlay.remove(); // fully tear down when no longer needed
 */

const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

/**
 * createModal(options)
 * @returns {{ open: Function, close: Function, overlay: HTMLElement, dialog: HTMLElement }}
 */
export default function createModal(options = {}) {
  const {
    id = `modal-${Math.random().toString(36).slice(2, 7)}`,
    className = '',
    content = '',
    footer = null,
    onClose = null,
    closeOnOverlay = true,
    closeOnEscape = true,
    focusTarget = null,
  } = options;

  /* ── Overlay (backdrop) ── */
  const overlay = document.createElement('div');
  overlay.className = 'hc-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', `${id}-title`);

  /* ── Dialog box ── */
  const dialog = document.createElement('div');
  dialog.className = ['hc-modal-dialog', className].filter(Boolean).join(' ');

  /* ── Close button (top-right) ── */
  const closeBtn = document.createElement('button');
  closeBtn.className = 'hc-modal-close-btn';
  closeBtn.setAttribute('aria-label', 'Close dialog');
  closeBtn.innerHTML = CLOSE_ICON;

  /* ── Body ── */
  const body = document.createElement('div');
  body.className = 'hc-modal-body';

  if (content instanceof Element) {
    body.appendChild(content);
  } else if (typeof content === 'string') {
    body.innerHTML = content;
  }

  dialog.append(closeBtn, body);

  /* ── Optional footer ── */
  if (footer) {
    const footerEl = document.createElement('div');
    footerEl.className = 'hc-modal-footer';

    if (footer instanceof Element) {
      footerEl.appendChild(footer);
    } else if (typeof footer === 'string') {
      footerEl.innerHTML = footer;
    }

    dialog.appendChild(footerEl);
  }

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  /* ── open() ── */
  function open() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    const target = focusTarget
      || dialog.querySelector('input, textarea, select, button, [tabindex]:not([tabindex="-1"])');
    if (target) setTimeout(() => target.focus(), 80);
  }

  /* ── close() ── */
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (typeof onClose === 'function') onClose();
  }

  /* ── Built-in dismiss events ── */
  closeBtn.addEventListener('click', close);

  if (closeOnOverlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  if (closeOnEscape) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  return {
    open, close, overlay, dialog,
  };
}
