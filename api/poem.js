const axios = require('axios');

exports.config = {
    name: 'poem',
    author: 'xnil6x',
    description: 'Fetches a random poem from PoetryDB.',
    category: 'others',
    link: ['/poem'],
    method: 'get'
};

exports.onStart = async function ({ req, res }) {
    try {
        const apiUrl = 'https://poetrydb.org/random';

        const { data } = await axios.get(apiUrl);

        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch a random poem. No response from the API.'
            });
        }

        const poem = data[0];
        const { title, lines } = poem;

        res.status(200).json({
            status: true,
            code: 200,
            title,
            lines
        });
    } catch (error) {
        console.error("Error fetching random poem:", error);
        if (error.response) {
            return res.status(error.response.status).json({
                status: false,
                message: 'Failed to fetch a random poem.',
                details: error.response.data
            });
        }
        res.status(500).json({ status: false, message: 'Internal server error.' });
    }
};