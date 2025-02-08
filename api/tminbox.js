exports.config = { 
  name: "tminbox", 
  author: "xnil6x", 
  description: "tminbox check", 
  method: "get", 
  category: "tools", 
  link: ["/tminbox?mail="] 
};

exports.onStart = async function ({ req, res }) { 
  const mail = req.query.mail;

  if (!mail) {
    return res.status(400).json({ error: "Missing URL parameter ?mail=" });
  }

  try {
    // Call the function to get the latest messages
    const tm = await global.utils.tempinbox(mail);

    // Check if there's no data or response
    if (!tm || !tm.response || tm.response.length === 0) {
      return res.status(404).json({ error: "No new messages found for the provided email." });
    }

    // Sort the messages based on the `created_at` timestamp (descending)
    const sortedMessages = tm.response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Get the most recent message (the first after sorting)
    const latestMessage = sortedMessages[0];

    // Return only the latest message in the response
    res.json({ data: latestMessage });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};