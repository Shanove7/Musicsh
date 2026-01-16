// credits : kasan
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;
    const API_KEY = process.env.BETABOTZ_API_KEY;

    if (!url) {
        return res.status(400).json({ error: 'URL gambar diperlukan' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key server belum disetting' });
    }

    const apiUrl = `https://api.betabotz.eu.org/api/maker/jadihitam?url=${url}&apikey=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            return res.status(500).json({ error: 'Gagal mengambil gambar dari API BetaBotz' });
        }

        const buffer = await response.arrayBuffer();
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 's-maxage=86400'); 
        res.send(Buffer.from(buffer));

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
