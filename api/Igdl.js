exports.config = {
    name: "igdl",
    author: "xnil6x",
    description: "Instagram video download",
    method: "get",
    category: "downloader",
    link: ["/igdl?url="]
};

exports.onStart = async function ({ req, res }) {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter ?url=" });
    }

    try {
        const igdl = await global.utils.igdown(url);
        res.json({ data: igdl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
