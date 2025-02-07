const axios = require('axios');

exports.config = {
    name: 'fact',
    author: 'xnil6x',
    description: 'Fetches a random useless fact.',
    category: 'others',
    link: ['/fact'],
    method: 'get'
};

exports.initialize = async function ({ req, res }) {
    try {
        const apiUrl = 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';

        const { data } = await axios.get(apiUrl);

        if (!data || !data.text) {
            return res.status(500).json({
                status: false,
                message: 'Failed to fetch a useless fact. No response from the API.'
            });
        }

        res.status(200).json({
            status: true,
            code: 200,
            fact: data.text,
            source: data.source,
            source_url: data.source_url,
            permalink: data.permalink
        });
    } catch (error) {
        console.error("Error fetching useless fact:", error);
        if (error.response) {
            return res.status(error.response.status).json({
                status: false,
                message: 'Failed to fetch a useless fact.',
                details: error.response.data
            });
        }
        res.status(500).json({ status: false, message: 'Internal server error.' });
    }
};