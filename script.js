const apiUrl = 'https://api.github.com/users/Lu1zH3nr1qu3DA/repos';

fetch(apiUrl)
  .then(response => response.json())
  .then(repos => {
    const container = document.getElementById('repos-container');
    // Filtrar apenas repositórios públicos e que não sejam forks
    const filteredRepos = repos.filter(repo => !repo.fork);
    filteredRepos.forEach(repo => {
      // Cria um elemento para cada repositório
      const repoElement = document.createElement('div');
      repoElement.classList.add('projeto');
      repoElement.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description ? repo.description : 'Sem descrição.'}</p>
        <a href="${repo.html_url}" target="_blank">Ver no GitHub</a>
      `;
      container.appendChild(repoElement);
    });
  })
  .catch(error => console.error('Erro ao buscar os repositórios:', error));
