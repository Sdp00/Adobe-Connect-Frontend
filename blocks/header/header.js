import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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
      <a href="/"><img class="nav-logo-img" src="/blocks/header/Adobe-logo.jpeg" alt="Adobe" /></a>
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

      <!-- Mobile Search Button -->
      <button class="icon-btn mobile-search-btn" aria-label="Search">
        <svg class="nav-icon" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
        </svg>
      </button>

      <!-- Admin + Button (only on /admin) -->
      ${isAdminPage ? `
      <button class="icon-btn admin-add-btn" title="Create Item" aria-label="Create Item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>` : ''}

      <!-- Theme toggle -->
      <button class="icon-btn theme-toggle-btn" aria-label="Toggle theme"></button>

      <!-- Notifications -->
      <div class="notify">
        <button class="icon-btn notify-trigger" aria-label="Notifications">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 10-12 0v5l-2 2h16l-2-2z"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span class="notify-dot"></span>
        </button>
      </div>
 
      <div class="profile">
        <div class="profile-trigger" aria-label="Profile menu">
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

  nav.querySelector('.profile-menu').style.zIndex = '99999';

  const profile = nav.querySelector('.profile');
  const profileMenu = nav.querySelector('.profile-menu');

  const mobileSearchBar = document.createElement('div');
  mobileSearchBar.className = 'mobile-search-bar';
  mobileSearchBar.innerHTML = `<input type="search" placeholder="${searchText}" />`;
  nav.appendChild(mobileSearchBar);

  function closeAll() {
    profile.classList.remove('open');
    mobileSearchBar.classList.remove('open');
  }

  nav.querySelector('.profile-trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = profile.classList.contains('open');
    closeAll();
    if (!isOpen) profile.classList.add('open');
  });

  profileMenu.addEventListener('click', (e) => e.stopPropagation());

  nav.querySelector('.mobile-search-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileSearchBar.classList.contains('open');
    closeAll();
    if (!isOpen) {
      mobileSearchBar.classList.add('open');
      mobileSearchBar.querySelector('input').focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll();
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

  if (isAdminPage) {
    nav.querySelector('.admin-add-btn')?.addEventListener('click', async () => {
      const adminModule = await import('../admin/admin.js');
      adminModule.openCreateModal();
    });
  }

  block.append(nav);
  /* DARK / LIGHT MODE TOGGLE     */
  const moonIcon = `
    <svg class="nav-icon" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 0111.21 3a7 7 0 109.79 9.79z"/>
    </svg>`;

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
    </svg>`;

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

/* PROFILE MODAL */
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

    const selectedInterests = [...overlay.querySelectorAll('.interest-chip.selected')]
      .map((c) => c.textContent.trim());
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