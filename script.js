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
          `<span class="t-val">"${stack}"</span>`
      )
      .join(', ');

  tKeyStacks.innerHTML = `
    &nbsp;&nbsp;
    <span class="t-key">
      "stacks"
    </span>: [
    <div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      ${stackVals}
    </div>
    <div>
      &nbsp;&nbsp;
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

function renderCard(
  repo,
  container
) {

  const langColor =
    LANG_COLORS[
      repo.language
    ] || '#888';

  const owner =
    repo.owner;

  const isOrgShape =
    owner.type
    === 'Organization';

  const el =
    document.createElement('a');

  el.classList.add(
    'project-card',
    'fade-in',
    'visible'
  );

  el.href =
    repo.url;

  el.target =
    '_blank';

  el.rel =
    'noopener noreferrer';

  el.innerHTML = `
    <div class="project-top">

      <img
        src="${owner.avatar}&s=64"
        alt="${owner.login}"
        style="
          width:36px;
          height:36px;
          border-radius:
            ${isOrgShape ? '6px' : '50%'};
          border:1px solid var(--border-hover);
          object-fit:cover;
        "
      >

      <span
        class="project-arrow"
      >
        ↗
      </span>

    </div>

    <div
      class="project-name"
    >
      ${repo.name}

      ${
        repo.isFork
          ? `
            <span
              style="
                font-size:10px;
                color:var(--text-dim);
              "
            >
              fork
            </span>
          `
          : ''
      }

    </div>

    <p
      class="project-desc"
    >
      ${
        repo.description
        || 'Sem descrição.'
      }
    </p>

    <div
      class="project-meta"
    >

      ${
        repo.language
          ? `
            <span
              class="project-lang"
            >
              <span
                class="lang-dot"
                style="
                  background:${langColor}
                "
              ></span>

              ${repo.language}
            </span>
          `
          : ''
      }

      ${
        repo.stars > 0
          ? `
            <span
              class="project-stars"
            >
              ★ ${repo.stars}
            </span>
          `
          : ''
      }

    </div>
  `;

  container.appendChild(el);
}