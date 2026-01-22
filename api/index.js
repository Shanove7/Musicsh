export default async function handler(req, res) {
  // 1. CORS Headers (Agar bisa diakses dari frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle Preflight Request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Ambil Prompt
  const prompt = req.body?.prompt || req.query?.prompt;

  if (!prompt) {
    return res.status(400).json({
      status: false,
      creator: "Shanove",
      message: "Prompt tidak boleh kosong."
    });
  }

  try {
    // --- KONFIGURASI API ---
    // Pastikan Key ini benar. Biasanya diawali 'fw_'. 
    // Jika key Anda '5VzLWXf2PTMWgRbe', pastikan itu key yang valid dan aktif.
    const apiKey = "5VzLWXf2PTMWgRbe"; 
    
    // URL Sesuai Dokumentasi
    const apiUrl = "https://api.fireworks.ai/inference/v1/chat/completions";

    // Payload Sesuai Dokumentasi
    const payload = {
      model: "accounts/fireworks/models/qwen3-vl-235b-a22b-instruct", // Pastikan model ini tersedia untuk akun Anda
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      // Parameter tambahan sesuai docs
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1,
      top_k: 40
    };

    // 3. Request ke Fireworks AI
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`, // Format: Bearer <token>
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 4. Jika Error dari Provider (Misal: 401 Unauthorized, 400 Bad Request)
    if (!response.ok) {
      console.error("Fireworks Error:", data);
      return res.status(response.status).json({
        status: false,
        creator: "Shanove",
        message: "Gagal mengambil respon dari AI.",
        // Ini akan menampilkan pesan error asli dari Fireworks (penting untuk debug)
        server_error: data 
      });
    }

    // 5. Ambil Konten Jawaban
    // Path: choices[0].message.content
    const answer = data.choices?.[0]?.message?.content || "Tidak ada jawaban dari AI.";

    // 6. Kirim Respon Sukses
    res.status(200).json({
      status: true,
      creator: "Shanove",
      data: {
        answer: answer
      }
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({
      status: false,
      creator: "Shanove",
      message: "Internal Server Error",
      error_log: error.message
    });
  }
}
