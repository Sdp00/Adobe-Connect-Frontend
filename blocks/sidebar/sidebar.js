/**
* Sidebar Block
* Shows on every page - not a separate route
*/
import { loadCSS } from '../../scripts/aem.js';
// Load sidebar CSS
loadCSS('/blocks/sidebar/sidebar.css');
const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'training', label: 'Training', href: '/training' },
  { id: 'newsletters', label: 'Newsletters', href: '/newsletters' },
  { id: 'techtalks', label: 'Tech Talks', href: '/tech-talks' },
  { id: 'saved', label: 'Saved', href: '/saved' },
];
const SOCIAL_ITEMS = [
  { id: 'instagram', href: 'https://www.instagram.com/adobe/' },
  { id: 'facebook', href: 'https://www.facebook.com/adobe/' },
  { id: 'x', href: 'https://x.com/adobe' },
  { id: 'linkedin', href: 'https://www.linkedin.com/company/adobe/' },
];
function createElement(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([k, v]) => v != null && el.setAttribute(k, v));
  return el;
}
async function loadIcon(id) {
  try {
    const response = await fetch(`/icons/${id}.svg`);
    if (!response.ok) throw new Error(`Icon not found: ${id}`);
    return await response.text();
  } catch (e) {
    console.warn(`Failed to load icon: ${id}`, e);
    return '';
  }
}
export default async function decorate(block) {
  block.textContent = '';
  const currentPath = window.location.pathname;
  let activeId = 'home';
  NAV_ITEMS.forEach((item) => {
    if (currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))) {
      activeId = item.id;
    }
  });
  // Pre-fetch all icons in parallel
  const allIconIds = [...NAV_ITEMS.map((i) => i.id), ...SOCIAL_ITEMS.map((i) => i.id)];
  const iconMap = Object.fromEntries(
    await Promise.all(allIconIds.map(async (id) => [id, await loadIcon(id)])),
  );
  const sidebar = createElement('aside', 'sb-sidebar', { 'aria-label': 'Main navigation' });
  const nav = createElement('nav');
  const navList = createElement('ul', 'sb-nav-list');
  NAV_ITEMS.forEach((item) => {
    const li = createElement('li', 'sb-nav-item');
    const link = createElement('a', `sb-nav-link${item.id === activeId ? ' sb-nav-link-active' : ''}`, {
      href: item.href,
      'aria-current': item.id === activeId ? 'page' : 'false',
    });
    const iconSpan = createElement('span', 'sb-nav-icon');
    iconSpan.innerHTML = iconMap[item.id];
    const labelSpan = createElement('span', 'sb-nav-label');
    labelSpan.textContent = item.label;
    link.append(iconSpan, labelSpan);
    li.appendChild(link);
    navList.appendChild(li);
  });
  nav.appendChild(navList);
  sidebar.appendChild(nav);
  const divider = createElement('div', 'sb-divider', { 'aria-hidden': 'true' });
  sidebar.appendChild(divider);
  const socialList = createElement('ul', 'sb-social-list');
  SOCIAL_ITEMS.forEach((item) => {
    const li = createElement('li', 'sb-social-item');
    const link = createElement('a', 'sb-social-link', {
      href: item.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': `Adobe ${item.id}`,
    });
    const iconSpan = createElement('span', 'sb-social-icon');
    iconSpan.innerHTML = iconMap[item.id];
    link.appendChild(iconSpan);
    li.appendChild(link);
    socialList.appendChild(li);
  });
  sidebar.appendChild(socialList);
  sidebar.addEventListener('mouseenter', () => sidebar.classList.add('sb-sidebar-expanded'));
  sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('sb-sidebar-expanded'));
  block.appendChild(sidebar);
}
