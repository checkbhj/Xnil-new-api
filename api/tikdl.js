exports.config = {
    name: "tikdl",
    author: "xnil6x",
    description: "tiktok video download",
    method: "get",
    category: "downloader",
    link: ["/tikdl?url="]
};

exports.onStart = async function ({ req, res }) {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter ?url=" });
    }

    try {
        const igdl = await global.utils.ttsave(url);
        res.json({ data: igdl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
