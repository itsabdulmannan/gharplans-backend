const userRouter = require('express').Router();
const userController = require('../controllers/user.Controller');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/multer');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management API
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user into the system with first name, last name, email, password, contact number, address, city, date of birth, and profile image.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *               contactNo:
 *                 type: string
 *                 example: '+1234567890'
 *               address:
 *                 type: string
 *                 example: 123 Street Name
 *               city:
 *                 type: string
 *                 example: City Name
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               profileImage:
 *                 type: string
 *                 example: "profile-pic.jpg"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 contactNo:
 *                   type: string
 *                   example: '+1234567890'
 *                 address:
 *                   type: string
 *                   example: 123 Street Name
 *                 city:
 *                   type: string
 *                   example: City Name
 *                 dob:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 profileImage:
 *                   type: string
 *                   example: "profile-pic.jpg"
 *       400:
 *         description: Bad Request, invalid input or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error or missing fields"
 */

userRouter.post('/register', upload.single('profileImage'), userController.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: This endpoint authenticates a user and provides a token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gharplans.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */
userRouter.post('/login', userController.loginUser);

/**
 * @swagger
 * /user/verify-otp:
 *   post:
 *     summary: Verify OTP sent for email verification
 *     description: This endpoint verifies the OTP provided by the user to confirm their email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: Email verified successfully, returns the user and token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully."
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Invalid OTP
 *       404:
 *         description: User not found
 */
userRouter.post('/verify-otp', userController.verifyOTP);

/**
 * @swagger
 * /user/send-reset-password-otp:
 *   post:
 *     summary: Send OTP for password reset
 *     description: Sends a new OTP to the user's email to initiate password reset.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "New OTP sent to email."
 *       404:
 *         description: User not found
 */
userRouter.post('/send-reset-password-otp', userController.sendResetPasswordOtp);

/**
 * @swagger
 * /user/verify-reset-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Verifies the OTP for password reset and provides a reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       200:
 *         description: OTP verified successfully for password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP verified for reset."
 *                 resetToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR...
 *       400:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found
 */
userRouter.post('/verify-reset-otp', userController.verifyResetOtp);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Allows the user to reset their password using a valid reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password reset successful."
 *       401:
 *         description: Invalid or expired token
 */
userRouter.post('/reset-password', authenticate, userController.resetPassword);

/**
 * @swagger
 * /user/update-password:
 *   post:
 *     summary: Update user password
 *     description: Allows the user to update their password with the current password and new password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldsecurepassword123
 *               newPassword:
 *                 type: string
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       401:
 *         description: Invalid current password
 *       500:
 *         description: Internal server error
 */
userRouter.post('/update-password', userController.updatePassword);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve the logged-in user's details
 *     description: Get the details of the currently logged-in user using the user ID from the token.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 getUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
userRouter.get('/', authenticate, userController.getUser);

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users with optional filters
 *     description: Fetch all users with optional filtering by name (firstName, lastName, or username) and status.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name to filter users by (supports partial match for firstName, lastName, or username).
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         description: The status of the user to filter by (true or false).
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of users with total reviews and orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: john_doe
 *                       firstName:
 *                         type: string
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         example: Doe
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       totalReviews:
 *                         type: integer
 *                         example: 10
 *                       totalOrders:
 *                         type: integer
 *                         example: 5
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

userRouter.get('/all', userController.getAllUsers);

userRouter.patch('/update', userController.patchUserStatus);
userRouter.get('/statistics', userController.getDashboardStats);

module.exports = userRouter;
