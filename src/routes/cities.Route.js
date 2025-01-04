const citiesRouter = require('express').Router();
const citiesController = require('../controllers/cities.Controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Cities
 *     description: API for managing cities
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities with pagination
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of records to skip.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records to retrieve.
 *     responses:
 *       200:
 *         description: A paginated list of cities
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
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

citiesRouter.get('/', authenticate, authorize('admin', 'User'), citiesController.getCities);
/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Add a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the city
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: City added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 newCity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
citiesRouter.post('/', authenticate, authorize('admin'), citiesController.addCity);
/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update an existing city
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The city ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 updatedCity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
citiesRouter.put('/:id', authenticate, authorize('admin'), citiesController.updateCity);
/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The city ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 deletedCity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
citiesRouter.delete('/:id', authenticate, authorize('admin'), citiesController.deleteCity);

module.exports = citiesRouter;