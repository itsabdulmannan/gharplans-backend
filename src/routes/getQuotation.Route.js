const quotationRouter = require('express').Router();
const quotationController = require('../controllers/getQuotation.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /quotation:
 *   post:
 *     summary: Generate a quotation for multiple products.
 *     description: Returns a PDF with the quotation details based on the products and quantities provided.
 *     tags:
 *       - Quotation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID of the product.
 *                       example: 4
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product.
 *                       example: 10
 *                     color:
 *                       type: string
 *                       description: Color of the product.
 *                       example: "Black"
 *                     weight:
 *                       type: string
 *                       description: Weight of the product.
 *                       example: "0.5"
 *     responses:
 *       200:
 *         description: Quotation generated successfully.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request - missing required fields such as product details (productId, quantity, color, and weight).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product details are required"
 *       404:
 *         description: Product not found with the provided productId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID 4 not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

quotationRouter.post('/', authenticate, authorize('admin'), quotationController.getQuotation);

module.exports = quotationRouter;
