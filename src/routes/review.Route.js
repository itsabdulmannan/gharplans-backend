const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/review.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing product reviews.
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review.
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user adding the review.
 *               productId:
 *                 type: integer
 *                 description: ID of the product being reviewed.
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Rating for the product (e.g., 4.5).
 *               review:
 *                 type: string
 *                 description: Review text for the product.
 *             required:
 *               - userId
 *               - productId
 *               - rating
 *               - review
 *     responses:
 *       201:
 *         description: Review added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 addedReview:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */
reviewRouter.post('/', authenticate, authorize('User'), reviewController.addReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews or filter by userId, id, or productId with pagination support.
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter reviews by user ID.
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter reviews by review ID.
 *       - in: query
 *         name: productId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter reviews by product ID.
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of records to skip for pagination (default is 0).
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records to return for pagination (default is 10).
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: 
 *             - pending
 *             - approved
 *             - rejected
 *         description: |
 *           Filter reviews by status. Can be one of the following:
 *           'pending', 'approved', or 'rejected'.
 *     responses:
 *       200:
 *         description: Reviews fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Response message.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       rating:
 *                         type: number
 *                         format: float
 *                       review:
 *                         type: string
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       productId:
 *                         type: integer
 *                         description: The ID of the associated product.
 *                       user:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           category:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

reviewRouter.get('/', authenticate, authorize('admin', 'User'), reviewController.getReviews);

/**
 * @swagger
 * /reviews:
 *   put:
 *     summary: Update the status of a review.
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: integer
 *                 description: ID of the review to update.
 *               userId:
 *                 type: integer
 *                 description: ID of the user making the update.
 *               status:
 *                 type: string
 *                 description: New status of the review.
 *                 enum: 
 *                   - pending
 *                   - approved
 *                   - rejected
 *             required:
 *               - reviewId
 *               - userId
 *               - status
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedReview:
 *                   type: object
 *       500:
 *         description: Internal server error.
 */

reviewRouter.put('/', authenticate, authorize('admin'), reviewController.updateReview);

module.exports = reviewRouter;