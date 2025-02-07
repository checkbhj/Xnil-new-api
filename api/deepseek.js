exports.config = {
    name: "deepseek",
    author: "xnil6x",
    description: "deepseek ai chat",
    method: "get",
    category: "ai",
    link: ["/deepseek?text="]
};

exports.onStart = async function ({ req, res }) {
    const text = req.query.text;

    if (!text) {
        return res.status(400).json({ error: "Missing URL parameter ?text=" });
    }

    try {
        const igdl = await global.utils.deepseek(text);
        res.json({ data: igdl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
