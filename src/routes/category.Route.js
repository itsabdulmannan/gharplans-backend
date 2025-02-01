const categoryController = require('../controllers/category.Controller');
const categoryRoute = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Add a new category
 *     description: Adds a new category to the system.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Agricultural"
 *               description:
 *                 type: string
 *                 description: A short description of the category.
 *                 example: "Products for farming and agriculture"
 *               image:
 *                 type: string
 *                 description: URL to the category image.
 *                 example: "https://example.com/pesticide-category.jpg"
 *               status:
 *                 type: boolean
 *                 description: The status of the category (e.g., true for active, false for inactive).
 *                 example: true
 *     responses:
 *       201:
 *         description: Category added successfully
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
 *                   example: "Category added successfully."
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Agricultural"
 *                     description:
 *                       type: string
 *                       example: "Products for farming and agriculture"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/pesticide-category.jpg"
 *                     status:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

categoryRoute.post('/', authenticate, authorize('admin'), upload.single('image'), categoryController.addCategory);
/**
 * @swagger
 * /category:
 *   get:
 *     summary: Retrieve categories by ID, name, or product name with pagination support
 *     description: Fetch a category by its unique ID, search categories by name or associated product name, or fetch all categories with pagination if no filters are provided.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The ID of the category to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: categoryName
 *         required: false
 *         description: The name or partial name of the category to search for.
 *         schema:
 *           type: string
 *       - in: query
 *         name: productName
 *         required: false
 *         description: The name or partial name of a product associated with the category to search for.
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         required: false
 *         description: The number of records to skip for pagination (default is 0).
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of records to return for pagination (default is 10).
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A single category's details, a list of matching categories, or all categories with pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Agricultural"
 *                       description:
 *                         type: string
 *                         example: "Products for farming and agriculture"
 *                       image:
 *                         type: string
 *                         example: "http://localhost:3000/images/pesticide-category.png"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-22T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-22T10:00:00.000Z"
 *                       Products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Pesticide"
 *                             price:
 *                               type: number
 *                               example: 25.99
 *                             description:
 *                               type: string
 *                               example: "Eco-friendly pesticide for crops"
 *                             image:
 *                               type: string
 *                               example: "http://localhost:3000/images/pesticide-product.png"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

categoryRoute.get('/', categoryController.getCategoryByIdAndName);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Update an existing category
 *     description: Updates a category's details by its ID.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to be updated.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: A short description of the category.
 *                 example: "Gadgets and devices"
 *               image:
 *                 type: string
 *                 description: URL to the category image.
 *                 example: "/images/1732819064781-Screenshot 2024-05-18 142049.png"
 *               status:
 *                 type: string
 *                 description: The status of the category (e.g., active, inactive).
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Category updated successfully.
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
 *                   example: "Category updated successfully."
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
categoryRoute.put('/:id', upload.single('image'), authenticate, authorize('admin'), categoryController.updateCategory);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     description: Deletes a category from the database by its unique ID.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Category deleted successfully.
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
 *                   example: "Category deleted successfully."
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
categoryRoute.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

/**
 * @swagger
 * /category/status:
 *   patch:
 *     summary: Update the status of a category
 *     description: Update the status (active/inactive) of a category by its ID.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the category to be updated
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the category ("active" or "inactive")
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Successfully updated the category status
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
 *                   example: "Category status updated successfully."
 *       400:
 *         description: Invalid input, missing or incorrect parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
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
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
categoryRoute.patch('/status', categoryController.patchCaregoryStatus);

module.exports = categoryRoute;