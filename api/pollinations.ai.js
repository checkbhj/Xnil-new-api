const axios = require('axios');
const defaultWidth = 1024;
const defaultHeight = 1024;
const defaultModel = 'flux-pro';

const supportedModels = [
    'flux-pro',
    'flux',
    'Flux-realism',
    'Flux-anime',
    'Flux-3d',
    'Flux-cablyai',
    'Turbo'
];

const modelMap = {
    1: 'flux-pro',
    2: 'flux',
    3: 'Flux-realism',
    4: 'Flux-anime',
    5: 'Flux-3d',
    6: 'Flux-cablyai',
    7: 'Turbo'
};

exports.config = {
  name: "pollinations",
  author: "xnil6x",
  description: "Fetches an image based on a text prompt from Pollinations AI with more model support",
  method: "get",
  category: "image generation",
  link: ["/pollinations"]
};

exports.onStart = async function ({ req, res }) {
  const prompt = req.query.prompt;
  const width = parseInt(req.query.width || defaultWidth);
  const height = parseInt(req.query.height || defaultHeight);
  const model = req.query.model || defaultModel;

  let selectedModel = model;
  if (modelMap[model]) {
      selectedModel = modelMap[model];
  }

  if (!supportedModels.includes(selectedModel)) {
      return res.status(400).json({
          error: `Invalid model. Supported models are: ${supportedModels.join(', ')}`
      });
  }

  try {
      if (!prompt) {
          return res.status(400).json({
              message: "Welcome to the Pollinations API! Use /generate to get a pollination URL.",
              example: "/pollinations?prompt=a sunset&width=512&height=512&seed=12345&model=2",
              defaults: { width: defaultWidth, height: defaultHeight },
              supportedModels
          });
      }
      const seed = Math.floor(Math.random() * 100000); // Generate a random seed
      const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${selectedModel}`;

      // Return the URL of the generated image
      return res.status(200).json({
          Image: url
      });

  } catch (error) {
      console.error(error);
      if (error.response) {
          console.error('Error:', error.response.data);
      }
      return res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
};
