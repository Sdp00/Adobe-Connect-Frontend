import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import createModal from '../../helper/helper.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const content = fragment.querySelector(':scope > div > div');
  if (!content) return;

  const items = [...content.querySelectorAll('p')];
  const title = items[0]?.textContent?.trim() || '';
  const searchText = items[1]?.textContent?.trim() || '';

  block.textContent = '';

  const profileSaved = localStorage.getItem('profileComplete') === 'true';
  const addInfoLabel = profileSaved ? 'Edit Info' : 'Add Info';
  const isAdminPage = window.location.pathname.startsWith('/admin');

  const nav = document.createElement('nav');
  nav.className = 'nav-inner';

  nav.innerHTML = `
    <div class="nav-left">
      <img class="nav-logo-img" src="/blocks/header/Adobe-logo.jpeg" alt="Adobe" />
      <span class="nav-title">${title}</span>
    </div>

    <div class="nav-center">
      <div class="nav-search">
        <svg class="nav-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
        </svg>
        <input type="search" placeholder="${searchText}" />
      </div>
    </div>

    <div class="nav-right">

      ${isAdminPage ? `
      <button class="icon-btn admin-add-btn" title="Create Item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>` : ''}

      <button class="icon-btn theme-toggle-btn"></button>

      <div class="notify">
        <button class="icon-btn notify-trigger">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 10-12 0v5l-2 2h16l-2-2z"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span class="notify-dot"></span>
        </button>
      </div>

      <div class="profile">
        <div class="profile-trigger">
          <div class="avatar">J</div>
          <svg class="chevron" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <div class="profile-menu">
          <div class="profile-info">
            <div class="profile-name">Jaishree D G</div>
            <div class="profile-role">Apprentice Tech</div>
          </div>

          <ul>
            <li class="menu-add-info">
              <svg class="menu-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M5.5 21a6.5 6.5 0 0113 0"></path>
              </svg>
              <span class="add-info-label">${addInfoLabel}</span>
            </li>

            <li class="menu-posts">
              <svg class="menu-icon" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <line x1="8" y1="8" x2="16" y2="8"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              My Posts
            </li>

            <li class="menu-hierarchy">
              <svg class="menu-icon" viewBox="0 0 24 24">
                <rect x="10" y="3" width="4" height="4" rx="1"></rect>
                <rect x="3" y="17" width="4" height="4" rx="1"></rect>
                <rect x="17" y="17" width="4" height="4" rx="1"></rect>
                <line x1="12" y1="7" x2="5" y2="17"></line>
                <line x1="12" y1="7" x2="19" y2="17"></line>
              </svg>
              Hierarchy
            </li>

            <li class="danger menu-logout">
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </li>
          </ul>
        </div>
      </div>

    </div>
  `;

  const profile = nav.querySelector('.profile');

  nav.querySelector('.profile-trigger').onclick = (e) => {
    e.stopPropagation();
    profile.classList.toggle('open');
  };

  document.addEventListener('click', () => {
    profile.classList.remove('open');
  });

  nav.querySelector('.menu-hierarchy')?.addEventListener('click', () => {
    window.location.href = '/hierarchy';
  });

  nav.querySelector('.menu-posts')?.addEventListener('click', () => {
    window.location.href = '/myposts';
  });

  nav.querySelector('.menu-add-info')?.addEventListener('click', () => {
    openProfileModal(nav);
  });

  nav.querySelector('.admin-add-btn')?.addEventListener('click', () => {
    openCreateModal();
  });

  block.append(nav);
  /* DARK / LIGHT MODE TOGGLE     */
  const moonIcon = `
    <svg class="nav-icon" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 0111.21 3a7 7 0 109.79 9.79z"/>
    </svg>
  `;

  const sunIcon = `
    <svg class="nav-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  `;

  const themeBtn = nav.querySelector('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeBtn.innerHTML = savedTheme === 'dark' ? sunIcon : moonIcon;

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeBtn.innerHTML = next === 'dark' ? sunIcon : moonIcon;
  });
}


/* UPLOAD MEDIA TO SUPABASE      */
/* Uses the existing "uploads"   */
/* public bucket                 */

async function uploadMedia(file) {
  const client = window.SupabaseUtils.client;
  const filePath = `events/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

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
/* CREATE ITEM MODAL (ADMIN)     */
function openCreateModal() {
  const form = document.createElement('form');
  form.className = 'create-event-form';

  form.innerHTML = `
    <h2>Create New Item</h2>
    <p>Fill in the details below to create a new item.</p>
  `;

  const categorySelect = document.createElement('select');
  categorySelect.name = 'category';
  categorySelect.required = true;
  categorySelect.innerHTML = `
    <option value="">Select Category *</option>
    <option value="event">Event</option>
    <option value="training">Training</option>
    <option value="newsletter">Newsletter</option>
    <option value="others">Others</option>
  `;

  const dynamicFields = document.createElement('div');
  dynamicFields.className = 'dynamic-fields';

  form.append(categorySelect, dynamicFields);

  const footer = document.createElement('div');
  footer.className = 'modal-actions';
  footer.innerHTML = `
    <button type="button" class="btn-secondary">Cancel</button>
    <button type="submit" class="btn-primary">Submit</button>
  `;

  const modal = createModal({
    id: 'create-item',
    content: form,
    footer,
    onClose: () => {},
  });

  footer.querySelector('.btn-secondary').addEventListener('click', modal.close);
  footer.querySelector('.btn-primary').addEventListener('click', () => form.requestSubmit());

  /* Dynamic fields based on category */
  categorySelect.addEventListener('change', () => {
    const value = categorySelect.value;
    dynamicFields.innerHTML = '';

    if (value === 'event') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>
          Media (Image/Video) <span class="req">*</span>
          <input type="file" accept="image/*,video/*" name="media" required />
          <span class="file-hint">Will be uploaded and stored as a URL</span>
        </label>
        <label>Location <span class="req">*</span><input required name="location" placeholder="Enter location" /></label>
        <div class="form-row">
          <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
          <label>Time <span class="req">*</span><input type="time" required name="time" /></label>
        </div>
        <label>Deadline <span class="req">*</span><input type="date" required name="deadline" /></label>
        <label>Description<textarea name="description" placeholder="Optional description..."></textarea></label>
      `;
    } else if (value === 'training') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Media Upload (Image/Video)<input type="file" accept="image/*,video/*" name="media" /></label>
        <label>Location<input name="location" placeholder="Enter location" /></label>
        <div class="form-row">
          <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
          <label>Time <span class="req">*</span><input type="time" required name="time" /></label>
        </div>
        <label>Description<textarea name="description" placeholder="Optional description..."></textarea></label>
      `;
    } else if (value === 'newsletter') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Image<input type="file" accept="image/*" name="image" /></label>
        <label>Description <span class="req">*</span><textarea name="description" placeholder="Enter description..."></textarea></label>
        <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
        <label>Redirection URL<input type="url" name="url" placeholder="https://example.com" /></label>
      `;
    } else if (value === 'others') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Description <span class="req">*</span><textarea name="description" placeholder="Enter description..."></textarea></label>
        <label>Image<input type="file" accept="image/*" name="image" /></label>
      `;
    }
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitBtn = footer.querySelector('.btn-primary');

    // ── ONLY EVENT posts to the database ──
    if (data.category === 'event') {
      if (!window.SupabaseUtils) {
        showToast('Supabase not ready. Please try again.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading media...';

      try {
        const mediaFile = form.querySelector('input[name="media"]').files[0];
        let mediaUrl = null;

        if (mediaFile) {
          mediaUrl = await uploadMedia(mediaFile);
        }

        submitBtn.textContent = 'Saving event...';

        const { error: dbError } = await window.SupabaseUtils.createRecord('events', {
          title: data.title,
          Media: mediaUrl,
          location: data.location,
          date: data.date,
          time: data.time,
          deadline: data.deadline,
        });

        if (dbError) {
          showToast(`Failed to save event: ${dbError.message}`, 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
          return;
        }

        window.dispatchEvent(new Event('events-updated'));
        modal.close();
        showToast('Event created successfully!');
      } catch (err) {
        console.error(err);
        showToast(err.message || 'Something went wrong. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }

    // ── training / newsletter / others → toast only, no DB ──
    } else if (data.category) {
      modal.close();
      const label = data.category.charAt(0).toUpperCase() + data.category.slice(1);
      showToast(`${label} submitted successfully!`);
    }
  });

  modal.open();
}
/* TOAST NOTIFICATION            */

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification${type === 'error' ? ' toast-error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
/* PROFILE COMPLETE MODAL LOGIC */
function openProfileModal(nav) {
  if (document.querySelector('.profile-modal-overlay')) return;

  const savedDate = localStorage.getItem('profileBirthday') || '';
  const savedInterests = JSON.parse(localStorage.getItem('profileInterests') || '[]');
  const isEdit = localStorage.getItem('profileComplete') === 'true';

  const overlay = document.createElement('div');
  overlay.className = 'profile-modal-overlay';

  overlay.innerHTML = `
    <div class="profile-modal">
      <div class="profile-modal-header">
        <h3>${isEdit ? 'Edit Your Profile' : 'Complete Your Profile'}</h3>
        <button class="modal-close">✕</button>
      </div>

      <div class="profile-modal-body">
        <label>Birthday</label>
        <div class="date-field">
          <input type="date" value="${savedDate}" />
        </div>

        <div class="interests-header">
          <span>Interests</span>
          <span class="interest-count">${savedInterests.length} selected (min 3)</span>
        </div>

        <div class="interest-list">
          ${[
            'UI/UX Design', 'Development', 'Marketing', 'Music',
            'Leadership', 'Mentoring', 'Sports', 'Photography',
            'Travelling', 'Psychology', 'Fitness', 'Gaming', 'Art', 'Dancing', 'Fashion',
          ].map((i) => `<button class="interest-chip${savedInterests.includes(i) ? ' selected' : ''}">${i}</button>`).join('')}
        </div>

        <button class="update-btn" ${savedInterests.length >= 3 ? '' : 'disabled'}>Update Profile</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const chips = overlay.querySelectorAll('.interest-chip');
  const countText = overlay.querySelector('.interest-count');
  const updateBtn = overlay.querySelector('.update-btn');

  function updateState() {
    const selected = overlay.querySelectorAll('.interest-chip.selected').length;
    countText.textContent = `${selected} selected (min 3)`;
    updateBtn.disabled = selected < 3;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      updateState();
    });
  });

  updateBtn.addEventListener('click', () => {
    const dateInput = overlay.querySelector('input[type="date"]');

    if (!dateInput.value) {
      dateInput.setAttribute('required', 'true');
      dateInput.reportValidity();
      return;
    }

    const selectedInterests = [...overlay.querySelectorAll('.interest-chip.selected')].map((c) => c.textContent.trim());

    localStorage.setItem('profileBirthday', dateInput.value);
    localStorage.setItem('profileInterests', JSON.stringify(selectedInterests));
    localStorage.setItem('profileComplete', 'true');

    const label = nav?.querySelector('.add-info-label');
    if (label) label.textContent = 'Edit Info';

    overlay.remove();
  });

  overlay.querySelector('.modal-close').onclick = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}