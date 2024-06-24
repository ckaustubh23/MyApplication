const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
