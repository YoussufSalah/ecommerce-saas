require("dotenv").config();

const generateProductContent = async (title, features = []) => {
    try {
        const prompt = `
You are a product marketing assistant.

Write a compelling product description and SEO-friendly tags for the following product:

Title: ${title}
Features:
${features.map((f) => `- ${f}`).join("\n")}

Output format:
Description: ...
Tags: [tag1, tag2, tag3, ...]
        `.trim();

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000", // replace with your domain in production
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant.",
                        },
                        { role: "user", content: prompt },
                    ],
                    temperature: 0.7,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter Error:", data);
            throw new Error("Failed to generate product content");
        }

        const text = data.choices?.[0]?.message?.content ?? "";

        const descriptionMatch = text.match(/Description:\s*(.+?)(?:\n|$)/s);
        const tagsMatch = text.match(/Tags:\s*\[([^\]]+)\]/);

        const description = descriptionMatch
            ? descriptionMatch[1].trim()
            : null;
        const tags = tagsMatch
            ? tagsMatch[1]
                  .split(",")
                  .map((tag) => tag.trim().replace(/["']/g, ""))
            : [];
        return { description, tags };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = generateProductContent;
