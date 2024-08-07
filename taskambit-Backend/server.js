const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes')
const db = require('./models')
// Create an Express application
const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());

//routes 
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

const PORT = 3002;
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