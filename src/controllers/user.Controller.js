const User = require('../models/user.Model');
const bcrypt = require('bcrypt');
const { sendMail, transporter } = require('../config/mailer');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const reviews = require('../models/review.Model');
const Order = require('../models/order.Model');
const Products = require('../models/product.Model');

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const userController = {

    registerUser: async (req, res) => {
        const { firstName, lastName, email, password, contactNo, address, city, dob } = req.body;
    
        const imageUrl = `/image/${req.file.filename}`
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (!contactNo || contactNo.length < 7 || contactNo.length > 15) {
            return res.status(400).json({ message: 'Invalid contact number format. It should be 7 to 15 digits long.' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required.' });
        }

        const transaction = await sequelize.transaction();

        try {
            const userExists = await User.findOne({ where: { email }, transaction });
            if (userExists) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                firstName,
                lastName,
                dateOfBirth: dob,
                email,
                password: hashedPassword,
                role: 'User',
                contactNo,
                address,
                city,
                profileImage: imageUrl,
                status: true,
                isVerified: false
            };

            const createdUser = await User.create(newUser, { transaction });

            const otp = generateOTP();
            await User.update({ otp }, { where: { id: createdUser.id }, transaction });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email',
                text: `Your OTP is: ${otp}`
            };

            await sendMail(mailOptions);

            await transaction.commit();

            res.status(201).json({
                status: true,
                message: 'User registered successfully',
                createdUser: {
                    id: createdUser.id,
                    name: createdUser.name,
                    email: createdUser.email,
                    contactNo: createdUser.contactNo,
                    address: createdUser.address,
                    city: createdUser.city,
                    profileImage: createdUser.profileImage,
                    role: createdUser.role
                },
                otp
            });
        } catch (error) {
            console.error('Error registering user:', error);
            await transaction.rollback();
            res.status(500).json({ status: false, error: 'Internal Server Error', error: error.message });
        }
    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            if (!user.isVerified) {
                return res.status(403).json({ error: 'User is not verified. Please verify your account before logging in.' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    verifyOTP: async (req, res) => {
        const { email, otp } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.otp === otp) {
                await User.update({ isVerified: true, otp: null }, { where: { email } });

                const user = await User.findOne({ where: { email } });

                const token = jwt.sign({ email, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

                res.header(process.env.JWT_TOKEN_HEADER, token);

                return res.status(200).json({
                    status: true,
                    message: "Email verified successfully.",
                    token,
                    user
                });
            } else {
                return res.status(400).json({ error: "Invalid OTP" });
            }
        } catch (error) {
            console.error("Error during OTP verification", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    sendResetPasswordOtp: async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const otp = generateOTP();
            const otpExpires = Date.now() + 20 * 60 * 1000; // 20 minutes from now

            await User.update({ otp, otpExpires }, { where: { email } });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}`
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ status: true, message: "New OTP sent to email." });
        } catch (error) {
            console.error("Error sending OTP for password reset", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    verifyResetOtp: async (req, res) => {
        const { email, otp } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.otp === otp) {
                const resetToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
                return res.status(200).json({ status: true, message: "OTP verified for reset.", resetToken });
            } else {
                return res.status(400).json({ error: "Invalid or expired OTP" });
            }
        } catch (error) {
            console.error("Error during OTP verification for reset", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    resetPassword: async (req, res) => {
        console.log("first")
        const token = req.header('Authorization').replace('Bearer ', '');
        try {
            const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ where: { email: userData.email } });
            console.log(token, "dd")
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            console.log(req.body, "dd")
            const { newPassword } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            await User.update({ password: hash }, { where: { id: user.id } });
            return res.status(200).json({ status: true, message: "Password reset successful." });
        } catch (error) {
            console.error("Error while resetting password", error);
            return res.status(401).json({ status: false, error: "Invalid or expired token" });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ where: { email: decoded.email } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const { currentPassword, newPassword } = req.body;
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(401).json({ error: "Invalid current password" });
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            await User.update({ password: hash }, { where: { email: user.email } });
            return res.status(200).json({ status: true, message: "Password updated successfully" });
        } catch (error) {
            console.error("Error while updating password", error);
            return res.status(500).json({ status: false, error: "Invalid or expired token" });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = req.user;
            const userId = user.id;
            const getUser = await User.findByPk(userId);
            if (getUser) {
                return res.status(200).json({ status: true, getUser });
            }
            return res.status(404).json({ status: false, message: "User not found" });
        } catch (error) {
            console.error("Error while getting user", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const { name, status } = req.query;
            console.log(name, status);

            const whereCondition = {};

            if (name) {
                whereCondition[Op.or] = [
                    { firstName: { [Op.iLike]: `%${name}%` } },
                    { lastName: { [Op.iLike]: `%${name}%` } }
                ];
            }

            if (status) {
                whereCondition.status = status;
            }

            const users = await User.findAll({
                where: whereCondition,
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(*) FROM "review" WHERE "review"."userId" = "user"."id"
                            )`),
                            'totalReviews'
                        ],
                        [
                            sequelize.literal(`(
                                SELECT COUNT(*) FROM "order" WHERE "order"."userId" = "user"."id"
                            )`),
                            'totalOrders'
                        ]
                    ]
                }
            });

            return res.status(200).json({
                status: true,
                data: users
            })
        } catch (error) {
            console.error("Error while getting all users", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    patchUserStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            await User.update({ status }, { where: { id } });
            return res.status(200).json({ status: true, message: "User status updated successfully." });
        } catch (error) {
            console.error("Error while updating user status", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    getDashboardStats: async (req, res) => {
        try {
            const userCount = await User.count();
            const orderCount = await Order.count();
            const productCount = await Products.count();
            return res.status(200).json({
                status: true,
                data: {
                    userCount,
                    orderCount,
                    productCount
                }
            })
        } catch (error) {
            console.error("Error while getting dashboard stats", error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    }
};

module.exports = userController;