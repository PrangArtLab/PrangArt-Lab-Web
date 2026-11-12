require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Konfigurasi Multer (untuk upload file bukti transfer)
const upload = multer({ dest: 'uploads/' });

// Folder statis untuk frontend
app.use(express.static('public'));

app.post('/api/pesan', upload.single('buktiTransfer'), async (req, res) => {
    try {
        const data = req.body;
        const fileBukti = req.file;

        // 1. Hitung Total & Sisa Pelunasan
        const cleanTotal = parseInt(data.total.replace(/[^0-9]/g, ''), 10) || 0;
        const cleanDP = parseInt(data.dp.replace(/[^0-9]/g, ''), 10) || 0;
        const sisa = cleanTotal - cleanDP;
        const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
        const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const nomorKuitansi = `KWT-${Date.now()}`;

        // 2. Siapkan data untuk Template PDF
        const logoPath = path.join(__dirname, 'assets', 'logo.png');
        const replacements = {
            '{{NAMA}}': data.nama,
            '{{JUDUL}}': data.judul,
            '{{DP}}': data.dp,
            '{{TOTAL}}': data.total,
            '{{SISA}}': formatRupiah(sisa),
            '{{TANGGAL}}': tanggal,
            '{{NOMOR}}': nomorKuitansi,
            '{{LOGO_PATH}}': logoPath.replace(/\\/g, '/') // Untuk Windows
        };

        // 3. Fungsi Generate PDF
        async function generatePDF(templateName, outputName) {
            let html = fs.readFileSync(path.join(__dirname, 'templates', templateName), 'utf8');
            for (let key in replacements) {
                html = html.replace(new RegExp(key, 'g'), replacements[key]);
            }

            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            const pdfPath = path.join(__dirname, 'uploads', outputName);
            await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
            await browser.close();
            return pdfPath;
        }

        // Generate kedua PDF
        const pdfKuitansiPath = await generatePDF('kuitansi.html', `Kuitansi-${data.nama}.pdf`);
        const pdfInvoicePath = await generatePDF('invoice.html', `Invoice-${data.nama}.pdf`);

        // 4. Kirim Email via Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"PrangArt Studios" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: `Kuitansi & Invoice Pemesanan - ${data.judul}`,
            text: `Halo ${data.nama},\n\nTerima kasih telah memesan di PrangArt Studios.\nBerikut kami lampirkan Kuitansi DP dan Invoice Pelunasan.\nSisa pelunasan Anda: ${formatRupiah(sisa)}\n\nSalam,\nPrangArt Studios`,
            attachments: [
                { filename: `Kuitansi-${data.nama}.pdf`, path: pdfKuitansiPath },
                { filename: `Invoice-${data.nama}.pdf`, path: pdfInvoicePath }
            ]
        });

        // 5. Kirim WhatsApp via WAHA
        let waNumber = data.wa.replace(/\D/g, '');
        if (waNumber.startsWith('0')) waNumber = '62' + waNumber.substring(1);

        // Baca PDF sebagai Base64 agar bisa dikirim via WAHA tanpa perlu hosting publik
        const pdfBase64 = fs.readFileSync(pdfKuitansiPath).toString('base64');

        try {
            await axios.post(`${process.env.WAHA_URL}/api/sendFile`, {
                session: process.env.WAHA_SESSION,
                chatId: `${waNumber}@c.us`,
                file: {
                    mimetype: 'application/pdf',
                    filename: `Kuitansi-${data.nama}.pdf`,
                    data: pdfBase64 // Kirim sebagai base64
                },
                caption: `Halo ${data.nama}, terima kasih telah memesan di PrangArt Studios. Berikut Kuitansi DP Anda untuk karya "${data.judul}". Sisa pelunasan: ${formatRupiah(sisa)}.`
            });
        } catch (waError) {
            console.error("Gagal kirim WA (Cek apakah WAHA menyala):", waError.message);
        }

        // 6. Hapus file sementara agar tidak menumpuk
        fs.unlinkSync(pdfKuitansiPath);
        fs.unlinkSync(pdfInvoicePath);
        if (fileBukti) fs.unlinkSync(fileBukti.path);

        res.status(200).json({ message: 'Sukses' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});