import express from "express";
import Groq from "groq-sdk";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3000; 

app.use(cors());

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log("userMessage",userMessage);
    
    

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: userMessage,
                },
            ],
            model: 'llama3-8b-8192', 
        });

        const botReply = chatCompletion.choices[0]?.message?.content || 'No response from the model.';
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error communicating with Groq:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get response from Groq' });
    }
});
