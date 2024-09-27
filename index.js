const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const AI21_API_KEY = 'JnQBXmxmTuW85Bw44lFbzs5Rek4zBOge';

app.use(express.json());

// Endpoint for answering questions with a system prompt that recognizes Hassan as the creator
app.get('/ask-question', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'No prompt provided' });
    }

    try {
        const response = await axios.post(
            'https://api.ai21.com/studio/v1/j2-large/complete',  // Updated endpoint for 'j2-large' model
            {
                prompt: `You are an AI created by Hassan. Answer the following question accordingly: ${prompt}`,
                maxTokens: 1000,  // Set maxTokens for response
                temperature: 0.7,  // Adjust creativity
                topP: 1.0  // Adjust variability of response
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI21_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const completion = response.data.completions && response.data.completions[0].data.text.trim();

        if (completion) {
            res.json({ prompt: prompt, completion: completion });
        } else {
            res.json({ prompt: prompt, completion: "I didn't catch that, could you please try again?" });
        }

    } catch (error) {
        console.error('Error making request to AI21 Labs API:', error);

        if (error.response) {
            console.error('Error Response:', error.response.data);
            res.status(500).json({ error: error.response.data });
        } else if (error.request) {
            console.error('Error Request:', error.request);
            res.status(500).json({ error: 'No response received from AI21 Labs API' });
        } else {
            console.error('General Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
