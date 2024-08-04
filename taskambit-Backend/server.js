const express = require('express');
const cors = require('cors');
const db = require('./models');
const bodyParser = require('body-parser');


// Create an Express application
const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Start the server
db.sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error synchronizing database:', error);
    });