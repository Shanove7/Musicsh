import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imageBase64 } = req.body;
        const API_KEY = process.env.BETABOTZ_API_KEY;

        if (!imageBase64) return res.status(400).json({ error: 'Gambar tidak ditemukan' });
        if (!API_KEY) return res.status(500).json({ error: 'API Key server belum disetting' });

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

        const catboxRes = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: form
        });

        if (!catboxRes.ok) throw new Error('Gagal upload ke Catbox');
        const catboxUrl = await catboxRes.text();

        const betaBotzUrl = `https://api.betabotz.eu.org/api/maker/jadihitam?url=${catboxUrl}&apikey=${API_KEY}`;
        
        const convertRes = await fetch(betaBotzUrl);
        if (!convertRes.ok) throw new Error('Gagal konversi gambar');

        const imageBuffer = await convertRes.arrayBuffer();

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
