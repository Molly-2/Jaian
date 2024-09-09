const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Your TextSynth API key
const textsynthApiKey = '3145c509ce04f41991bba8ceb2b1301b';

app.get('/gen', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required as a query parameter' });
  }

  try {
    const response = await axios.post('https://api.textsynth.com/v1/engines/gptj_6B/completions', {
      prompt: prompt,
      max_tokens: 200
    }, {
      headers: {
        Authorization: `Bearer ${textsynthApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating text from TextSynth API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
