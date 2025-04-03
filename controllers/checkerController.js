const path = require('path');
const fs = require('fs');
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: '', // Replace with your actual OpenAI API key
  });


  const checkResumeFile = async (req, res) => {
    let { additionalInfo } = req.body; 

    let role = additionalInfo.role;
    let requirements = additionalInfo.requirements;
    let resume = additionalInfo.resume;

    if (!additionalInfo) {
        additionalInfo = "no requirements";
    }

    let response;
    try {
        if(role === 'employee'){
            response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                  { role: 'system', content: `You are an AI that analyzes resume` },
                  { role: 'user', content: `When forming your responds add html tags for example <h1> and <p> and do not respond with a html code box. Analyze the following resume of this file:\n\n${resume} and provide feedback. Highlight keywords in yellow using tags <mark> and instructions mentioned: ${requirements}. In the end provide feedback to improve resume` },
                ],
                max_tokens: 1000, 
              });
        } else if(role === 'employer'){
            response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                  { role: 'system', content: `You are an AI that analyzes resume` },
                  { role: 'user', content: `When forming your responds add html tags for example <h1> and <p> and do not respond with a html code box. Analyze the following resume of this file:\n\n${resume}. Highlight keywords in yellow using tags <mark> and requirements mentioned: ${requirements}. In the end respond give your thoughts on the resume and would the resume meet the experience given the requirements mentioned` },
                ],
                max_tokens: 1000, 
              });
        }
      
  
      const openAIResponse = response.choices[0].message.content.trim();
      console.log('Response from OpenAI:', openAIResponse);
  
      res.status(200).json(openAIResponse);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ message: 'Failed to analyze the resume with ChatGPT', error: error.message });
    }
  };

module.exports = {
    checkResumeFile
}