const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Tesseract } = require('tesseract.js'); // For OCR
const app = express();

app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost/video-streaming', { useNewUrlParser: true, useUnifiedTopology: true });

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'your_cloud_name',
    api_key: 'your_api_key',
    api_secret: 'your_api_secret'
});

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Video Schema
const VideoSchema = new mongoose.Schema({
    title: String,
    category: String,
    url: String,
    isPremium: Boolean
});

const Video = mongoose.model('Video', VideoSchema);

// Bank Details Schema
const BankDetailsSchema = new mongoose.Schema({
    bankName: String,
    branch: String,
    accountNo: String
});

const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);

// Routes
app.post('/upload-video', upload.single('video'), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'video' });
    const video = new Video({
        title: req.body.title,
        category: req.body.category,
        url: result.secure_url,
        isPremium: req.body.isPremium
    });
    await video.save();
    res.json({ message: 'Video uploaded successfully' });
});

app.post('/bank-slip', upload.single('slip'), async (req, res) => {
    const bankDetails = await BankDetails.findOne();
    const slipText = await Tesseract.recognize(req.file.path, 'eng');
    // OCR logic to match bank details
    if (slipText.data.text.includes(bankDetails.accountNo)) {
        // Activate premium
        res.json({ message: 'Payment verified, premium activated' });
    } else {
        res.status(400).json({ message: 'Invalid slip' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
