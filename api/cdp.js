const path = require("path");
const fs = require("fs");

exports.config = {
    name: 'cdp',
    author: 'xnil6x',
    description: 'Fetches a random couple from the CDP data',
    method: 'get',
    category: 'anime',
    link: ['/cdp']
};

exports.onStart = async function ({ req, res }) {
    try {
        const data = fs.readFileSync(path.join(__dirname, "tmp", "cdp.json"), "utf-8");
        const couple = JSON.parse(data); 
        var random = Math.floor(Math.random() * couple.length);

        return res.json({
            avatar: couple[random].avatar,
            character: couple[random].character,
            anime: couple[random].anime
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};
