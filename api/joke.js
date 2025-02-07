const axios = require('axios');

exports.config = {
    name: 'joke',
    author: 'xnil6x',
    description: 'Fetches a random joke from JokeAPI.',
    category: 'others',
    link: ['/joke'],
    method: 'get'
};

exports.onStart = async function ({ req, res }) {
    try {
        const apiUrl = 'https://v2.jokeapi.dev/joke/Any';

        const { data } = await axios.get(apiUrl);

        if (!data) {
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch a joke. No response from JokeAPI.'
            });
        }

        const joke = data.type === 'twopart' 
            ? `${data.setup} - ${data.delivery}` 
            : data.joke;

        res.status(200).json({
            status: true,
            code: 200,
            joke,
            category: data.category,
            safe: data.safe,
            flags: data.flags
        });
    } catch (error) {
        console.error("Error fetching joke:", error);
        if (error.response) {
            return res.status(error.response.status).json({
                status: false,
                message: 'Failed to fetch a joke.',
                details: error.response.data
            });
        }
        res.status(500).json({ status: false, message: 'Internal server error.' });
    }
};