const favouriteRouter = require('express').Router();
const favouritesProductsController = require('../controllers/favourites.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     FavouriteProduct:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user
 *         ProductId:
 *           type: string
 *           description: ID of the product
 *   responses:
 *     ProductNotFound:
 *       description: Product not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Product not found"
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "User not found"
 */

/**
 * @swagger
 * /favourites/add:
 *   post:
 *     summary: Add a product to user's favourites
 *     tags:
 *       - Favourites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *                 example: "12345"
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *                 example: "67890"
 *     responses:
 *       201:
 *         description: Product added to favourites
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
 *                   example: "Product added to favourites"
 *                 favProduct:
 *                   $ref: '#/components/schemas/FavouriteProduct'
 *       404:
 *         $ref: '#/components/responses/ProductNotFound'
 *       500:
 *         description: Internal server error
 */
favouriteRouter.post('/add', authenticate, authorize('User'), favouritesProductsController.addToFavourite);
/**
 * @swagger
 * /favourites/remove:
 *   delete:
 *     summary: Remove a product from user's favourites
 *     tags:
 *       - Favourites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *                 example: "12345"
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *                 example: "67890"
 *     responses:
 *       200:
 *         description: Product removed from favourites
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
 *                   example: "Product removed from favourites"
 *       404:
 *         description: Product not found in favourites
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
 *                   example: "Product not found in favourites"
 *       500:
 *         description: Internal server error
 */
favouriteRouter.delete('/remove', authenticate, authorize('User'), favouritesProductsController.removeFromFavourite);
/**
 * @swagger
 * /favourites/{userId}:
 *   get:
 *     summary: Get all favourite products of a user
 *     tags:
 *       - Favourites
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Number of items to skip (for pagination).
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items to return (for pagination).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of favourite products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 favProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FavouriteProduct'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     offset:
 *                       type: integer
 *                       example: 0
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 */

favouriteRouter.get('/', authenticate, authorize('User','admin'), favouritesProductsController.getFavouriteProducts);

module.exports = favouriteRouter;