exports.config = { 
  name: "tmgen", 
  author: "xnil6x", 
  description: "temp mail gen", 
  method: "get", 
  category: "downloader", 
  link: ["/tmgen"] 
};

exports.onStart = async function ({ req, res }) {
  try {
    const tm = await global.utils.tempgen();

    console.log('Generated temp mail:', tm);

    if (!tm || !tm.response || !tm.response.email) {
      return res.status(404).json({ error: "New temp mail generation error" });
    }
    const tempMail = {
      email: tm.response.email,
      token: tm.response.token
    };

    res.json({ data: tempMail });

  } catch (error) {
    console.error('Error generating temp mail:', error);
    res.status(500).json({ error: error.message });
  }
};