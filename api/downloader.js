const { ytdl2, pindl, ttsave, igdown, likeedown } = global.utils;

exports.config = {
    name: 'downloader',
    author: 'xnil6x',
    description: 'Downloads media from various platforms like Twitter, Instagram, Facebook, etc.',
    method: 'get',
    category: 'downloader',
    link: ['/downloader?url=']
};

// Supported platforms with correct regex patterns
const supportedPlatforms = {
    youtube: /(?:youtu\.be|youtube\.com)/,
    pinterest: /(?:pin\.it|pinterest\.com)/,
    tiktok: /(?:tiktok\.com)/,
    Instagram: /(?:Instagram|instagram.com)/,
    likee: /(?:likee\.video|l.likee\.video)/
};

exports.onStart = async function ({ req, res }) {
    try {
        let url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: "Please add ?url=media_url_here" });
        }

        // Normalize the URL: ensure it starts with https://
        if (!/^https?:\/\//.test(url)) {
            url = "https://" + url;
        }

        // Detect platform by checking if the URL matches any regex pattern
        let platform = Object.keys(supportedPlatforms).find(key => 
            supportedPlatforms[key].test(url)
        );

        if (!platform) {
            return res.status(400).json({ error: "Unsupported URL" });
        }

        let result;
        switch (platform) {
            case 'youtube':
                result = await ytdl2(url);
                break;
            case 'pinterest':
                result = await pindl(url);
                break;
            case 'tiktok':
                result = await ttsave(url);
                break;
            case 'Instagram':
                result = await igdown(url);
                break;
            case 'likee':
                result = await likeedown(url);
                break;
            default:
                return res.status(400).json({ error: "Unsupported URL" });
        }

        res.json({ content: result });
    } catch (error) {
        console.error("Error downloading media:", error);
        res.status(500).json({ error: "Failed to download media" });
    }
};