const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../controllers/privacyAndPolicy.Controller');

/**
 * @swagger
 * /pap/privacy-policy:
 *   post:
 *     summary: Create a new Privacy Policy
 *     tags: [Privacy Policy]
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
 *         description: Privacy Policy created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/privacy-policy', privacyPolicyController.createPrivacyPolicy);

/**
 * @swagger
 * /pap/privacy-policy:
 *   get:
 *     summary: Get all Privacy Policies
 *     tags: [Privacy Policy]
 *     responses:
 *       200:
 *         description: List of all Privacy Policies
 */
router.get('/privacy-policy', privacyPolicyController.getAllPrivacyPolicies);

/**
 * @swagger
 * /pap/privacy-policy/{id}:
 *   get:
 *     summary: Get Privacy Policy by ID
 *     tags: [Privacy Policy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Privacy Policy details
 *       404:
 *         description: Privacy Policy not found
 */
router.get('/privacy-policy/:id', privacyPolicyController.getPrivacyPolicyById);

/**
 * @swagger
 * /pap/privacy-policy/{id}:
 *   put:
 *     summary: Update Privacy Policy
 *     tags: [Privacy Policy]
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
 *         description: Privacy Policy updated successfully
 *       404:
 *         description: Privacy Policy not found
 */
router.put('/privacy-policy/:id', privacyPolicyController.updatePrivacyPolicy);

/**
 * @swagger
 * /pap/privacy-policy/{id}:
 *   delete:
 *     summary: Delete Privacy Policy
 *     tags: [Privacy Policy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Privacy Policy deleted successfully
 *       404:
 *         description: Privacy Policy not found
 */
router.delete('/privacy-policy/:id', privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
