const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const handleImage = require('../controllers/image.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /image/upload-image:
 *   post:
 *     summary: Upload an image
 *     description: This endpoint allows the user to upload an image and get the URL of the uploaded image.
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 imageUrl:
 *                   type: string
 *                   example: http://localhost:3000/images/1681222234-profile.jpg
 *       400:
 *         description: Invalid file type or size
 */
router.post('/upload-image', upload.single('image'), authenticate, authorize('admin'), handleImage.uploadImage);

/**
 * @swagger
 * /image/get-full-image-url:
 *   get:
 *     summary: Generate full image URL
 *     description: This endpoint returns the full URL of an image when provided with the image path.
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The relative path of the image (e.g., /images/filename.jpg)
 *     responses:
 *       200:
 *         description: Full image URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 fullUrl:
 *                   type: string
 *                   example: http://localhost:3000/images/1681222234-profile.jpg
 *       400:
 *         description: Path parameter is missing
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
 *                   example: Path is required
 */
router.get('/get-full-image-url', handleImage.getFullimageUrl);

module.exports = router;
