// credits : kasan
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const prompt = req.body?.prompt || req.query?.prompt;

  if (!prompt) {
    return res.status(400).json({
      status: false,
      creator: "Shanove",
      message: "Prompt is required"
    });
  }

  try {
    const apiKey = "Fw_9su4ecx5ZGiZJpwRgtw6kn";
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
        creator: "Shanove",
        message: "Provider Error",
        error_detail: data
      });
    }

    const aiAnswer = data.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({
      status: true,
      creator: "Shanove",
      data: {
        answer: aiAnswer
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      creator: "Shanove",
      message: "Internal Server Error",
      error_log: error.message
    });
  }
}
