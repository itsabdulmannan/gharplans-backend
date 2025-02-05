const orderRouter = require('express').Router();
const orderController = require('../controllers/order.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Add a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user placing the order
 *               productInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productName:
 *                       type: string
 *                       description: Name of the product
 *                     category:
 *                       type: string
 *                       description: Category of the product
 *                     singleProductprice:
 *                       type: string
 *                       description: Price of a single product
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
 *                     itemTotal:
 *                       type: string
 *                       description: Total price for the quantity of the product
 *                     deliveryCharges:
 *                       type: string
 *                       description: Delivery charges for this product
 *               totalAmount:
 *                 type: string
 *                 description: Total amount of the order, including products and delivery charges
 *               paymentType:
 *                 type: string
 *                 description: Type of payment (e.g., "Credit Card", "Cash")
 *               sourceCity:
 *                 type: string
 *                 description: The city from which the entire order is being shipped
 *               destinationCity:
 *                 type: string
 *                 description: The city where the entire order is being delivered
 *     responses:
 *       201:
 *         description: Order added successfully
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
 *       500:
 *         description: Internal server error
 */

orderRouter.post('/', authenticate, authorize('User'), orderController.addOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders by ID, status, user name, user ID, or all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique ID of the order (optional, to fetch a specific order)
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Status of the order (optional, to filter by status)
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: Name of the user (optional, to filter by user name)
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: Unique ID of the user (optional, to filter orders by user)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders to return per page (default is 10)
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of orders to skip before starting to collect the result (default is 0)
 *     responses:
 *       200:
 *         description: Order data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 ordersData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
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

orderRouter.get('/', orderController.getOrders);

/**
 * @swagger
 * /orders/{orderId}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the order
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
orderRouter.delete('/:orderId', authenticate, authorize('User'), orderController.cancelOrder);

/**
 * @swagger
 * /orders/{orderId}/upload-screenshot:
 *   post:
 *     summary: Upload a screenshot for payment verification
 *     description: Allows the user to upload a screenshot of the payment for the specified order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               screenshot:
 *                 type: string
 *                 description: URL or path to the uploaded screenshot.
 *                 example: "https://example.com/screenshots/payment123.jpg"
 *     responses:
 *       200:
 *         description: Screenshot uploaded successfully
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
 *                   example: "Screenshot uploaded successfully."
 *       404:
 *         description: Order not found
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
 *                   example: "Order not found."
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
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

orderRouter.post('/:orderId/upload-screenshot', authenticate, authorize('User'), orderController.uploadScreenShot);

/**
 * @swagger
 * /orders/{orderId}/verify-payment:
 *   put:
 *     summary: Verify the payment and update the order status
 *     description: Verifies the payment status for the specified order and updates its status accordingly.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 description: The payment status of the order.
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Payment status updated successfully
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
 *                   example: "Payment status updated successfully."
 *       404:
 *         description: Order not found
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
 *                   example: "Order not found."
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
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

orderRouter.put('/:orderId/verify-payment', authenticate, authorize('admin'), orderController.verifyPayment);

/**
 * @swagger
 * /orders/payment-screenshots:
 *   get:
 *     summary: Retrieve payment screenshots by status
 *     description: Fetch payment screenshots based on their status (pending, approved, or rejected). Requires admin authorization.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pending
 *         schema:
 *           type: boolean
 *         description: Retrieve pending payment screenshots (true for enabling the filter).
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *         description: Retrieve approved payment screenshots (true for enabling the filter).
 *       - in: query
 *         name: rejected
 *         schema:
 *           type: boolean
 *         description: Retrieve rejected payment screenshots (true for enabling the filter).
 *     responses:
 *       200:
 *         description: Successfully retrieved payment screenshots.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 pendingPaymentScreenshots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       paymentStatus:
 *                         type: string
 *                         example: pending
 *                       screenshotUrl:
 *                         type: string
 *                         example: "https://example.com/screenshot1.png"
 *                 approvedPaymentScreenshots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       paymentStatus:
 *                         type: string
 *                         example: approved
 *                       screenshotUrl:
 *                         type: string
 *                         example: "https://example.com/screenshot2.png"
 *                 rejectedPaymentScreenshots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       paymentStatus:
 *                         type: string
 *                         example: rejected
 *                       screenshotUrl:
 *                         type: string
 *                         example: "https://example.com/screenshot3.png"
 *       400:
 *         description: No valid status filter provided in the query.
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
 *                   example: "No valid status filter provided in the query."
 *       401:
 *         description: Unauthorized - Authentication required.
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
 *                   example: "Unauthorized."
 *       403:
 *         description: Forbidden - Admin access required.
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
 *                   example: "Access denied."
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
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

orderRouter.get('/payment-screenshots', authenticate, authorize('admin'), orderController.getAllPaymentScreenshots);

module.exports = orderRouter;