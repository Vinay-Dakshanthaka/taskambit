const express = require('express');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')

const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const initializeDatabase = require('./models');

require('./controller/passportSetup')

const app = express();

app.use(session({
    secret: 'myverysecureandlongrandomsecretkey123', // Use your generated secret key here
    resave: false,
    saveUninitialized: true
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

const PORT = 3002;

(async () => {
    try {
        const db = await initializeDatabase();
        await db.sequelize.sync({ force: false });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();
