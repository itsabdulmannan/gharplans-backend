const productDeliveryChargesRoute = require('express').Router();
const productDeliveryChargesController = require('../controllers/productDeliveryCharges.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: ProductDeliveryCharges
 *     description: API for managing product delivery charges
 */

/**
 * @swagger
 * /delivery-charges/product:
 *   get:
 *     summary: Get all product delivery charges or a specific one by ID
 *     tags: [ProductDeliveryCharges]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the product delivery charge (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: The number of records to skip (default is 0)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: The number of records to retrieve (default is 10)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of product delivery charges or a specific one
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: boolean
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           charge:
 *                             type: number
 *                             format: float
 *                           productId:
 *                             type: integer
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalRecords:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     charge:
 *                       type: number
 *                       format: float
 *                     productId:
 *                       type: integer
 *       404:
 *         description: Product delivery charge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

productDeliveryChargesRoute.get('/product', authenticate, productDeliveryChargesController.getProductDeliveryCharges);
/**
 * @swagger
 * /delivery-charges/product:
 *   post:
 *     summary: Add new product delivery charges
 *     tags: [ProductDeliveryCharges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product
 *                 example: 1
 *               sourcerCityId:
 *                 type: integer
 *                 description: The ID of the sourcer city
 *                 example: 101
 *               destinationCityId:
 *                 type: integer
 *                 description: The ID of the destination city
 *                 example: 102
 *               deliveryCharge:
 *                 type: number
 *                 format: decimal
 *                 description: The delivery charge for the product
 *                 example: 50.75
 *     responses:
 *       201:
 *         description: Product delivery charge added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created delivery charge record
 *                   example: 1
 *                 productId:
 *                   type: integer
 *                   description: The ID of the product
 *                   example: 1
 *                 sourcerCityId:
 *                   type: integer
 *                   description: The ID of the sourcer city
 *                   example: 101
 *                 destinationCityId:
 *                   type: integer
 *                   description: The ID of the destination city
 *                   example: 102
 *                 deliveryCharge:
 *                   type: number
 *                   format: decimal
 *                   description: The delivery charge for the product
 *                   example: 50.75
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

productDeliveryChargesRoute.post('/product', authenticate, authorize('admin'), productDeliveryChargesController.addProductDeliveryCharges);

/**
 * @swagger
 * /delivery-charges/product/{id}:
 *   put:
 *     summary: Update a product delivery charge
 *     tags: [ProductDeliveryCharges]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product delivery charge
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               charge:
 *                 type: number
 *                 format: float
 *               productId:
 *                 type: integer
 *               sourcerCityId:
 *                 type: integer
 *               destinationCityId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product delivery charge updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product delivery charge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

productDeliveryChargesRoute.put('/product/:id', authenticate, authorize('admin'), productDeliveryChargesController.updateProductDeliveryCharges);
/**
 * @swagger
 * /delivery-charges/product/{id}:
 *   delete:
 *     summary: Delete a product delivery charge
 *     tags: [ProductDeliveryCharges]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product delivery charge
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product delivery charge deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product delivery charge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Error occurred while deleting product delivery charge
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
productDeliveryChargesRoute.delete('/product/:id', authenticate, authorize('admin'), productDeliveryChargesController.deleteProductDeliveryCharges);

module.exports = productDeliveryChargesRoute;