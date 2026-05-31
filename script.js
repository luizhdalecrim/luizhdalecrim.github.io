const USERNAME = 'luizhdalecrim';

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  'C++': '#f34b7d',
  Python: '#3572A5',
};

// ── Fade In ────────────────────────────────────────────────────────────────

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      setTimeout(
        () => entry.target.classList.add('visible'),
        i * 80
      );

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1
  }
);

document
  .querySelectorAll('.fade-in')
  .forEach(el => observer.observe(el));

// ── Active Nav ──────────────────────────────────────────────────────────────

const sections =
  document.querySelectorAll('section[id]');

const navLinks =
  document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {

  let current = '';

  sections.forEach(section => {

    if (
      window.scrollY >=
      section.offsetTop - 120
    ) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {

    link.style.color =
      link.getAttribute('href')
        === `#${current}`
        ? 'var(--text)'
        : 'var(--text-muted)';
  });
});

// ── GitHub Data ─────────────────────────────────────────────────────────────

fetch('./data/github-data.json')
  .then(response => {

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    return response.json();
  })
  .then(data => {

    renderStats(data);

    renderStacks(data);

    renderRepos(data.repos);

    loadLanguageStats(
      data.languageStats
    );
  })
  .catch(error => {

    console.error(error);

    const container =
      document.getElementById(
        'repos-container'
      );

    if (!container) return;

    container.innerHTML = `
      <a
        class="project-card fade-in visible"
        href="https://github.com/${USERNAME}?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          style="
            color:var(--text-dim);
            text-align:center;
          "
        >
          Erro ao carregar dados.<br>
          Ver GitHub ↗
        </div>
      </a>
    `;
  });

// ── Stats ───────────────────────────────────────────────────────────────────

function renderStats(data) {

  const repos =
    document.getElementById(
      'num-repos'
    );

  if (repos) {

    repos.innerHTML =
      `${data.stats.totalRepos}<span>+</span>`;
  }

  const stacks =
    document.getElementById(
      'stat-stacks'
    );

  if (stacks) {

    stacks.innerHTML =
      `${data.stats.totalStacks}<span>+</span>`;
  }
}

// ── Stacks ──────────────────────────────────────────────────────────────────

function renderStacks(data) {

  const tKeyStacks =
    document.getElementById(
      't-key-stacks'
    );

  if (
    !tKeyStacks ||
    !data.stacks
  ) {
    return;
  }

  const stackVals =
    data.stacks
      .map(
        stack =>
          `<div>&nbsp;&nbsp;&nbsp;<span class="t-val">"${stack}"</span></div>`
      )
      .join(', ');

  tKeyStacks.innerHTML = `
    &nbsp;
    <span class="t-key">
      "stacks"
    </span>: [
      ${stackVals}
    <div>
      &nbsp;
    ],</div>
  `;
}

// ── Language Stats ──────────────────────────────────────────────────────────

function loadLanguageStats(
  languageStats
) {

  const list =
    document.getElementById(
      'skill-list'
    );

  if (
    !list ||
    !languageStats
  ) {
    return;
  }

  list.innerHTML =
    languageStats
      .map(({ lang, pct }) => {

        const color =
          LANG_COLORS[lang]
          || '#888';

        return `
          <div class="skill-item">

            <span
              class="skill-name"
              style="
                display:flex;
                align-items:center;
                gap:0.5rem;
              "
            >
              <span
                style="
                  width:8px;
                  height:8px;
                  border-radius:50%;
                  background:${color};
                "
              ></span>

              ${lang}
            </span>

            <div
              class="skill-bar-track"
            >
              <div
                class="skill-bar-fill"
                style="
                  width:${pct}%;
                  background:${color};
                  opacity:0.85;
                "
              ></div>
            </div>

            <span
              class="skill-pct"
            >
              ${pct}%
            </span>

          </div>
        `;
      })
      .join('');
}

// ── Repositories ────────────────────────────────────────────────────────────

function renderRepos(repos) {

  const container =
    document.getElementById(
      'repos-container'
    );

  if (!container) return;

  if (!repos?.length) {

    container.innerHTML = `
      <p
        style="
          color:var(--text-dim);
        "
      >
        Nenhum repositório encontrado.
      </p>
    `;

    return;
  }

  repos
    .slice(0, 4)
    .forEach(repo =>
      renderCard(
        repo,
        container
      )
    );

  const moreCard =
    document.createElement('a');

  moreCard.classList.add(
    'project-card',
    'fade-in',
    'visible'
  );

  moreCard.href =
    `https://github.com/${USERNAME}?tab=repositories`;

  moreCard.target =
    '_blank';

  moreCard.rel =
    'noopener noreferrer';

  moreCard.style.cssText = `
    border:1px dashed rgba(255,255,255,0.06);
    background:transparent;
    justify-content:center;
    align-items:center;
    text-align:center;
    min-height:200px;
  `;

  moreCard.innerHTML = `
    <div
      style="
        color:var(--text-dim);
        font-size:12px;
        letter-spacing:0.08em;
      "
    >
      <div
        style="
          font-size:1.5rem;
          margin-bottom:0.75rem;
        "
      >
        +${Math.max(0, repos.length - 4)}
      </div>

      ver todos os repositórios<br>
      no GitHub ↗
    </div>
  `;

  container.appendChild(
    moreCard
  );
}

// ── Repo Card ───────────────────────────────────────────────────────────────

function renderCard(repo, container) {
  const langColor = LANG_COLORS[repo.language] || '#888';
  const owner = repo._owner;
  const isOrg = owner.type === 'Organization';

  const el = document.createElement('a');
  el.classList.add('project-card', 'fade-in', 'visible');
  el.href = repo.html_url;
  el.target = '_blank';
  el.rel = 'noopener noreferrer';

  // SVG exibido quando o repo pertence a uma organização
  const orgBadge = isOrg ? `
    <span title="Organização" style="
      display:inline-flex;
      align-items:center;
      color:var(--text-dim);
      vertical-align:middle;
      margin-left:4px;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="icon-organization"><path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"></path></svg>
    </span>
  ` : '';

  el.innerHTML = `
    <div class="project-top">
      <div style="position:relative;width:36px;height:36px;flex-shrink:0;">
        <img
          src="${owner.avatar_url}&s=64"
          alt="${owner.login}"
          style="
            width:36px;
            height:36px;
            border-radius:${isOrg ? '6px' : '50%'};
            border:1px solid var(--border-hover);
            object-fit:cover;
            display:block;
          "
          onerror="this.style.display='none'"
        >
      </div>
      <span class="project-arrow">↗</span>
    </div>
    <div class="project-name">
      ${repo.name}${orgBadge}
      ${repo.fork ? `
        <span style="font-size:10px;color:var(--text-dim);font-weight:400;vertical-align:middle;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
          </svg>
          fork de ${owner.login}
        </span>` : ''}
    </div>
    <p class="project-desc">${repo.description || 'Sem descrição.'}</p>
    <div class="project-meta">
      ${repo.language ? `
        <span class="project-lang">
          <span class="lang-dot" style="background:${langColor}"></span>
          ${repo.language}
        </span>` : ''}
      ${repo.stargazers_count > 0 ? `
        <span class="project-stars">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
          </svg>
          ${repo.stargazers_count}
        </span>` : ''}
    </div>
  `;

  container.appendChild(el);
}