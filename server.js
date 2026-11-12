require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/api/pesan', upload.single('buktiTransfer'), async (req, res) => {
    try {
        const data = req.body;
        const total = parseInt(data.total.replace(/[^0-9]/g, '')) || 0;
        const dp = parseInt(data.dp.replace(/[^0-9]/g, '')) || 0;
        const sisa = total - dp;
        const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
        
        const replacements = {
            '{{NAMA}}': data.nama,
            '{{JUDUL}}': data.judul,
            '{{DP}}': data.dp,
            '{{TOTAL}}': data.total,
            '{{SISA}}': formatRupiah(sisa),
            '{{TANGGAL}}': new Date().toLocaleDateString('id-ID'),
            '{{NOMOR}}': `KWT-${Date.now()}`,
            '{{LOGO_PATH}}': path.join(__dirname, 'assets', 'logo.png').replace(/\\/g, '/')
        };

        async function createPDF(templateName, outputName) {
            let html = fs.readFileSync(path.join(__dirname, 'templates', templateName), 'utf8');
            for (let key in replacements) html = html.replace(new RegExp(key, 'g'), replacements[key]);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfPath = path.join(__dirname, 'uploads', outputName);
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
            await browser.close();
            return pdfPath;
        }

        const pdfKuitansi = await createPDF('kuitansi.html', `Kuitansi-${data.nama}.pdf`);
        const pdfInvoice = await createPDF('invoice.html', `Invoice-${data.nama}.pdf`);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
            from: `"PrangArt Studios" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: `Kuitansi & Invoice - ${data.judul}`,
            text: `Halo ${data.nama}, berikut terlampir Kuitansi dan Invoice Anda.`,
            attachments: [{ path: pdfKuitansi }, { path: pdfInvoice }]
        });

        let waNumber = data.wa.replace(/\D/g, '');
        if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);
        const pdfBase64 = fs.readFileSync(pdfKuitansi).toString('base64');

        try {
            await axios.post(`${process.env.WAHA_URL}/api/sendFile`, {
                session: process.env.WAHA_SESSION,
                chatId: `${waNumber}@c.us`,
                file: { mimetype: 'application/pdf', filename: 'Kuitansi.pdf', data: pdfBase64 },
                caption: `Halo ${data.nama}, terima kasih telah memesan di PrangArt Studios. Sisa pelunasan: ${formatRupiah(sisa)}.`
            });
        } catch (err) { console.log("WAHA Error:", err.message); }

        res.status(200).json({ message: 'Sukses' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error Server' });
    }
});

app.listen(5000, () => console.log('Backend berjalan di http://localhost:5000'));
