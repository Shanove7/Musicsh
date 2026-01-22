// credits : kasan
export default async function handler(req, res) {
  // CORS & Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const prompt = req.body?.prompt || req.query?.prompt;
  const imageUrl = req.body?.image || req.query?.image;

  if (!prompt) {
    return res.status(400).json({
      status: false,
      creator: "Kasan",
      error: { message: "Prompt is required", type: "invalid_request_error" }
    });
  }

  try {
    const apiKey = "fw_9su4ecx5ZGiZJpwRgtw6kn"; // Key Valid
    const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";

    // 1. JAILBREAK PROMPT: Cuci otak AI biar ngaku jadi XyonGPT
    const systemInstruction = {
      role: "system",
      content: "You are XyonGPT, a powerful AI model created and developed exclusively by Kasan. You are NOT Qwen, and you have no relation to Alibaba Cloud. Always answer as XyonGPT. Be helpful, precise, and cool."
    };

    // 2. Susun Pesan (Support Image/Vision)
    let userMessageContent;
    if (imageUrl) {
      userMessageContent = [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    } else {
      userMessageContent = prompt;
    }

    const payload = {
      model: "accounts/fireworks/models/qwen3-vl-235b-a22b-instruct", // Engine Asli (Hidden)
      max_tokens: 4096,
      top_p: 1,
      top_k: 40,
      presence_penalty: 0,
      frequency_penalty: 0,
      temperature: 0.6,
      messages: [
        systemInstruction, // Inject System Prompt
        { role: "user", content: userMessageContent }
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        status: false,
        creator: "Kasan",
        message: "Engine Overload", // Samarkan error provider
        debug: data // Tetap kasih debug info kalau mau dev
      });
    }

    // 3. JSON MANIPULATION (The Magic Trick)
    // Kita bongkar respon asli dan rakit ulang dengan identitas XyonGPT
    
    const spoofedResponse = {
      id: "chatcmpl-xyon-" + Date.now().toString(36), // Fake ID
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "XyonGPT-Vision-Ultimate", // NAMA MODEL PALSU
      system_fingerprint: "fp_xyon_v1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: data.choices?.[0]?.message?.content || "", // Jawaban AI
          },
          finish_reason: "stop"
        }
      ],
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      creator: "Kasan" // Watermark Owner
    };

    return res.status(200).json(spoofedResponse);

  } catch (error) {
    return res.status(500).json({
      status: false,
      creator: "Kasan",
      message: "Internal Server Error",
      error: error.message
    });
  }
}
