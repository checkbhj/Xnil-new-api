const dylux = require('api-dylux');

exports.config = {
    name: 'lyrics',
    author: 'xnil6x',
    description: 'Fetch song lyrics',
    method: 'get',
    category: 'search',
    link: ['/lyrics?query=until i found you']
};

exports.onStart = async function ({ req, res }) { 
    try {
        const text1 = req.query.query;
        if (!text1) {
            return res.json({ status: false, creator: this.config.author, message: "[!] enter query parameter!" });
        }

        dylux.lyrics(text1).then((data) => {
            if (!data) {
                return res.json(loghandler.notfound);
            }
            res.json({
                status: true,
                creator: this.config.author,
                result: data
            });
        }).catch((err) => {
            res.sendFile(error);
        });
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        res.status(500).json({ error: "Failed to retrieve lyrics." });
    }
};
