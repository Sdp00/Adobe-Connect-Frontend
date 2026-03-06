import createModal from '../../helper/helper.js';

const ICONS = {
  plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  attach: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
};

/* ── Upload a single file to Supabase Storage ── */
async function uploadFile(file) {
  const client = window.SupabaseUtils.client;
  const filePath = `posts/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  const { data, error } = await client.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = client.storage
    .from('uploads')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export default function decorate(block) {
  const pathname = window.location.pathname;
const isHomePage = pathname === '/'
  || pathname === '/index'
  || pathname === '/index.html'
  || pathname === '/admin';
  
  if (!isHomePage) {
    const wrapperSection = block.closest('.section');
    if (wrapperSection) wrapperSection.style.display = 'none';
    return;
  }

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

  const authorInfo = document.createElement('div');
  authorInfo.className = 'post-bar-modal-author-info';

  const authorName = document.createElement('span');
  authorName.className = 'post-bar-modal-name';
  authorName.textContent = 'You';

  const authorSubtitle = document.createElement('span');
  authorSubtitle.className = 'post-bar-modal-subtitle';
  authorSubtitle.textContent = 'Sharing to: Everyone';

  authorInfo.append(authorName, authorSubtitle);
  authorRow.append(modalAvatar, authorInfo);

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'post-bar-modal-title';
  titleInput.placeholder = 'Title';

  const bodyTextarea = document.createElement('textarea');
  bodyTextarea.className = 'post-bar-modal-body';
  bodyTextarea.placeholder = 'What do you want to share?';
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

  carousel.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });

  const chipList = document.createElement('div');
  chipList.className = 'post-bar-chip-list';

  let attachedFiles = [];
  let carouselIndex = 0;

  function goToSlide(direction = 'next') {
    const slides = carousel.querySelectorAll('.post-bar-carousel-slide');
    const dots = carousel.querySelectorAll('.post-bar-carousel-dot');

    slides.forEach((slide, i) => {
      slide.classList.remove('is-active', 'slide-from-left');
      if (i === carouselIndex) {
        slide.classList.add('is-active');
        if (direction === 'prev') slide.classList.add('slide-from-left');
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === carouselIndex));
  }

  function buildCarousel() {
    carousel.innerHTML = '';

    if (attachedFiles.length === 0) {
      carousel.style.display = 'none';
      return;
    }

    if (carouselIndex >= attachedFiles.length) {
      carouselIndex = attachedFiles.length - 1;
    }

    carousel.style.display = 'block';

    const track = document.createElement('div');
    track.className = 'post-bar-carousel-track';

    attachedFiles.forEach((file, i) => {
      const slide = document.createElement('div');
      slide.className = `post-bar-carousel-slide${i === carouselIndex ? ' is-active' : ''}`;

      if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        slide.appendChild(img);
      } else {
        const preview = document.createElement('div');
        preview.className = 'post-bar-carousel-file';
        preview.innerHTML = file.type.startsWith('video/') ? ICONS.video : ICONS.attach;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = file.name;
        preview.appendChild(nameSpan);
        slide.appendChild(preview);
      }

      track.appendChild(slide);
    });

    carousel.appendChild(track);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'post-bar-carousel-remove';
    removeBtn.setAttribute('aria-label', `Remove ${attachedFiles[carouselIndex].name}`);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      removeBtn.blur();
      const modalBody = carousel.closest('.hc-modal-body');
      const savedScroll = modalBody ? modalBody.scrollTop : 0;
      attachedFiles.splice(carouselIndex, 1);
      if (carouselIndex >= attachedFiles.length) {
        carouselIndex = Math.max(0, attachedFiles.length - 1);
      }
      buildCarousel();
      if (modalBody) {
        modalBody.scrollTop = savedScroll;
        requestAnimationFrame(() => { modalBody.scrollTop = savedScroll; });
      }
    });
    carousel.appendChild(removeBtn);

    if (attachedFiles.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'post-bar-carousel-nav post-bar-carousel-prev';
      prevBtn.setAttribute('aria-label', 'Previous');
      prevBtn.innerHTML = '&#8249;';
      prevBtn.addEventListener('click', () => {
        carouselIndex = (carouselIndex - 1 + attachedFiles.length) % attachedFiles.length;
        goToSlide('prev');
      });

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'post-bar-carousel-nav post-bar-carousel-next';
      nextBtn.setAttribute('aria-label', 'Next');
      nextBtn.innerHTML = '&#8250;';
      nextBtn.addEventListener('click', () => {
        carouselIndex = (carouselIndex + 1) % attachedFiles.length;
        goToSlide('next');
      });

      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);

      const dots = document.createElement('div');
      dots.className = 'post-bar-carousel-dots';
      attachedFiles.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `post-bar-carousel-dot${i === carouselIndex ? ' is-active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          const dir = i > carouselIndex ? 'next' : 'prev';
          carouselIndex = i;
          goToSlide(dir);
        });
        dots.appendChild(dot);
      });
      carousel.appendChild(dots);
    }
  }

  function handleFiles(files) {
    attachedFiles = [...attachedFiles, ...Array.from(files)];
    carouselIndex = attachedFiles.length - 1;
    buildCarousel();
  }

  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  modalContent.addEventListener('dragover', (e) => {
    e.preventDefault();
    modalContent.classList.add('is-drag-over');
  });
  modalContent.addEventListener('dragleave', (e) => {
    if (!modalContent.contains(e.relatedTarget)) {
      modalContent.classList.remove('is-drag-over');
    }
  });
  modalContent.addEventListener('drop', (e) => {
    e.preventDefault();
    modalContent.classList.remove('is-drag-over');
    handleFiles(e.dataTransfer.files);
  });

  const titleDivider = document.createElement('hr');
  titleDivider.className = 'post-bar-modal-divider';

  modalContent.append(authorRow, titleInput, titleDivider, bodyTextarea, carousel, chipList);

  /* ── Modal footer ── */
  const modalFooter = document.createElement('div');
  modalFooter.className = 'post-bar-modal-footer';

  const attachActions = document.createElement('div');
  attachActions.className = 'post-bar-modal-attach-actions';

  const mediaBtn = document.createElement('button');
  mediaBtn.type = 'button';
  mediaBtn.className = 'post-bar-attach-btn post-bar-media-btn';
  mediaBtn.innerHTML = `${ICONS.attach}<span>Media</span>`;
  mediaBtn.addEventListener('click', () => fileInput.click());
  attachActions.appendChild(mediaBtn);

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
      buildCarousel();
    },
  });

  inputTrigger.addEventListener('click', open);
  postBtn.addEventListener('click', open);
  discardBtn.addEventListener('click', close);

  /* ── CHANGED: submit now uploads media and saves to Supabase ── */
  submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const body = bodyTextarea.value.trim();

    if (!body && !title) {
      showToast('Please write something to post.', 'error');
      return;
    }

    if (!window.SupabaseUtils) {
      showToast('Supabase not ready. Please try again.', 'error');
      return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
      // Upload all image/video files
      const mediaFiles = attachedFiles.filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
      let mediaUrls = [];
      if (mediaFiles.length > 0) {
        submitBtn.textContent = 'Uploading media...';
        mediaUrls = await Promise.all(mediaFiles.map((f) => uploadFile(f)));
      }

      // Extract hashtags from title + body
      const tags = `${title} ${body}`.match(/#\w+/g) || [];

      // Save to Supabase posts table
      submitBtn.textContent = 'Saving...';
      const { error: dbError } = await window.SupabaseUtils.client
        .from('posts')
        .insert({
          user_name: 'You',
          user_role: 'Member',
          post_description: body,
          tags: tags.join(', '),
          media: mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : null,
        });

      if (dbError) {
        showToast(`Failed to post: ${dbError.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post';
        return;
      }

      // Dispatch event so Feed.js picks it up immediately without page refresh
      document.dispatchEvent(new CustomEvent('post-bar:submit', {
        detail: {
          title,
          text: body,
          images: mediaUrls.map((url) => ({ url })),
          attachments: [],
          links: [],
        },
      }));

      showToast('Post published!', 'success');
      close();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Something went wrong.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post';
    }
  });
}
