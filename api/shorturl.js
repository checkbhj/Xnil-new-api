exports.config = {
    name: "shorturl",
    author: "xnil6x",
    description: "Long URL shortener",
    method: "get",
    category: "tools",
    link: ["/shorturl?url="]
};

exports.onStart = async function ({ req, res }) {
    const longURL = req.query.url;

    if (!longURL) {
        return res.status(400).json({ error: "Missing URL parameter ?url=" });
    }

    try {
        const shortURL = await global.utils.shortenURL(longURL);
        res.json({ original: longURL, short: shortURL });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
