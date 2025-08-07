// openai.js
async function getChartInstructionFromOpenAI(sheetData) {
    const apiKey = 'Here you should add api key';

    const response = await fetch("Link", {
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
