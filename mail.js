import CONFIG from './config.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

document.getElementById('mail-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const content = document.getElementById('mail-content').value;
    const resultDiv = document.getElementById('mail-result');
    const summaryDiv = document.getElementById('mail-summary');
    const actionsDiv = document.getElementById('mail-actions');

    btn.textContent = 'Analyzing...';
    btn.disabled = true;

    try {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.GROQ_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{
                    role: 'user',
                    content: `Analyze this email and provide:
1. **Subject/Topic**: One line
2. **Summary**: 2-3 sentences max
3. **Key Points**: Bullet points
4. **Action Required**: Yes/No and what action
5. **Priority**: High/Medium/Low
6. **Deadline**: If any mentioned

Email content:
${content}`
                }],
                max_tokens: 500
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const text = data.choices?.[0]?.message?.content || 'Could not summarize';

        summaryDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        resultDiv.style.display = 'block';

        actionsDiv.innerHTML = `
            <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText(document.getElementById('mail-summary').innerText)">Copy Summary</button>
        `;
    } catch (error) {
        summaryDiv.innerHTML = '<p style="color:var(--danger)">Error: ' + error.message + '</p>';
        resultDiv.style.display = 'block';
    }

    btn.textContent = 'Summarize with AI';
    btn.disabled = false;
});
