const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dixnwu365',
  api_key: '537711188667524',
  api_secret: 'OX-FdFO0kQgaEEhVkz4Xag0F6Qo',
});

exports.config = {
  name: 'ytmp4',
  author: 'xnil6x',
  description: 'Download ytdl videos ',
  method: 'get',
  category: 'downloader',
  link: ['/ytmp4?url='],
};

exports.onStart = async function ({ req, res }) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    // Step 1: Get the Download ID
    const downloadResponse = await axios.get('https://p.oceansaver.in/ajax/download.php', {
      params: {
        copyright: 0,
        format: '720',
        url,
        api: '30de256ad09118bd6b60a13de631ae2cea6e5f9d',
      },
    });

    const title = downloadResponse.data.title;
    const id = downloadResponse.data.id;

    if (!id) {
      return res.status(500).json({ error: 'Failed to fetch download ID.' });
    }

    console.log(`Download ID: ${id}`);

    // Step 2: Get the Download Link
    const progressResponse = await axios.get('https://p.oceansaver.in/ajax/progress.php', {
      params: { id },
      headers: {
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      },
    });

    const videoUrl = progressResponse.data.download_url;

    if (!videoUrl) {
      return res.status(500).json({ error: 'Failed to fetch download URL.' });
    }

    console.log(`Video URL: ${videoUrl}`);

    // Step 3: Upload to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      public_id: `youtube_downloads/${title.replace(/\s+/g, '_')}`, // Replace spaces with underscores
    });

    console.log(`Uploaded to Cloudinary: ${cloudinaryUpload.secure_url}`);

    return res.json({
      title: title,
      url: cloudinaryUpload.secure_url,
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};
