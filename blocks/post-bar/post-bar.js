/**
 * Post Bar Block — Adobe Connect EDS
 * Renders a sticky "What's happening?" bar that opens a Create Post modal.
 * Allowed attachments: PNG / JPG / JPEG images, PDF documents, MP4 videos.
 */

/* ── SVG Icons ────────────────────────────────────────────────────────────── */
const ICONS = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  removeChip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
};

/* ── Allowed file types ───────────────────────────────────────────────────── */
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg']);
const ALLOWED_DOC_TYPES = new Set(['application/pdf']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4']);

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function truncateName(name, max = 24) {
  if (name.length <= max) return name;
  const ext = name.includes('.') ? `.${name.split('.').pop()}` : '';
  return `${name.slice(0, max - ext.length - 1)}…${ext}`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function showToast(message, type = 'info') {
  let toast = document.querySelector('.post-bar-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'post-bar-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ── Modal Builder ────────────────────────────────────────────────────────── */
function buildModal() {
  const overlay = document.createElement('div');
  overlay.className = 'post-bar-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'post-bar-modal-title');

  const modal = document.createElement('div');
  modal.className = 'post-bar-modal';

  // Floating close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'post-bar-modal-close';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.innerHTML = ICONS.close;
  modal.appendChild(closeBtn);

  /* Body */
  const body = document.createElement('div');
  body.className = 'post-bar-modal-body';

  // ── Drag & Drop overlay inside modal body ──
  const dropZone = document.createElement('div');
  dropZone.className = 'post-bar-drop-zone';
  dropZone.setAttribute('aria-hidden', 'true');
  dropZone.innerHTML = `
    <div class="post-bar-drop-zone-inner">
      ${ICONS.paperclip}
      <span>Drop files here</span>
    </div>
  `;
  modal.appendChild(dropZone);

  // User row
  const userRow = document.createElement('div');
  userRow.className = 'post-bar-modal-user';

  const avatar = document.createElement('div');
  avatar.className = 'post-bar-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'U';

  const userInfo = document.createElement('div');
  const userName = document.createElement('div');
  userName.className = 'post-bar-modal-user-name';
  userName.textContent = 'You';
  const userRole = document.createElement('div');
  userRole.className = 'post-bar-modal-user-role';
  userRole.textContent = 'Sharing to: Everyone';
  userInfo.append(userName, userRole);
  userRow.append(avatar, userInfo);

  // Title input (bold)
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'post-bar-title-input';
  titleInput.placeholder = 'Title';
  titleInput.setAttribute('aria-label', 'Post title');

  // Divider between title and body
  const titleDivider = document.createElement('hr');
  titleDivider.className = 'post-bar-title-divider';

  // Textarea (no character limit)
  const textarea = document.createElement('textarea');
  textarea.className = 'post-bar-textarea';
  textarea.placeholder = 'What do you want to share?';
  textarea.setAttribute('aria-label', 'Post content');

  // ── Image Carousel ──────────────────────────────────────────────────────
  const carousel = document.createElement('div');
  carousel.className = 'post-bar-carousel';
  carousel.hidden = true;

  const carouselImg = document.createElement('img');
  carouselImg.className = 'post-bar-carousel-img';
  carouselImg.alt = '';

  const carouselCounter = document.createElement('span');
  carouselCounter.className = 'post-bar-carousel-counter';

  const carouselRemove = document.createElement('button');
  carouselRemove.className = 'post-bar-carousel-remove';
  carouselRemove.setAttribute('aria-label', 'Remove current image');
  carouselRemove.innerHTML = ICONS.close;

  const carouselPrev = document.createElement('button');
  carouselPrev.className = 'post-bar-carousel-nav post-bar-carousel-prev';
  carouselPrev.setAttribute('aria-label', 'Previous image');
  carouselPrev.innerHTML = ICONS.chevronLeft;

  const carouselNext = document.createElement('button');
  carouselNext.className = 'post-bar-carousel-nav post-bar-carousel-next';
  carouselNext.setAttribute('aria-label', 'Next image');
  carouselNext.innerHTML = ICONS.chevronRight;

  const carouselDots = document.createElement('div');
  carouselDots.className = 'post-bar-carousel-dots';

  const carouselAdd = document.createElement('button');
  carouselAdd.className = 'post-bar-carousel-add';
  carouselAdd.setAttribute('aria-label', 'Add more images');
  carouselAdd.innerHTML = ICONS.plus;

  carousel.append(
    carouselImg,
    carouselCounter,
    carouselRemove,
    carouselPrev,
    carouselNext,
    carouselDots,
    carouselAdd,
  );

  // Hidden file input — restricted to allowed types
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.multiple = true;
  fileInput.accept = 'image/png,image/jpeg,.pdf,video/mp4';
  fileInput.className = 'post-bar-file-input';

  // File attachment chips (PDF / MP4)
  const chips = document.createElement('div');
  chips.className = 'post-bar-attachments';

  body.append(
    userRow,
    titleInput,
    titleDivider,
    textarea,
    carousel,
    fileInput,
    chips,
  );

  /* Footer */
  const footer = document.createElement('div');
  footer.className = 'post-bar-modal-footer';

  // Left: Media button only
  const footerLeft = document.createElement('div');
  footerLeft.className = 'post-bar-footer-left';

  const attachBtn = document.createElement('button');
  attachBtn.className = 'post-bar-attach-btn';
  attachBtn.setAttribute('aria-label', 'Attach files');
  attachBtn.innerHTML = `${ICONS.paperclip}<span>Media</span>`;

  footerLeft.append(attachBtn);

  const footerActions = document.createElement('div');
  footerActions.className = 'post-bar-footer-actions';

  const discardBtn = document.createElement('button');
  discardBtn.className = 'post-bar-discard-btn';
  discardBtn.textContent = 'Discard';

  const submitBtn = document.createElement('button');
  submitBtn.className = 'post-bar-submit-btn';
  submitBtn.textContent = 'Post';
  submitBtn.disabled = true;

  footerActions.append(discardBtn, submitBtn);
  footer.append(footerLeft, footerActions);

  modal.append(body, footer);
  overlay.appendChild(modal);

  return {
    overlay,
    modal,
    closeBtn,
    titleInput,
    textarea,
    attachBtn,
    fileInput,
    submitBtn,
    discardBtn,
    chips,
    carousel,
    carouselImg,
    carouselCounter,
    carouselRemove,
    carouselPrev,
    carouselNext,
    carouselDots,
    carouselAdd,
    dropZone,
  };
}

/* ── File Attachment Chip (PDF / MP4) ─────────────────────────────────────── */
function addAttachmentChip(file, chipsEl) {
  const chip = document.createElement('div');
  chip.className = 'post-bar-attachment-chip';
  chip.dataset.name = file.name;
  chip.dataset.mimeType = file.type;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'post-bar-attachment-remove';
  removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
  removeBtn.innerHTML = ICONS.removeChip;
  removeBtn.addEventListener('click', () => chip.remove());

  const label = document.createElement('span');
  label.title = `${file.name} (${formatBytes(file.size)})`;
  label.textContent = truncateName(file.name);

  chip.append(label, removeBtn);
  chipsEl.appendChild(chip);
}

/* ── Main Block Decorator ─────────────────────────────────────────────────── */
export default function decorate(block) {
  block.innerHTML = '';

  /* ── Sticky bar UI ── */
  const barRow = document.createElement('div');

  const avatar = document.createElement('div');
  avatar.className = 'post-bar-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = 'U';

  const inputTrigger = document.createElement('button');
  inputTrigger.className = 'post-bar-input-trigger';
  inputTrigger.setAttribute('aria-haspopup', 'dialog');
  inputTrigger.setAttribute('aria-label', 'Create a post');
  inputTrigger.textContent = "What's happening?";

  const postBtn = document.createElement('button');
  postBtn.className = 'post-bar-btn';
  postBtn.setAttribute('aria-haspopup', 'dialog');
  postBtn.innerHTML = `${ICONS.plus}<span>Post</span>`;

  barRow.append(avatar, inputTrigger, postBtn);
  block.appendChild(barRow);

  /* ── Build modal ── */
  const {
    overlay, modal, closeBtn, titleInput, textarea, attachBtn, fileInput,
    submitBtn, discardBtn, chips, carousel, carouselImg, carouselCounter,
    carouselRemove, carouselPrev, carouselNext, carouselDots, carouselAdd,
    dropZone,
  } = buildModal();
  document.body.appendChild(overlay);

  /* ── Image carousel state ── */
  let imageEntries = [];
  let carouselIndex = 0;

  /* ── Submit state ── */
  const updateSubmitState = () => {
    const hasContent = titleInput.value.trim().length > 0
      || textarea.value.length > 0
      || imageEntries.length > 0
      || chips.querySelectorAll('.post-bar-attachment-chip').length > 0;
    submitBtn.disabled = !hasContent;
  };

  /* ── Carousel render ── */
  const renderCarousel = () => {
    const count = imageEntries.length;
    carousel.hidden = count === 0;
    if (count === 0) return;

    carouselImg.src = imageEntries[carouselIndex].url;
    carouselImg.alt = imageEntries[carouselIndex].name;
    carouselCounter.textContent = `${carouselIndex + 1} / ${count}`;

    carouselPrev.hidden = count <= 1;
    carouselNext.hidden = count <= 1;

    carouselDots.innerHTML = '';
    if (count > 1) {
      imageEntries.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `post-bar-carousel-dot${i === carouselIndex ? ' active' : ''}`;
        carouselDots.appendChild(dot);
      });
    }
  };

  /* ── Open / close ── */
  const openModal = () => {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => titleInput.focus(), 80);
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const discardModal = () => {
    titleInput.value = '';
    textarea.value = '';
    chips.innerHTML = '';
    imageEntries.forEach((e) => URL.revokeObjectURL(e.url));
    imageEntries = [];
    carouselIndex = 0;
    renderCarousel();
    updateSubmitState();
    closeModal();
  };

  /* ── Event wiring ── */
  inputTrigger.addEventListener('click', openModal);
  postBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  discardBtn.addEventListener('click', discardModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });

  titleInput.addEventListener('input', updateSubmitState);
  textarea.addEventListener('input', updateSubmitState);

  // Carousel navigation
  carouselPrev.addEventListener('click', () => {
    if (carouselIndex > 0) { carouselIndex -= 1; renderCarousel(); }
  });

  carouselNext.addEventListener('click', () => {
    if (carouselIndex < imageEntries.length - 1) { carouselIndex += 1; renderCarousel(); }
  });

  carouselRemove.addEventListener('click', () => {
    URL.revokeObjectURL(imageEntries[carouselIndex].url);
    imageEntries.splice(carouselIndex, 1);
    carouselIndex = Math.min(carouselIndex, Math.max(0, imageEntries.length - 1));
    renderCarousel();
    updateSubmitState();
  });

  carouselAdd.addEventListener('click', () => fileInput.click());

  /* ── File handling (validated) ── */
  const handleFiles = (files) => {
    const rejected = [];

    [...files].forEach((file) => {
      if (ALLOWED_IMAGE_TYPES.has(file.type)) {
        imageEntries.push({ url: URL.createObjectURL(file), name: file.name });
      } else if (ALLOWED_DOC_TYPES.has(file.type) || ALLOWED_VIDEO_TYPES.has(file.type)) {
        addAttachmentChip(file, chips);
      } else {
        rejected.push(file.name);
      }
    });

    if (rejected.length > 0) {
      showToast(
        `${rejected.length} file(s) rejected — only PNG/JPG/JPEG images, PDF documents, and MP4 videos are allowed.`,
        'error',
      );
    }

    if (imageEntries.length > 0) carouselIndex = imageEntries.length - 1;
    renderCarousel();
    updateSubmitState();
  };

  attachBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const { files } = fileInput;
    if (files && files.length) handleFiles(files);
    fileInput.value = '';
  });

  /* ── Drag & Drop ── */
  let dragCounter = 0;

  modal.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter += 1;
    if (dragCounter === 1) dropZone.classList.add('is-active');
  });

  modal.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter -= 1;
    if (dragCounter === 0) dropZone.classList.remove('is-active');
  });

  modal.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  modal.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropZone.classList.remove('is-active');
    const { files } = e.dataTransfer;
    if (files && files.length) handleFiles(files);
  });

  /* ── Submit ── */
  submitBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const text = textarea.value.trim();
    const chipEls = [...chips.querySelectorAll('.post-bar-attachment-chip')];

    if (!title && !text && imageEntries.length === 0 && chipEls.length === 0) return;

    const submittedImages = imageEntries.map((e) => ({ url: e.url, name: e.name }));
    const submittedAttachments = chipEls.map((el) => ({
      name: el.dataset.name,
      mimeType: el.dataset.mimeType,
    }));

    document.dispatchEvent(new CustomEvent('post-bar:submit', {
      detail: {
        title,
        text,
        images: submittedImages,
        attachments: submittedAttachments,
        links: [],
      },
    }));

    showToast('Your post has been shared!');

    titleInput.value = '';
    textarea.value = '';
    chips.innerHTML = '';
    imageEntries = [];
    carouselIndex = 0;
    renderCarousel();
    updateSubmitState();
    closeModal();
  });
}
