const axios = require('axios');

exports.config = {
    name: 'sdxl',
    author: 'xnil6x',
    description: 'Image generation using SDXL models and samplers',
    category: 'image generation',
    link: ['/sdxl?prompt=&model=&sampler='],
    method: 'get'
};

exports.onStart = async function ({ req, res }) {
    const { prompt, model, sampler } = req.query;

    if (!prompt || !model || !sampler) {
        return res.status(400).json({
            error: 'The "prompt", "model", and "sampler" parameters are required',
            availableModels: [
                "dreamshaperXL10_alpha2.safetensors [c8afe2ef]",
                "dynavisionXL_0411.safetensors [c39cc051]",
                "juggernautXL_v45.safetensors [e75f5471]",
                "realismEngineSDXL_v10.safetensors [af771c3f]",
                "sd_xl_base_1.0.safetensors [be9edd61]",
                "sd_xl_base_1.0_inpainting_0.1.safetensors [5679a81a]",
                "turbovisionXL_v431.safetensors [78890989]"
            ],
            availableSamplers: [
                "Euler", "Euler a", "LMS", "Heun", "DPM2", "DPM2 a", 
                "DPM++ 2S a", "DPM++ 2M", "DPM++ SDE", "DPM fast", 
                "DPM adaptive", "LMS Karras", "DPM2 Karras", 
                "DPM2 a Karras", "DPM++ 2S a Karras", "DPM++ 2M Karras", 
                "DPM++ SDE Karras"
            ]
        });
    }

    try {
        const url = `https://itzpire.com/ai/sdxl?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}&sampler=${encodeURIComponent(sampler)}`;

        const { data } = await axios.get(url, {
            headers: { 'accept': 'application/json' }
        });

        if (data.status !== "success") {
            return res.status(500).json({ error: 'Image generation failed', details: data });
        }

        res.status(200).json({
            status: "success",
            author: "AceGerome",
            code: 200,
            imageUrl: data.data.imageUrl,
            job: data.data.job
        });
    } catch (error) {
        console.error("Error:", error);
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
