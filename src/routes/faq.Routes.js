const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.Controller');

/**
 * @swagger
 * /frequently/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/faqs', faqController.createFAQ);

/**
 * @swagger
 * /frequently/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of all FAQs
 */
router.get('/faqs', faqController.getAllFAQs);

/**
 * @swagger
 * /frequently/faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: FAQ details
 *       404:
 *         description: FAQ not found
 */
router.get('/faqs/:id', faqController.getFAQById);

/**
 * @swagger
 * /frequently/faqs/{id}:
 *   put:
 *     summary: Update FAQ
 *     tags: [FAQs]
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
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       404:
 *         description: FAQ not found
 */
router.put('/faqs/:id', faqController.updateFAQ);

/**
 * @swagger
 * /frequently/faqs/{id}:
 *   delete:
 *     summary: Delete FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: FAQ deleted successfully
 *       404:
 *         description: FAQ not found
 */
router.delete('/faqs/:id', faqController.deleteFAQ);

module.exports = router;
