const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { generateChatGPTResponse, generateClaudeResponse, generateDeepSeekResponse } = require('../utils/aiHandlers');

// AI code generation endpoint
router.post('/generate', [
  auth,
  body('prompt').notEmpty().withMessage('Prompt is required'),
  body('model').isIn(['gpt-4', 'claude-3', 'deepseek']).withMessage('Invalid model selected'),
  body('context').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, model, context, projectId } = req.body;
    const userId = req.user.id;

    let aiResponse;
    
    switch(model) {
      case 'gpt-4':
        aiResponse = await generateChatGPTResponse(prompt, context);
        break;
      case 'claude-3':
        aiResponse = await generateClaudeResponse(prompt, context);
        break;
      case 'deepseek':
        aiResponse = await generateDeepSeekResponse(prompt, context);
        break;
      default:
        throw new Error('Invalid AI model');
    }

    // Parse AI response into structured code
    const parsedCode = parseAIResponse(aiResponse);
    
    // Store in database if projectId provided
    if (projectId) {
      // Logic to update project with new code
    }

    res.json({
      success: true,
      code: parsedCode,
      rawResponse: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Parse AI response into structured code blocks
function parseAIResponse(response) {
  const codeBlocks = {
    html: '',
    css: '',
    js: '',
    react: '',
    backend: '',
    instructions: ''
  };

  // Extract HTML
  const htmlMatch = response.match(/```html\n([\s\S]*?)```/i) || 
                    response.match(/```html\n([\s\S]*?)```/i);
  if (htmlMatch) codeBlocks.html = htmlMatch[1].trim();

  // Extract CSS
  const cssMatch = response.match(/```css\n([\s\S]*?)```/i) ||
                   response.match(/```scss\n([\s\S]*?)```/i) ||
                   response.match(/```style\n([\s\S]*?)```/i);
  if (cssMatch) codeBlocks.css = cssMatch[1].trim();

  // Extract JavaScript
  const jsMatch = response.match(/```javascript\n([\s\S]*?)```/i) ||
                  response.match(/```js\n([\s\S]*?)```/i);
  if (jsMatch) codeBlocks.js = jsMatch[1].trim();

  // Extract React
  const reactMatch = response.match(/```jsx\n([\s\S]*?)```/i) ||
                     response.match(/```tsx\n([\s\S]*?)```/i);
  if (reactMatch) codeBlocks.react = reactMatch[1].trim();

  // Extract backend code
  const backendMatch = response.match(/```node\n([\s\S]*?)```/i) ||
                       response.match(/```python\n([\s\S]*?)```/i) ||
                       response.match(/```backend\n([\s\S]*?)```/i);
  if (backendMatch) codeBlocks.backend = backendMatch[1].trim();

  // Extract general instructions
  const textContent = response.replace(/```[\s\S]*?```/g, '').trim();
  if (textContent) codeBlocks.instructions = textContent;

  return codeBlocks;
}

// Modify existing code
router.post('/modify', [
  auth,
  body('code').notEmpty().withMessage('Code is required'),
  body('modifications').notEmpty().withMessage('Modifications are required'),
  body('model').isIn(['gpt-4', 'claude-3', 'deepseek']).withMessage('Invalid model selected')
], async (req, res) => {
  try {
    const { code, modifications, model } = req.body;
    
    const modificationPrompt = `
      Modify the following code based on these instructions: ${modifications}
      
      Current code:
      ${JSON.stringify(code, null, 2)}
      
      Return ONLY the modified code in the same format.
    `;

    let modifiedResponse;
    switch(model) {
      case 'gpt-4':
        modifiedResponse = await generateChatGPTResponse(modificationPrompt);
        break;
      case 'claude-3':
        modifiedResponse = await generateClaudeResponse(modificationPrompt);
        break;
      case 'deepseek':
        modifiedResponse = await generateDeepSeekResponse(modificationPrompt);
        break;
    }

    const parsedCode = parseAIResponse(modifiedResponse);
    
    res.json({
      success: true,
      modifiedCode: parsedCode
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
