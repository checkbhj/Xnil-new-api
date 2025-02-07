const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dixnwu365',
  api_key: '537711188667524',
  api_secret: 'OX-FdFO0kQgaEEhVkz4Xag0F6Qo',
});

exports.config = {
  name: 'ytdl',
  author: 'xnil6x',
  description: 'Download ytdl videos',
  method: 'get',
  category: 'downloader',
  link: ['/ytdl?url='],
};

exports.onStart = async function ({ req, res }) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    const downloadResponse = await axios.get('https://p.oceansaver.in/ajax/download.php', {
      params: {
        copyright: 0,
        format: 'mp3',
        url,
        api: '30de256ad09118bd6b60a13de631ae2cea6e5f9d',
      },
    });

    const title = downloadResponse.data.title;
    const id = downloadResponse.data.id;

    if (!id) {
      return res.status(500).json({ error: 'Failed to fetch download ID.' });
    }

    const progressResponse = await axios.get('https://p.oceansaver.in/ajax/progress.php', {
      params: { id },
      headers: {
        'authority': 'p.oceansaver.in',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'origin': 'https://yt1s.com.co',
        'referer': 'https://yt1s.com.co/',
        'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });

    const videoUrl = progressResponse.data.download_url;

    // Upload to Cloudinary
    const cloudinaryUploadResponse = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'auto', // Automatically detect the type (video/audio/image)
      public_id: `yt_downloads/${title}`,
    });

    return res.json({
      title: title,
      url: cloudinaryUploadResponse.secure_url, // The URL after upload to Cloudinary
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};
