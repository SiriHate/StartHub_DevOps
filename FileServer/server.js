const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.params.type;
        let uploadPath = 'uploads';

        if (type === 'projectLogos') {
            uploadPath = 'uploads/projectLogos';
        } else if (type === 'newsLogos') {
            uploadPath = 'uploads/newsLogos';
        } else if (type === 'articleLogos') {
            uploadPath = 'uploads/articleLogos';
        } else if (type === 'memberAvatars') {
            uploadPath = 'uploads/memberAvatars';
        }


        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .png, .gif format allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/upload/:type', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({
            success: true,
            message: 'File uploaded successfully!',
            url: `/${req.file.path}`
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'File upload failed!'
        });
    }
});


app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});