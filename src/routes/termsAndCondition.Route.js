const express = require('express');
const router = express.Router();
const termsConditionsController = require('../controllers/termsAndConditon.Controller');

/**
 * @swagger
 * /tac/:
 *   post:
 *     summary: Create new Terms & Conditions
 *     tags: [Terms & Conditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - version
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               version:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Terms & Conditions created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', termsConditionsController.createTermsConditions);

/**
 * @swagger
 * /tac/:
 *   get:
 *     summary: Get all Terms & Conditions
 *     tags: [Terms & Conditions]
 *     responses:
 *       200:
 *         description: List of all Terms & Conditions
 */
router.get('/', termsConditionsController.getAllTermsConditions);

/**
 * @swagger
 * /tac/{id}:
 *   get:
 *     summary: Get Terms & Conditions by ID
 *     tags: [Terms & Conditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Terms & Conditions details
 *       404:
 *         description: Terms & Conditions not found
 */
router.get('/:id', termsConditionsController.getTermsConditionsById);

/**
 * @swagger
 * /tac/{id}:
 *   put:
 *     summary: Update Terms & Conditions
 *     tags: [Terms & Conditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               version:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Terms & Conditions updated successfully
 *       404:
 *         description: Terms & Conditions not found
 */
router.put('/:id', termsConditionsController.updateTermsConditions);

/**
 * @swagger
 * /tac/{id}:
 *   delete:
 *     summary: Delete Terms & Conditions
 *     tags: [Terms & Conditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Terms & Conditions deleted successfully
 *       404:
 *         description: Terms & Conditions not found
 */
router.delete('/:id', termsConditionsController.deleteTermsConditions);

module.exports = router;