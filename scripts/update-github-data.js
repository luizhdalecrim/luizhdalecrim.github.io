const fs = require("fs");

const USERNAME = "luizhdalecrim";

const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    "C#": "#178600",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Dart: "#00B4AB",
    "C++": "#f34b7d",
    Python: "#3572A5"
};

async function fetchJson(url, headers) {
    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(
            `GitHub API Error ${response.status}: ${url}`
        );
    }

    return response.json();
}

async function resolveForkOwner(repo, headers) {

    if (!repo.fork) {
        return repo.owner;
    }

    try {

        const fullRepo = await fetchJson(
            `https://api.github.com/repos/${repo.full_name}`,
            headers
        );

        return fullRepo.parent.owner;

    } catch {

        return repo.owner;
    }
}

async function main() {

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    };

    const userUrl =
        `https://api.github.com/users/${USERNAME}`;

    const reposUrl =
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`;

    const memberReposUrl =
        `https://api.github.com/users/${USERNAME}/repos?type=member&sort=updated&per_page=100`;

    try {

        const [
            user,
            ownRepos,
            memberRepos
        ] = await Promise.all([
            fetchJson(userUrl, headers),
            fetchJson(reposUrl, headers),
            fetchJson(memberReposUrl, headers)
        ]);

        const seen = new Set();

        const allRepos = [
            ...ownRepos,
            ...memberRepos
        ]
            .filter(repo => {

                if (
                    repo.name === USERNAME ||
                    seen.has(repo.id)
                ) {
                    return false;
                }

                seen.add(repo.id);

                return true;
            });

        const resolvedOwners =
            await Promise.all(
                allRepos.map(repo =>
                    resolveForkOwner(
                        repo,
                        headers
                    )
                )
            );

        const languageMaps =
            await Promise.all(
                allRepos.map(repo =>
                    fetchJson(
                        repo.languages_url,
                        headers
                    ).catch(() => ({}))
                )
            );

        const languageTotals = {};

        languageMaps.forEach(map => {

            Object.entries(map)
                .forEach(([lang, bytes]) => {

                    languageTotals[lang] =
                        (languageTotals[lang] || 0)
                        + bytes;
                });
        });

        const totalBytes =
            Object.values(languageTotals)
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );

        const languageStats =
            Object.entries(languageTotals)
                .map(([lang, bytes]) => ({
                    lang,
                    pct: Math.round(
                        (bytes / totalBytes) * 100
                    ),
                    color:
                        LANG_COLORS[lang]
                        || "#888"
                }))
                .filter(item => item.pct >= 1)
                .sort(
                    (a, b) =>
                        b.pct - a.pct
                )
                .slice(0, 8);

        const repos =
            allRepos
                .map((repo, index) => {

                    const owner =
                        resolvedOwners[index];

                    return {

                        id: repo.id,

                        name:
                            repo.name,

                        description:
                            repo.description,

                        url:
                            repo.html_url,

                        homepage:
                            repo.homepage,

                        language:
                            repo.language,

                        stars:
                            repo.stargazers_count,

                        forks:
                            repo.forks_count,

                        topics:
                            repo.topics,

                        visibility:
                            repo.visibility,

                        updatedAt:
                            repo.updated_at,

                        pushedAt:
                            repo.pushed_at,

                        isFork:
                            repo.fork,

                        owner: {
                            login:
                                repo.owner.login,

                            avatar:
                                owner.avatar_url,

                            type:
                                owner.type
                        }
                    };
                })
                .sort(
                    (a, b) =>
                        new Date(
                            b.updatedAt
                        ) -
                        new Date(
                            a.updatedAt
                        )
                );

        const stacks = [
            ...new Set(
                repos
                    .filter(
                        repo =>
                            repo.language
                    )
                    .map(
                        repo =>
                            repo.language
                    )
            )
        ];

        const totalStars =
            repos.reduce(
                (sum, repo) =>
                    sum + repo.stars,
                0
            );

        const data = {

            updatedAt:
                new Date()
                    .toISOString(),

            user: {

                login:
                    user.login,

                name:
                    user.name,

                avatar:
                    user.avatar_url,

                bio:
                    user.bio,

                followers:
                    user.followers,

                following:
                    user.following,

                publicRepos:
                    user.public_repos,

                profileUrl:
                    user.html_url
            },

            stats: {

                totalRepos:
                    repos.length,

                totalStars,

                totalStacks:
                    stacks.length
            },

            stacks,

            languageStats,

            repos
        };

        fs.writeFileSync(
            "./data/github-data.json",
            JSON.stringify(
                data,
                null,
                2
            )
        );

        console.log(
            "GitHub data updated."
        );

    } catch (error) {

        console.error(error);

        process.exit(1);
    }
}

main();