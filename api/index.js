export default async function handler(req, res) {
  // Setup CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Support GET (query) dan POST (body)
  const prompt = req.body?.prompt || req.query?.prompt;

  if (!prompt) {
    return res.status(400).json({ 
      status: false, 
      creator: "Shanove", 
      message: "Prompt is required" 
    });
  }

  try {
    const apiKey = "5VzLWXf2PTMWgRbe"; // Key kamu
    const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";
    
    // Config Model Qwen
    const payload = {
      model: "accounts/fireworks/models/qwen3-vl-235b-a22b-instruct",
      max_tokens: 4096,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Provider Error");

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({
      status: true,
      creator: "Shanove",
      data: { answer: aiResponse }
    });

  } catch (error) {
    res.status(500).json({ 
      status: false, 
      creator: "Shanove", 
      message: error.message 
    });
  }
}
