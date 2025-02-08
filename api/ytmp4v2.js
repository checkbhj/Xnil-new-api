exports.config = {
  name: 'ytmp4v2',
  author: 'xnil6x',
  description: 'Download ytdl videos ',
  method: 'get',
  category: 'downloader',
  link: ['/ytmp4v2?url='],
};

exports.onStart = async function ({ req, res }) {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter ?url=" });
    }

    try {
        const ytdl = await global.utils.ytdl2(url);
        res.json({ data: ytdl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};