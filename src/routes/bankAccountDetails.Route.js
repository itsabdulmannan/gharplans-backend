const bankAccountDetailsRouter = require('express').Router();
const bankAccountDetailsController = require('../controllers/bankAccountDetails.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: BankAccountDetails
 *   description: CRUD operations for bank account details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BankAccountDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the bank account
 *         bankName:
 *           type: string
 *           description: The name of the bank
 *         accountHolderName:
 *           type: string
 *           description: The name of the account holder
 *         accountNumber:
 *           type: string
 *           description: The account number
 *         iban:
 *           type: string
 *           description: The IBAN of the account
 *         branchCode:
 *           type: string
 *           description: The code of the bank branch
 *         status:
 *           type: boolean
 *           description: The status of the bank account (active/inactive)
 *           default: true
 *       required:
 *         - bankName
 *         - accountHolderName
 *         - accountNumber
 *         - branchCode
 */

/**
 * @swagger
 * /bank/bankAccountDetails:
 *   post:
 *     summary: Add new bank account details
 *     tags: [BankAccountDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               iban:
 *                 type: string
 *               branchCode:
 *                 type: string
 *               status:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Bank account details added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BankAccountDetails'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
bankAccountDetailsRouter.post('/bankAccountDetails', authenticate, authorize('admin'), bankAccountDetailsController.addBankAccountDetails);

/**
 * @swagger
 * /bank/bankAccountDetails:
 *   get:
 *     summary: Get all bank account details
 *     tags: [BankAccountDetails]
 *     responses:
 *       200:
 *         description: List of all bank account details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankAccountDetails'
 *       500:
 *         description: Internal server error
 */
bankAccountDetailsRouter.get('/bankAccountDetails',bankAccountDetailsController.getBankAccountDetails);

/**
 * @swagger
 * /bank/bankAccountDetails/{id}:
 *   get:
 *     summary: Get bank account details by ID
 *     tags: [BankAccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the bank account
 *     responses:
 *       200:
 *         description: The requested bank account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccountDetails'
 *       404:
 *         description: Bank account details not found
 *       500:
 *         description: Internal server error
 */
bankAccountDetailsRouter.get('/bankAccountDetails/:id', authenticate, authorize('admin'), bankAccountDetailsController.getBankAccountDetailsById);

/**
 * @swagger
 * /bank/bankAccountDetails/{id}:
 *   put:
 *     summary: Update bank account details by ID
 *     tags: [BankAccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the bank account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               iban:
 *                 type: string
 *               branchCode:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bank account details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BankAccountDetails'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Bank account details not found
 *       500:
 *         description: Internal server error
 */
bankAccountDetailsRouter.put('/bankAccountDetails/:id', authenticate, authorize('admin'), bankAccountDetailsController.updateBankAccountDetails);

/**
 * @swagger
 * /bank/bankAccountDetails/{id}:
 *   delete:
 *     summary: Delete bank account details by ID
 *     tags: [BankAccountDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the bank account to delete
 *     responses:
 *       200:
 *         description: Bank account details deleted successfully
 *       404:
 *         description: Bank account details not found
 *       500:
 *         description: Internal server error
 */
bankAccountDetailsRouter.delete('/bankAccountDetails/:id', authenticate, authorize('admin'), bankAccountDetailsController.deleteBankAccountDetails);

module.exports = bankAccountDetailsRouter;
