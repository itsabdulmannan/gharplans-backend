const utmRouter = require('express').Router();
const utmController = require('../controllers/utm.Controller');
const trackTraffic = require('../middleware/trackTraffic');

/**
   * @swagger
   * /utm/create:
   *   post:
   *     summary: Generate a UTM link.
   *     description: Creates a UTM link based on the provided parameters and stores it in the database.
   *     tags:
   *       - UTM Links
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               baseUrl:
   *                 type: string
   *                 description: The base URL of your website or landing page.
   *               source:
   *                 type: string
   *                 description: The specific source of traffic (e.g., facebook, instagram).
   *               medium:
   *                 type: string
   *                 description: The marketing medium (e.g., social, email, influencer).
   *               campaign:
   *                 type: string
   *                 description: The name of the campaign (e.g., holiday_sale).
   *               couponCode:
   *                 type: string
   *                 description: A unique coupon or promotional code (optional).
   *             required:
   *               - baseUrl
   *               - source
   *               - medium
   *               - campaign
   *     responses:
   *       201:
   *         description: UTM link generated successfully.
   *       500:
   *         description: Internal server error.
   */
utmRouter.post('/create', utmController.createUtm);

/**
    * @swagger
    * /utm/:
    *   get:
    *     summary: Retrieve UTM links.
    *     description: Fetch UTM links based on query parameters, with optional pagination. This endpoint also tracks traffic based on the `medium` and `campaign` query parameters.
    *     tags:
    *       - UTM Links
    *     parameters:
    *       - in: query
    *         name: medium
    *         schema:
    *           type: string
    *         description: The marketing medium (e.g., social, email, influencer).
    *         required: true
    *       - in: query
    *         name: campaign
    *         schema:
    *           type: string
    *         description: The name of the campaign (e.g., holiday_sale).
    *         required: true
    *     responses:
    *       200:
    *         description: Successfully retrieved UTM links.
    *       500:
    *         description: Internal server error.
    */

utmRouter.get('/', trackTraffic, utmController.getUtm);
utmRouter.get('/all', utmController.getAllUtm);
utmRouter.patch('/update', utmController.patchUtmStatus);

module.exports = utmRouter;