const axios = require('axios');
const FormData = require('form-data');
const { createCanvas, loadImage } = require('canvas');

// Your ImgBB API key
const IMGBB_API_KEY = 'cb5b284254dc4131deb0000e7c18a084'; // Replace with your ImgBB API key

const defaultPrompt = 'a cute girl';
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

// Function to add "test by xnil" text to an image
const addTextToImage = (image, width, height) => {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw the image
    ctx.drawImage(image, 0, 0, width, height);

    // Add red background for the text
    ctx.fillStyle = 'red';
    ctx.fillRect(width - 350, height - 60, 350, 60);

    // Add white text
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('test by xnil', width - 175, height - 30);

    return canvas;
};

// Function to combine images into a square canvas (2x2 grid)
const combineImages = (images, width, height) => {
    const canvas = createCanvas(width * 2, height * 2); // 2x2 grid
    const ctx = canvas.getContext('2d');

    ctx.drawImage(images[0], 0, 0, width, height); // Top-left
    ctx.drawImage(images[1], width, 0, width, height); // Top-right
    ctx.drawImage(images[2], 0, height, width, height); // Bottom-left
    ctx.drawImage(images[3], width, height, width, height); // Bottom-right

    return canvas;
};

exports.config = {
  name: "poli4img",
  author: "xnil6x",
  description: "text prompt from Pollinations AI with 4img & more model support",
  method: "get",
  category: "image generation",
  link: ["/poli4img"]
};

exports.onStart = async function ({ req, res }) {
  const prompt = req.query.prompt ;
    const width = parseInt(req.query.width || defaultWidth);
    const height = parseInt(req.query.height || defaultHeight);
    const model = req.query.model || defaultModel;

  if (!prompt) {
      return res.status(400).json({
        message: "Welcome to the Pollinations API! Use /generate to get a pollination URL.",
        example: "/pollinations?prompt=a sunset&width=512&height=512&seed=12345&model=2",
        defaults: { width: defaultWidth, height: defaultHeight },
        supportedModels
      });
  }

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
        const urls = [];
        for (let i = 0; i < 4; i++) {
            const seed = Math.floor(Math.random() * 100000);
            const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${selectedModel}`;
            urls.push(url);
        }

        // Fetch images from URLs and add text to each
        const processedImages = await Promise.all(
            urls.map(async (url) => {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const image = await loadImage(response.data);

                // Add text to each image
                const canvasWithText = addTextToImage(image, width, height);
                return canvasWithText;
            })
        );

        const individualImageUrls = [];

        // Upload each processed image to ImgBB
        for (let i = 0; i < processedImages.length; i++) {
            const base64Image = processedImages[i].toBuffer('image/jpeg', { quality: 80 }).toString('base64');

            const form = new FormData();
            form.append('image', base64Image);
            form.append('key', IMGBB_API_KEY);

            const imgurResponse = await axios.post(
                'https://api.imgbb.com/1/upload',
                form,
                { headers: form.getHeaders() }
            );

            individualImageUrls.push(imgurResponse.data.data.url);
        }

        // Combine images into one canvas
        const combinedCanvas = combineImages(processedImages, width, height);

        // Add text to the combined image
        const finalCanvasWithText = addTextToImage(combinedCanvas, width * 2, height * 2);

        // Upload combined image
        const combinedBase64Image = finalCanvasWithText.toBuffer('image/jpeg', { quality: 80 }).toString('base64');

        const combinedForm = new FormData();
        combinedForm.append('image', combinedBase64Image);
        combinedForm.append('key', IMGBB_API_KEY);

        const combinedImgurResponse = await axios.post(
            'https://api.imgbb.com/1/upload',
            combinedForm,
            { headers: combinedForm.getHeaders() }
        );

        return res.status(200).json({
            combineUrl: combinedImgurResponse.data.data.url,
            Images: {
                image1: individualImageUrls[0],
                image2: individualImageUrls[1],
                image3: individualImageUrls[2],
                image4: individualImageUrls[3]
            }
        });
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error('ImgBB Error:', error.response.data);
        }
        return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
};
