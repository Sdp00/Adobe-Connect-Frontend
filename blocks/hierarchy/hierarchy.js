export default async function decorate(block) {
  const SUPABASE_URL = window.SUPABASE_CONFIG?.url;
  const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anonKey;

  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  /* ── Fetch full org tree ── */
  async function fetchFullTree() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_employee_tree`, {
      method: 'POST',
      headers,
      body: '{}',
    });
    return res.ok ? res.json() : [];
  }

  /* ── Fetch upward manager chain for a person ── */
  async function fetchManagerChain(empId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_manager_chain`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ emp_id: empId }),
    });
    return res.ok ? res.json() : [];
  }

  /* ── Build parent→children map ── */
  function buildTree(rows) {
    const map = {};
    rows.forEach((r) => { map[r.id] = { ...r, children: [] }; });
    const roots = [];
    rows.forEach((r) => {
      if (r.manager_id && map[r.manager_id]) {
        map[r.manager_id].children.push(map[r.id]);
      } else {
        roots.push(map[r.id]);
      }
    });
    return { roots, map };
  }

  /* ── Initials from name ── */
  function initials(name) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  /* ── Render a card ── */
  function makeCard(person, isTop = false, isSelected = false, clickable = true) {
    const card = document.createElement('div');
    card.className = 'card';
    if (isTop) card.classList.add('ceo');
    if (isSelected) card.classList.add('selected');
    if (clickable && !isSelected) card.classList.add('clickable');

    card.innerHTML = `
      <div class="card-top ${isTop ? 'red' : 'light'}">
        <div class="avatar">${initials(person.name)}</div>
        <div class="card-info">
          <div class="name">${person.name}</div>
          <div class="role">${person.role || ''}</div>
        </div>
        ${clickable && !isSelected ? '<span class="card-chevron">›</span>' : ''}
      </div>
    `;

    return card;
  }

  /* ── Render FULL ORG tree recursively ── */
  function renderFullTree(nodes, depth = 0) {
    const frag = document.createDocumentFragment();

    const levelDiv = document.createElement('div');
    levelDiv.className = 'level';
    if (depth > 0) {
      const hLine = document.createElement('div');
      hLine.className = 'h-line';
      levelDiv.appendChild(hLine);
    }

    nodes.forEach((node) => {
      const card = makeCard(node, depth === 0, false, true);
      card.addEventListener('click', () => showManagerChain(node.id, node.name));
      levelDiv.appendChild(card);
    });

    frag.appendChild(levelDiv);

    const allChildren = nodes.flatMap((n) => n.children || []);
    if (allChildren.length > 0) {
      const vLine = document.createElement('div');
      vLine.className = 'v-line';
      frag.appendChild(vLine);
      frag.appendChild(renderFullTree(allChildren, depth + 1));
    }

    return frag;
  }

  /* ── Show manager chain (upward) for a clicked person ── */
  async function showManagerChain(empId, empName) {
    chartEl.innerHTML = '<div class="org-loading">Loading…</div>';

    const chain = await fetchManagerChain(empId);

    /* chain comes ordered by level ascending */

    chain.sort((a, b) => a.level - b.level);

    chartEl.innerHTML = '';

    /* Back button */
    const backBar = document.createElement('div');
    backBar.className = 'org-breadcrumb';
    backBar.innerHTML = `
      <button class="bc-item">← Full Org</button>
      <span class="bc-sep">›</span>
      <span class="bc-active">${empName}</span>
    `;
    backBar.querySelector('.bc-item').addEventListener('click', () => renderFullOrg());
    chartEl.appendChild(backBar);

    /* Title */
    const title = document.createElement('p');
    title.className = 'chain-title';
    title.textContent = `Reporting chain for ${empName}`;
    chartEl.appendChild(title);

    /* Render vertical chain */
    const tree = document.createElement('div');
    tree.className = 'org-tree';

    chain.forEach((person, idx) => {
      const isTop = idx === 0;
      const isSelected = person.id === empId;

      const card = makeCard(person, isTop, isSelected, !isSelected);
      if (!isSelected) {
        card.addEventListener('click', () => showManagerChain(person.id, person.name));
      }

      tree.appendChild(card);

      /* connector between cards */
      if (idx < chain.length - 1) {
        const vLine = document.createElement('div');
        vLine.className = 'v-line';
        tree.appendChild(vLine);
      }
    });

    chartEl.appendChild(tree);
  }

  /* ── Render full org ── */
  async function renderFullOrg() {
    chartEl.innerHTML = '<div class="org-loading">Loading…</div>';
    const rows = await fetchFullTree();
    const { roots } = buildTree(rows);
    chartEl.innerHTML = '';

    const hint = document.createElement('p');
    hint.className = 'org-hint';
    hint.textContent = 'Click any person to see their reporting chain';
    chartEl.appendChild(hint);

    const tree = document.createElement('div');
    tree.className = 'org-tree';
    tree.appendChild(renderFullTree(roots));
    chartEl.appendChild(tree);
  }

  /* ── Build shell ── */
  block.innerHTML = '';
  const section = document.createElement('section');
  section.className = 'org-page';
  section.innerHTML = `
    <div class="org-header">
      <h1>Organization Hierarchy</h1>
      <p>View the organizational structure and reporting lines</p>
    </div>
  `;

  const chartEl = document.createElement('div');
  chartEl.className = 'org-chart';
  section.appendChild(chartEl);
  block.appendChild(section);

  /* initial load */
  renderFullOrg();
}

