const axios = require('axios');

// Configuration
const AI_CONFIG = {
  chatgpt: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4'
  },
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229'
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat'
  }
};

// System prompt for AI
const SYSTEM_PROMPT = `You are CodeVault AI, an expert senior full-stack developer. Your task is to generate complete, production-ready website code based on user requests.

GENERATION RULES:
1. ALWAYS return COMPLETE, WORKING code
2. Use modern HTML5, CSS3, and JavaScript/React
3. Include Tailwind CSS when appropriate
4. Make responsive designs
5. Add comments for complex logic
6. Include sample API integrations when relevant
7. Ensure code is secure and follows best practices

RESPONSE FORMAT:
- Use code blocks with language tags
- Provide HTML, CSS, and JS separately
- Include deployment instructions if needed
- Suggest improvements

DO NOT include explanations outside code blocks unless absolutely necessary.`;

// ChatGPT handler
async function generateChatGPTResponse(prompt, context = {}) {
  try {
    const response = await axios.post(AI_CONFIG.chatgpt.url, {
      model: AI_CONFIG.chatgpt.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(context.history || []),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT API Error:', error.response?.data || error.message);
    throw new Error(`ChatGPT generation failed: ${error.message}`);
  }
}

// Claude handler
async function generateClaudeResponse(prompt, context = {}) {
  try {
    const response = await axios.post(AI_CONFIG.claude.url, {
      model: AI_CONFIG.claude.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(context.history || []),
        { role: "user", content: prompt }
      ],
      max_tokens: 4000
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    throw new Error(`Claude generation failed: ${error.message}`);
  }
}

// DeepSeek handler
async function generateDeepSeekResponse(prompt, context = {}) {
  try {
    const response = await axios.post(AI_CONFIG.deepseek.url, {
      model: AI_CONFIG.deepseek.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(context.history || []),
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error:', error.response?.data || error.message);
    throw new Error(`DeepSeek generation failed: ${error.message}`);
  }
}

module.exports = {
  generateChatGPTResponse,
  generateClaudeResponse,
  generateDeepSeekResponse
};
