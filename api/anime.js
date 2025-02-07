const axios = require('axios');

exports.config = {
  name: 'anime',
  author: 'xnil6x',
  description: 'Get random anime gif, image',
  method: 'get',
  category: 'anime',
  link: ['/anime?q=']
};

const gifCategories = [
  "Angry", "Baka", "Bite", "Blush", "Bonk", "Bored", "Bully", "Bye", 
  "Chase", "Cheer", "Cringe", "Cry", "Cuddle", "Dab", "Dance", "Die", 
  "Disgust", "Facepalm", "Feed", "Glomp", "Happy", "Hi", "Highfive", 
  "Hold", "Hug", "Kick", "Kill", "Kiss", "Laugh", "Lick", "Love", 
  "Lurk", "Midfing", "Nervous", "Nom", "Nope", "Nuzzle", "Panic", 
  "Pat", "Peck", "Poke", "Pout", "Punch", "Run", "Sad", "Shoot", 
  "Shrug", "Sip", "Slap", "Sleepy", "Smile", "Smug", "Stab", "Stare", 
  "Suicide", "Tease", "Think", "Thumbsup", "Tickle", "Triggered", 
  "Wag", "Wave", "Wink", "Yes"
];

const API_TOKEN = 'MTE5ODU3OTIwMjQzODQ4NDAxOQ--.MTczNzg0MDc3Mg--.72e73ef250d';

exports.onStart = async function ({ req, res, log }) {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({
      error: "Missing 'q' query parameter",
      example: "/anime?q=waifu",
      gifCategories: gifCategories,
      image: "Husbando, Waifu",
      text: "Fact, Password, Quote, Tags, Owoify, Uvuify, Uwuify"
    });
  }

  try {
    const response = await axios.get(`https://waifu.it/api/v4/${q}`, {
      headers: {
        Authorization: API_TOKEN,
      },
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch data",
      details: err.response ? err.response.data : err.message,
    });
  }
};
