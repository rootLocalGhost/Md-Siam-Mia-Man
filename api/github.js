// /api/github.js

export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Vercel environment variable
  const GITHUB_USERNAME = 'rootLocalGhost';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token is not configured.' });
  }

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/starred?sort=updated&per_page=9`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${GITHUB_TOKEN}`,
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Cache the response for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects from GitHub.' });
  }
}