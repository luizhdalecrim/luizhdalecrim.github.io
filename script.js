// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--text)'
      : 'var(--text-muted)';
  });
});

const apiUrlUser = 'https://api.github.com/users/luizhdalecrim';
var num_repos = parseInt(0);


fetch(apiUrlUser)
  .then(res => res.json())
  .then(user => {
    const containerNumRepos = document.getElementById('num-repos');
    num_repos = parseInt(user.public_repos);
    containerNumRepos.innerHTML = `
    ${num_repos} <span>+</span>
    `

  });


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


const apiUrlRepos = 'https://api.github.com/users/luizhdalecrim/repos?sort=updated&per_page=99';

fetch(apiUrlRepos)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(repos => {
    const container = document.getElementById('repos-container');
    const valid = repos.filter(repo => !repo.fork && repo.name !== 'luizhdalecrim');

    // stacks únicas
    const stacks = [...new Set(valid.filter(r => r.language).map(r => r.language))];

    // stacks únicas
    const tKeyStacks = document.getElementById('t-key-stacks');

    tKeyStacks.innerHTML = `
    &nbsp;&nbsp;<span class="t-key">"stacks"</span>: [
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-val">"JavaScript"</span>, <span class="t-val">"Node.js"</span>,
        </div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-val">"HTML"</span>, <span class="t-val">"CSS"</span>, <span
            class="t-val">"C#"</span></div>
        <div>&nbsp;&nbsp;],</div>
    `;

    document.getElementById('stat-stacks').innerHTML = `${stacks.length}<span>+</span>`;

    if (valid.length === 0) {
      container.innerHTML = '<p style="color:var(--text-dim)">Nenhum repositório encontrado.</p>';
      return;
    }

    // ✅ slice reatribuído
    const repos4 = valid.slice(0, 4);

    repos4.forEach(repo => {
      const langColor = LANG_COLORS[repo.language] || '#888';

      const repoElement = document.createElement('a');
      repoElement.classList.add('project-card', 'fade-in', 'visible');
      repoElement.href = repo.html_url;
      repoElement.target = '_blank';
      repoElement.rel = 'noopener noreferrer';

      repoElement.innerHTML = `
        <div class="project-top">
          <div class="project-icon">📁</div>
          <span class="project-arrow">↗</span>
        </div>
        <div class="project-name">${repo.name}</div>
        <p class="project-desc">${repo.description || 'Sem descrição.'}</p>
        <div class="project-meta">
          ${repo.language ? `
            <span class="project-lang">
              <span class="lang-dot" style="background:${langColor}"></span>
              ${repo.language}
            </span>` : ''}
          ${repo.stargazers_count > 0 ? `
            <span class="project-stars">★ ${repo.stargazers_count}</span>` : ''}
        </div>
      `;

      container.appendChild(repoElement); // ✅ adiciona cada card
    });

    // ✅ usa appendChild para não apagar os cards anteriores
    const moreCard = document.createElement('a');
    moreCard.classList.add('project-card', 'fade-in', 'visible');
    moreCard.href = 'https://github.com/luizhdalecrim?tab=repositories';
    moreCard.target = '_blank';
    moreCard.style.cssText = 'border:1px dashed rgba(255,255,255,0.06);background:transparent;justify-content:center;align-items:center;text-align:center;min-height:200px;';
    moreCard.innerHTML = `
      <div style="color:var(--text-dim);font-size:12px;letter-spacing:0.08em;">
        <div style="font-size:1.5rem;margin-bottom:0.75rem;">+${num_repos - 4}</div>
        ver todos os repositórios<br>no GitHub ↗
      </div>
    `;
    container.appendChild(moreCard); // ✅ adiciona por último, sem apagar nada
  })
  .catch(error => {
    const container = document.getElementById('repos-container');
    container.innerHTML = `
            <a class="project-card fade-in visible" href="https://github.com/luizhdalecrim?tab=repositories" target="_blank"
      style="border: 1px dashed rgba(255,255,255,0.06); background: transparent; justify-content: center; align-items: center; text-align: center; min-height: 200px;">
      <div style="color: var(--text-dim); font-size: 12px; letter-spacing: 0.08em;">
                Erro ao carregar repositórios.
<br>        <div href="https://github.com/luizhdalecrim?tab=repositories"
           style="color:var(--accent-2)">Ver no GitHub ↗</div>
      </div>
    </a>
    `;
    console.error('Erro ao buscar os repositórios:', error);
  });