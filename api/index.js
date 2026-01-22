export default async function handler(req, res) {
  // 1. Setup CORS (Agar bisa ditembak dari mana saja)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Ambil prompt dari query string (support GET) atau body (support POST)
  const prompt = req.query.prompt || (req.body && req.body.prompt);

  if (!prompt) {
    return res.status(400).json({
      status: false,
      creator: "Shanove",
      message: "Parameter 'prompt' is required."
    });
  }

  try {
    // 3. Konfigurasi ke Fireworks AI
    const apiKey = "5VzLWXf2PTMWgRbe"; // Key dari request kamu (tanpa tanda < >)
    const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";
    
    const payload = {
      model: "accounts/fireworks/models/qwen3-vl-235b-a22b-instruct",
      max_tokens: 4096,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    };

    // 4. Request ke Fireworks (Fetch)
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Cek jika ada error dari provider
    if (!response.ok) {
      throw new Error(data.error?.message || "Error from AI Provider");
    }

    // Ambil jawaban AI
    const aiAnswer = data.choices?.[0]?.message?.content || "No response.";

    // 5. Format Response ala Shanove
    res.status(200).json({
      status: true,
      creator: "Shanove",
      data: {
        query: prompt,
        answer: aiAnswer
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: false,
      creator: "Shanove",
      message: "Internal Server Error",
      error_log: error.message // Opsional: tampilkan pesan error untuk debug
    });
  }
}

