const axios = require('axios');

exports.config = {
  name: "gitinfo",
  author: "xnil6x",
  description: "GitHub user info",
  method: "get",
  category: "tools",
  link: ["/gitinfo?username="]
};

exports.onStart = async function ({ req, res }) {
  const username = req.query.username;
  if (!username) {
    return res.json({ error: "Please enter a username" });
  }
  try {
    // GitHub API URL
    const url = `https://api.github.com/users/${username}`;

    // Fetch data from GitHub
    const response = await axios.get(url);

    // Return GitHub user info as JSON
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    return res.status(500).json({ error: "An error occurred while fetching GitHub data" });
  }
};