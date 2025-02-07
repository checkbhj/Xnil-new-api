exports.config = {
    name: "ytstalk",
    author: "xnil6x",
    description: "get YouTube account information",
    method: "get",
    category: "tools",
    link: ["/ytstalk?username="]
};

exports.onStart = async function ({ req, res }) {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: "Missing username parameter ?user=" });
    }

    try {
        const ytst = await global.utils.ytStalk(username);
        res.json({ data: ytst });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
