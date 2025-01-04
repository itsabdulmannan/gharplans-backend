const cartRouter = require('express').Router();
const cartController = require('../controllers/cart.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds a product to the user's cart with specified quantity.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
cartRouter.post('/add', authenticate, authorize('User'), cartController.addItemToCart);

/**
 * @swagger
 * /cart/items:
 *   get:
 *     summary: Get all cart items
 *     description: Retrieves all items in the cart for the specified user.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error
 */
cartRouter.get('/items', authenticate, authorize('User'), cartController.getCartItem);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update a cart item
 *     description: Updates the quantity of a product in the user's cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *               quantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Product or item not found
 *       500:
 *         description: Internal Server Error
 */
cartRouter.put('/update', authenticate, authorize('User'), cartController.updateCart);

/**
 * @swagger
 * /cart/delete:
 *   delete:
 *     summary: Remove a cart item
 *     description: Removes a product from the user's cart.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               productId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal Server Error
 */
cartRouter.delete('/delete', authenticate, authorize('User'), cartController.deleteCartItem);

module.exports = cartRouter;