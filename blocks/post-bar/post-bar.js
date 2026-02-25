import createModal from '../../helper/helper.js';

const ICONS = {
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  attach: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
};

export default function decorate(block) {
  // Make the containing section sticky
  const section = block.closest('.section');
  if (section) section.classList.add('post-bar-section');

  block.innerHTML = '';

  /* ── Bar row ── */
  const barRow = document.createElement('div');
  barRow.className = 'post-bar-row';

  const avatar = document.createElement('div');
  avatar.className = 'post-bar-avatar';
  avatar.textContent = 'U';

  const inputTrigger = document.createElement('button');
  inputTrigger.type = 'button';
  inputTrigger.className = 'post-bar-input-trigger';
  inputTrigger.textContent = "What's on your mind?";

  const postBtn = document.createElement('button');
  postBtn.type = 'button';
  postBtn.className = 'post-bar-btn';
  postBtn.innerHTML = `${ICONS.plus}<span>Post</span>`;

  barRow.append(avatar, inputTrigger, postBtn);

  const inner = document.createElement('div');
  inner.className = 'post-bar-inner';
  inner.appendChild(barRow);
  block.appendChild(inner);

  /* ── Toast ── */
  function showToast(message, type = 'success') {
    const old = document.querySelector('.post-bar-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = `post-bar-toast post-bar-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ── Modal content ── */
  const modalContent = document.createElement('div');
  modalContent.className = 'post-bar-modal';

  const authorRow = document.createElement('div');
  authorRow.className = 'post-bar-modal-author';

  const modalAvatar = document.createElement('div');
  modalAvatar.className = 'post-bar-avatar post-bar-modal-avatar';
  modalAvatar.textContent = 'U';

  const authorName = document.createElement('span');
  authorName.className = 'post-bar-modal-name';
  authorName.textContent = 'User';

  authorRow.append(modalAvatar, authorName);

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'post-bar-modal-title';
  titleInput.placeholder = 'Post title (optional)';

  const bodyTextarea = document.createElement('textarea');
  bodyTextarea.className = 'post-bar-modal-body';
  bodyTextarea.placeholder = "What's on your mind?";
  bodyTextarea.rows = 4;

  /* ── Drop zone ── */
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.className = 'post-bar-file-input';
  fileInput.multiple = true;
  fileInput.accept = 'image/*,video/*,.pdf,.doc,.docx';

  const fileLabel = document.createElement('label');
  fileLabel.className = 'post-bar-file-label';
  fileLabel.textContent = 'browse';
  fileLabel.appendChild(fileInput);

  const dropZone = document.createElement('div');
  dropZone.className = 'post-bar-drop-zone';

  const dropIcon = document.createElement('span');
  dropIcon.className = 'post-bar-drop-icon';
  dropIcon.innerHTML = ICONS.image;

  const dropText = document.createElement('span');
  dropText.append('Drag & drop files here or ', fileLabel);

  dropZone.append(dropIcon, dropText);

  /* ── Carousel & chips ── */
  const carousel = document.createElement('div');
  carousel.className = 'post-bar-carousel';

  const chipList = document.createElement('div');
  chipList.className = 'post-bar-chip-list';

  let attachedFiles = [];

  function renderAttachments() {
    chipList.innerHTML = '';
    carousel.innerHTML = '';
    carousel.style.display = attachedFiles.length ? 'flex' : 'none';

    attachedFiles.forEach((file, idx) => {
      /* Chip */
      const chip = document.createElement('div');
      chip.className = 'post-bar-chip';

      const chipName = document.createElement('span');
      chipName.className = 'post-bar-chip-name';
      chipName.textContent = file.name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'post-bar-chip-remove';
      removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        attachedFiles.splice(idx, 1);
        renderAttachments();
      });

      chip.append(chipName, removeBtn);
      chipList.appendChild(chip);

      /* Carousel slide */
      const slide = document.createElement('div');
      slide.className = 'post-bar-carousel-slide';

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        slide.appendChild(img);
      } else {
        const filePreview = document.createElement('div');
        filePreview.className = 'post-bar-carousel-file';
        filePreview.innerHTML = ICONS.attach;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = file.name;
        filePreview.appendChild(nameSpan);
        slide.appendChild(filePreview);
      }

      carousel.appendChild(slide);
    });
  }

  function handleFiles(files) {
    attachedFiles = [...attachedFiles, ...Array.from(files)];
    renderAttachments();
  }

  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('is-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('is-over');
    handleFiles(e.dataTransfer.files);
  });

  modalContent.append(authorRow, titleInput, bodyTextarea, dropZone, carousel, chipList);

  /* ── Modal footer ── */
  const modalFooter = document.createElement('div');
  modalFooter.className = 'post-bar-modal-footer';

  const attachActions = document.createElement('div');
  attachActions.className = 'post-bar-modal-attach-actions';

  [
    { icon: ICONS.image, title: 'Add image' },
    { icon: ICONS.video, title: 'Add video' },
    { icon: ICONS.attach, title: 'Add attachment' },
  ].forEach(({ icon, title }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'post-bar-attach-btn';
    btn.title = title;
    btn.innerHTML = icon;
    btn.addEventListener('click', () => fileInput.click());
    attachActions.appendChild(btn);
  });

  const footerActions = document.createElement('div');
  footerActions.className = 'post-bar-modal-footer-actions';

  const discardBtn = document.createElement('button');
  discardBtn.type = 'button';
  discardBtn.className = 'post-bar-discard-btn';
  discardBtn.textContent = 'Discard';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'post-bar-submit-btn';
  submitBtn.textContent = 'Post';

  footerActions.append(discardBtn, submitBtn);
  modalFooter.append(attachActions, footerActions);

  /* ── Create modal ── */
  const { open, close } = createModal({
    content: modalContent,
    footer: modalFooter,
    id: 'post-bar-modal',
    className: 'post-bar-modal-dialog',
    closeOnOverlay: true,
    closeOnEscape: true,
    onClose: () => {
      titleInput.value = '';
      bodyTextarea.value = '';
      attachedFiles = [];
      renderAttachments();
    },
  });

  inputTrigger.addEventListener('click', open);
  postBtn.addEventListener('click', open);
  discardBtn.addEventListener('click', close);

  submitBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const body = bodyTextarea.value.trim();

    if (!body && !title) {
      showToast('Please write something to post.', 'error');
      return;
    }

    showToast('Post published!', 'success');
    close();
  });

  renderAttachments();
}
