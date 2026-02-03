const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generateAIContent = async (prompt, systemInstruction = "", imageFile = null, jsonMode = false) => {
    const apiKey = GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    if (!apiKey) return "API Key Missing.";

    const userParts = [{ text: prompt }];
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        userParts.push(imagePart);
    }

    const payload = {
        contents: [{ role: "user", parts: userParts }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    if (jsonMode) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    action: { type: "STRING" },
                    response: { type: "STRING" },
                    color: { type: "STRING" },
                    page: { type: "STRING" },
                    code: { type: "STRING" },
                    language: { type: "STRING" },
                    image_prompt: { type: "STRING" },
                    exposure: { type: "INTEGER" },
                    contrast: { type: "INTEGER" },
                    saturation: { type: "INTEGER" },
                    hue: { type: "INTEGER" },
                    blur: { type: "INTEGER" },
                    temperature: { type: "INTEGER" },
                    tint: { type: "INTEGER" }
                }
            }
        };
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonMode && resultText) return JSON.parse(resultText);
        return resultText;
    } catch (error) {
        console.error("Gemini AI Error:", error);
        if (jsonMode) return { action: "chat", response: "Error: " + error.message };
        return "Error connecting to AI.";
    }
};

export const generateImageFromText = async (prompt) => {
    const apiKey = GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
    const payload = { instances: [{ prompt: prompt }], parameters: { sampleCount: 1 } };
    try {
        const response = await fetch(url, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    } catch (error) { console.error("Image Gen Error:", error); throw error; }
};
