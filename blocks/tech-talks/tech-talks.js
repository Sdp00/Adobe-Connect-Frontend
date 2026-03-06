export default function decorate(block) {
  block.textContent = '';
  block.className = 'tech-talks-block';

  const container = document.createElement('div');
  container.className = 'tech-talks-container';

  const title = document.createElement('h1');
  title.className = 'tech-talks-title';
  title.textContent = 'Adobe Tech Talks';

  const subtitle = document.createElement('p');
  subtitle.className = 'tech-talks-subtitle';
  subtitle.textContent = 'Explore our technical sessions and deep dives';

  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'tech-talks-buttons';

  const upcomingBtn = document.createElement('a');
  upcomingBtn.href = 'https://www.adobe.com/events/tech-talks/upcoming';
  upcomingBtn.target = '_blank';
  upcomingBtn.rel = 'noopener noreferrer';
  upcomingBtn.className = 'btn'; /* ← RED BUTTON */
  upcomingBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
    <span>Upcoming Tech Talks</span>
  `;

  const pastBtn = document.createElement('a');
  pastBtn.href = 'https://www.adobe.com/events/tech-talks/past';
  pastBtn.target = '_blank';
  pastBtn.rel = 'noopener noreferrer';
  pastBtn.className = 'btn'; /* ← RED BUTTON */
  pastBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
    <span>Past Tech Talks</span>
  `;

  buttonGroup.append(upcomingBtn, pastBtn);
  container.append(title, subtitle, buttonGroup);
  block.appendChild(container);
}