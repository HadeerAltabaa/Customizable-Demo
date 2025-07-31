// openai.js
async function getChartInstructionFromOpenAI(sheetData) {
    const apiKey = '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';

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You're a data analyst. Generate a simple chart config from the given Excel data."
                },
                {
                    role: "user",
                    content: `Here is some Excel data (first few rows):\n${sheetData}\nWhat is the most useful chart we can create? Return a JSON object like: { type, labels, datasets }`
                }
            ]
        })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    try {
        return JSON.parse(reply);
    } catch {
        console.error("Failed to parse OpenAI response:", reply);
        return null;
    }
}
