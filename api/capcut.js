const { capcut } = require('betabotz-tools');

exports.config = {
    name: 'capcut',
    author: 'xnil6x',
    description: 'Download video from capcut',
    method: 'get',
    category: 'downloader',
    link: ['/capcut?url=']
};

exports.onStart = async function ({ req, res }) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'capcut?url=your_url_here' });
    }

    try {
        const results = await capcut(url);
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};