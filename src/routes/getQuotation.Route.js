const quotationRouter = require('express').Router();
const quotationController = require('../controllers/getQuotation.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /quotation:
 *   post:
 *     summary: Generate a quotation for multiple products.
 *     description: Returns a PDF with the quotation details based on the products, billTo, billFrom, and quotation information.
 *     tags:
 *       - Quotation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quotation:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     invoiceNo:
 *                       type: string
 *                       description: Invoice number for the quotation.
 *                       example: "INV-12345"
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: Date of the quotation.
 *                       example: "2024-02-01"
 *               billFrom:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     billFromAddress:
 *                       type: string
 *                       description: Address of the sender.
 *                       example: "123 Main St, City, Country"
 *                     billFromPhone:
 *                       type: string
 *                       description: Phone number of the sender.
 *                       example: "+1234567890"
 *                     billFromEmail:
 *                       type: string
 *                       description: Email of the sender.
 *                       example: "sender@example.com"
 *               billTo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     billToName:
 *                       type: string
 *                       description: Name of the recipient.
 *                       example: "John Doe"
 *                     BillToPhone:
 *                       type: string
 *                       description: Phone number of the recipient.
 *                       example: "+0987654321"
 *                     BillToAddress:
 *                       type: string
 *                       description: Address of the recipient.
 *                       example: "456 Another St, City, Country"
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
 *         description: Bad request - missing required fields such as quotation details, billFrom, billTo, or product information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invoice number and date are required"
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

quotationRouter.post('/', quotationController.getQuotation);

module.exports = quotationRouter;
