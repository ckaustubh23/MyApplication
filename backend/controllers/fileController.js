const multer = require('multer');
const db = require('../config/db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadFile = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).send("Error uploading file.");
        }

        const filepath = req.file.path;
        const filename = req.file.filename;

        const query = 'INSERT INTO files (filename, filepath) VALUES (?, ?)';
        db.query(query, [filename, filepath], (err, result) => {
            if (err) return res.status(500).send("Error saving file info to database.");
            res.status(200).send("File is uploaded and information is saved successfully.");
        });
    });
};

exports.getFiles = (req, res) => {
    const query = 'SELECT * FROM files ORDER BY upload_date DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send("Error fetching files.");
        res.status(200).json(results);
    });
};
