const axios = require("axios");
const fs = require("fs");
const path = __dirname + "/tmp/art.png";

exports.config = {
  name: 'prompt',
  author: 'xnil6x',
  description: 'Generates AI Flux 1 prompt',
  method: 'get',
  category: 'prompt generate',
  link: ['/prompt?q=A cute dog']
};

exports.onStart = async function ({ req, res }) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Messages query parameter is required.' });
    }

    // Make the GET request using Axios
    const response = await axios.post(
      'https://flux1.ai/api/chat',
      { messages: q },
      {
        headers: {
          authority: 'flux1.ai',
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          cookie:
            'user_source=google_organic; g_state={"i_p":1737715875894,"i_l":1}; __client_uat=1737708745; __client_uat_6iENB96m=1737708745; __session_6iENB96m=eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18ya1RRRzVFdnpZZXZFdEVOdk13WWpQNjhleHMiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL2ZsdXgxLmFpIiwiZXhwIjoxNzM3NzA4ODI3LCJmdmEiOlswLC0xXSwiaWF0IjoxNzM3NzA4NzY3LCJpc3MiOiJodHRwczovL2NsZXJrLmZsdXgxLmFpIiwibmJmIjoxNzM3NzA4NzU3LCJzaWQiOiJzZXNzXzJzNEo3UzFaYmZSV3pPZHVhTHlMU005RU9PQyIsInN1YiI6InVzZXJfMnM0SjdSazBlZzJmZmNkRWU0d2R4Szh2bFFxIn0.psoAdPc9u2JAGnVRlbsRfaWkl2yxYG99U3NNo_aw6bLWhsB6JDLEDMDdVfUZfnuxht4xbiQnyskNkTAK0lOZ1mAoxPz-oTQavHh31PTBlJc-9ROgA59ECHSxt-ypWAHfK-Bjp1ZOyqWXNACu7jV7_2vEluzWt6q8DNV8QxT7kmS_U1FuRi7gjXh1Q9fIBvZ1acwjjsS8gLvaDXdyCckywTiQW-PMiJBY0-WJbf1zpCwcBVVbzs3pXIHCl5IrhDRNG6VkpQsgxehVpW24lUVWhutwWwgYyvCgP-ggXgkV4p_yTR58WlhDFylEwgcdnNlho7KYB6aHiaCGzHRBbnE_8A',
          origin: 'https://flux1.ai',
          referer: 'https://flux1.ai/prompt-generator',
          'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        }
      }
    );

    // Send the response from the external API back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
};
