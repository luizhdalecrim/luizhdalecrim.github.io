document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  
  menuToggle.addEventListener('click', function() {

    // Alterna a classe "active" para mostrar ou esconder o menu
    navbar.classList.toggle('active');
  });
});

const apiUrl = 'https://api.github.com/users/luizhdalecrim/repos';

fetch(apiUrl)
  .then(response => response.json())
  .then(repos => {
    const container = document.getElementById('repos-container');

    // Filtrar apenas repositórios públicos e que não sejam forks
    const filteredRepos = repos.filter(repo => !repo.fork);
    filteredRepos.forEach(repo => {
      
      // Cria um elemento para cada repositório
      const repoElement = document.createElement('div');
      repoElement.classList.add('project-card');
      repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description ? repo.description : 'Sem descrição.'}</p>
        <a href="${repo.html_url}" target="_blank" class="btn">Ver no GitHub</a>
      `;
      container.appendChild(repoElement);
    });
  })
  .catch(error => console.error('Erro ao buscar os repositórios:', error));
