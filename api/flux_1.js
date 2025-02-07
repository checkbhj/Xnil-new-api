const axios = require('axios');

exports.config = {
    name: "flux_1",
    author: "xnil6x",
    description: "Fetch AI-generated image using Flux Diffusion.",
    method: 'get',
    category: "image generation",
    link: ["/flux_1?prompt="]
};

exports.onStart = async function ({ req, res }) {
  try {
    const prompt = req.query.prompt;

    if (!prompt) {
      return res.status(400).json({ status: "error", message: "Prompt is required" });
    }

    const response = await axios.post(
      "https://aicreate.com/wp-admin/admin-ajax.php",
      new URLSearchParams({
        action: "text_to_image_handle",
        caption: prompt,
        negative_prompt: "ugly, deformed, disfigured, nsfw, low res, blurred",
        model_version: "flux",
        size: "1024x1024"
      }),
      {
        headers: {
          "authority": "aicreate.com",
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "origin": "https://aicreate.com",
          "referer": "https://aicreate.com/text-to-image-generator/",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
          "x-requested-with": "XMLHttpRequest"
        }
      }
    );

    const html = response.data.html || response.data;

    const hrefLinks = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(match => match[1]);
    const srcLinks = [...html.matchAll(/src="(https?:\/\/[^"]+)"/g)].map(match => match[1]);

    res.json({
      status: "success",
      url: hrefLinks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to generate image" });
  }
};
