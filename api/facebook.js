const axios = require('axios');
const qs = require("qs");
const FormData = require("form-data");

exports.config = {
  name: 'facebook',
  author: 'xnil6x',
  description: 'Download Facebook videos',
  method: 'get',
  category: 'downloader',
  link: ['/facebook?url=https://www.facebook.com/share/v/18PkYoDpy6/']
};

async function uploadToImgur(videoUrl) {
  const form = new FormData();
  form.append("image", videoUrl);
  form.append("type", "URL");

  try {
    const response = await axios.post("https://api.imgur.com/3/upload", form, {
      headers: {
        Authorization: "Client-ID 98f3897f0672eaa", // Replace with your Imgur Client ID
        ...form.getHeaders(),
      },
    });
    return response.data.data.link;
  } catch (error) {
    console.error("Imgur Upload Error:", error);
    return "";
  }
}

async function fbdl(url) {
  const endpoint = "https://likeedownloader.com/process";
  const data = qs.stringify({ id: url, locale: "en" });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
  };

  try {
    const response = await axios.post(endpoint, data, { headers });
    const htmlContent = response.data.template;
    const downloadLinks = [];
    const regex = /href="([^"]+)" download>/g;
    let match;

    while ((match = regex.exec(htmlContent)) !== null) {
      downloadLinks.push(match[1]);
    }

    const hd = downloadLinks[0] || "";
    const sd = downloadLinks[1] || "";

    // Upload HD & SD links to Imgur
    const hdImgur = hd ? await uploadToImgur(hd) : "";
    const sdImgur = sd ? await uploadToImgur(sd) : "";

    return {
      author: "xnil",
      status: 200,
        url: hdImgur,
        message: "HD streaming is working.",
        url2: sdImgur,
    };
  } catch (error) {
    console.error("Error fetching video:", error);
    return {
      author: "xnil",
      status: 500,
      data: {
        hd: "",
        sd: "",
      },
      error: error.message,
    };
  }
}

exports.onStart = async function ({ req, res }) {
  try {
    const url = req.query.url;
    if (!url) return res.json({ status: false, creator: this.config.author, message: "[!] Enter URL parameter!" });

    const result = await fbdl(url);
    return res.json(result);  // Send the response in JSON format
  } catch (error) {
    console.error("Error processing video:", error);
    return res.json({
      status: false,
      creator: this.config.author,
      message: "An error occurred while processing the video.",
    });
  }
};