// Authntication Controller
// this is used to define authentication related funtions like sign in, signup etc....

const { where } = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const db = require('../models');
const nodemailer = require('nodemailer');
const { baseURL } = require('../config/baseUrlConfig');
const jwtSecret = process.env.JWT_SECRET;
const User = db.User;
const saltRounds = 10;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signup = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        if (!(emailRegex.test(email))) {
            return res.status(404).send({ message: 'Invalid email..' });
        }

        const existingUser = await User.findOne({ where: { email } });
        const existingUserPhone = await User.findOne({ where: { phoneNumber } })

        if (existingUserPhone) {
            return res.status(400).send({ message: "Phone Number already been taken" })
        }

        if (existingUser) {
            if (existingUser.isActive) {
                return res.status(400).send({ message: "Email has already been taken" })
            } else {
                //Reactivating the Existing Account 
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                await existingUser.update({
                    name,
                    phoneNumber,
                    password: hashedPassword,
                    role: 'USER',
                    isActive: true
                });
                return res.status(200).send({ message: "Sign-up Success" })
            }
        }

        // Generate user_id (e.g., "USR080100001")
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
        const year = currentDate.getFullYear().toString().slice(-2); // Getting last two digits of the year

        const lastUser = await User.findOne({
            order: [['user_id', 'DESC']]
        });

        let lastIdNumber = 0;
        if (lastUser && lastUser.user_id) {
            const lastId = lastUser.user_id;
            lastIdNumber = parseInt(lastId.replace(`USR${month}${year}`, ''), 10);
        }

        const newIdNumber = lastIdNumber + 1;
        const newCustomUserId = `USR${month}${year}${newIdNumber.toString().padStart(5, '0')}`;

        console.log('User Id generated ', newCustomUserId);

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            user_id: newCustomUserId,
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role: 'USER',
            isActive: true
        });

        return res.status(200).send({ message: "Sign-up Success", newUser });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Signup Failed", error })
    }
}

const signinByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !user.isActive) {
            return res.status(404).send({ message: "Invalid Email or Password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ user_id: user.user_id }, jwtSecret);
            const role = user.role;

            return res.status(200).send({ message: "Sign in Success", token, role });
        } else {
            return res.status(401).send({ message: "Invalid email or Password" });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Failed to Sign in ", error })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { newPassword, oldPassword } = req.body;

        const user_id = req.user_id;
        console.log('user id ', user_id)
        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        }

        const existingPassword = user.password;
        const passwordMatch = await bcrypt.compare(oldPassword, existingPassword);

        if (!passwordMatch) {
            return res.status(400).send({ message: "Password do no match" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await User.update({ password: hashedPassword }, { where: { user_id } })

        return res.status(200).send({ message: "Password Updated Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Failed to Update password" })
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'vinayhari789@gmail.com',
        pass: '' // generate a pass key and keep it here from your gmail id
    }
})

const resetPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).send({ message: "Invalid Email" })
        }

        const token = await jwt.sign({ user_id: user.user_id }, jwtSecret, { expiresIn: '30m' })

        const mailOptions = {
            from: 'vinayhari789@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        background-color: #007bff;
                        color: #ffffff;
                    }
                    .content {
                        padding: 20px;
                    }
                    .button {
                        display: block;
                        width: 200px;
                        margin: 20px auto;
                        padding: 10px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        background-color: #f4f4f4;
                        color: #888888;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Dear User,</p>
                        <p>We received a request to reset your password. Click the button below to reset your password:</p>
                        <a href="${baseURL}/reset-password?token=${token}" class="button">Reset Password</a>
                        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                        <p>Thank you,</p>
                        <p>Your Company Name</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
        };

        console.log(`${baseURL}/reset-password?token=${token}`);

        await transporter.sendMail(mailOptions);

        return res.status(200).send({ message: "Password send to your registered mail id Please check your inbox" })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "An error occurred while sending the mail please Try again" })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        const token = req.query.token;

        if (!token) {
            return res.status(400).send({ message: "Link Expired" })
        }

        // verify the token 
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                console.log(err);
                console.log("Invalid or expired token ")
                return res.status(403).send({ message: "Link Expired" });
            }

            if (!decoded || !decoded.user_id) {
                console.error('Decoded token is invalid or missing student_id');
                return res.status(403).send({ message: "Link Expired" });
            }

            const user_id = decoded.user_id;
            req.user_id = user_id;

            try {
                const user = await User.findOne({ where: { user_id } });

                if (!user) {
                    return res.status(404).send({ message: "User Not found " })
                }

                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                await User.update({ password: hashedPassword }, { where: { user_id } })

                return res.status(200).send({ message: "New Password updated successfully." })

            } catch (error) {
                console.log(error)
                return res.status(500).send({ message: "Error updating the password please try again" });

            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Error updating the password please try again" });

    }
}

module.exports = {
    signup,
    signinByEmail,
    updatePassword,
    resetPasswordEmail,
    resetPassword
}