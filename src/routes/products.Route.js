const productController = require('../controllers/products.Controller');
const prodcustRoute = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve a product or a list of products
 *     description: Fetch all the products available in the store or a specific product by its ID if the 'id' query parameter is provided. Filters by product name, price range, and category ID are also supported. Pagination is available with 'limit' and 'offset' query parameters.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: The ID of the product to retrieve. If not provided, fetches all products.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: name
 *         required: false
 *         description: The name of the product to search for (partial match).
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         required: false
 *         description: The minimum price of the products to retrieve.
 *         schema:
 *           type: number
 *           format: float
 *           example: 100.00
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         description: The maximum price of the products to retrieve.
 *         schema:
 *           type: number
 *           format: float
 *           example: 500.00
 *       - in: query
 *         name: categoryId
 *         required: false
 *         description: The category ID to filter products by.
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: offset
 *         required: false
 *         description: The starting point of the records to retrieve (used for pagination).
 *         schema:
 *           type: integer
 *           example: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of products to retrieve per page (used for pagination).
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A product or a list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       categoryId:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Smartphone"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 699.99
 *                       image:
 *                         type: string
 *                         example: "/images/smartphone.png"
 *                       description:
 *                         type: string
 *                         example: "Latest model with advanced features."
 *                       shortDescription:
 *                         type: string
 *                         example: "Advanced smartphone with amazing features."
 *                       addiotionalInformation:
 *                         type: string
 *                         example: "Includes a free case and screen protector."
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       options:
 *                         type: object
 *                         example: { "color": "black", "memory": "64GB" }
 *                       color:
 *                         type: string
 *                         example: "black"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-28T18:38:56.541Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-28T18:38:56.541Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Product not found.
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
 *                   example: "Product not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */


prodcustRoute.get('/', productController.getProducts);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the store.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: The category ID of the product.
 *                 example: 2
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *                 example: "Shower Set"
 *               description:
 *                 type: string
 *                 description: A description of the product.
 *                 example: "Latest model with advanced features."
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *                 example: 699.99
 *               image:
 *                 type: string
 *                 description: URL of the product image.
 *                 example: "/images/shower.png"
 *               shortDescription:
 *                 type: string
 *                 description: A short description of the product.
 *                 example: "Advanced producst with amazing features."
 *               addiotionalInformation:
 *                 type: string
 *                 description: Additional information about the product.
 *                 example: "Product includes a free soap holder."
 *               status:
 *                 type: boolean
 *                 description: Whether the product is active or not.
 *                 example: true
 *               options:
 *                 type: object
 *                 description: Optional attributes like color, size, etc.
 *                 example: { "color": "black" }
 *               color:
 *                 type: object
 *                 description: Available color options for the product.
 *                 example: { "primary": "black", "secondary": "white" }
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 categoryId:
 *                   type: integer
 *                   example: 2
 *                 name:
 *                   type: string
 *                   example: "Smartphone"
 *                 description:
 *                   type: string
 *                   example: "Latest model with advanced features."
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 699.99
 *                 image:
 *                   type: string
 *                   example: "/images/smartphone.png"
 *                 shortDescription:
 *                   type: string
 *                   example: "Advanced smartphone with amazing features."
 *                 addiotionalInformation:
 *                   type: string
 *                   example: "Includes a free case and screen protector."
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 options:
 *                   type: object
 *                   example: { "color": "black", "memory": "64GB" }
 *                 color:
 *                   type: object
 *                   example: { "primary": "black", "secondary": "white" }
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T18:38:56.541Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T18:38:56.541Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

prodcustRoute.post('/',
    authenticate,
    authorize('admin'),
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'colors[0][images]', maxCount: 5 },
        { name: 'colors[1][images]', maxCount: 5 },
    ]),
    productController.createProduct
);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update a product's details by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update.
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
 *               categoryId:
 *                 type: integer
 *                 description: The category ID of the product.
 *                 example: 2
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 description: A description of the product.
 *                 example: "Latest model with advanced features."
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *                 example: 699.99
 *               image:
 *                 type: string
 *                 description: URL of the product image.
 *                 example: "/images/smartphone.png"
 *               shortDescription:
 *                 type: string
 *                 description: A short description of the product.
 *                 example: "Advanced smartphone with amazing features."
 *               addiotionalInformation:
 *                 type: string
 *                 description: Additional information about the product.
 *                 example: "Includes a free case and screen protector."
 *               status:
 *                 type: boolean
 *                 description: Whether the product is active or not.
 *                 example: true
 *               options:
 *                 type: object
 *                 description: Optional attributes like color, size, etc.
 *                 example: { "color": "black", "memory": "64GB" }
 *               color:
 *                 type: string
 *                 description: The color of the product.
 *                 example: "black"
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 categoryId:
 *                   type: integer
 *                   example: 2
 *                 name:
 *                   type: string
 *                   example: "Smartphone"
 *                 description:
 *                   type: string
 *                   example: "Latest model with advanced features."
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 699.99
 *                 image:
 *                   type: string
 *                   example: "/images/smartphone.png"
 *                 shortDescription:
 *                   type: string
 *                   example: "Advanced smartphone with amazing features."
 *                 addiotionalInformation:
 *                   type: string
 *                   example: "Includes a free case and screen protector."
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 options:
 *                   type: object
 *                   example: { "color": "black", "memory": "64GB" }
 *                 color:
 *                   type: string
 *                   example: "black"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T18:38:56.541Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-11-28T18:38:56.541Z"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

prodcustRoute.put('/:id', authenticate, authorize('admin'), productController.updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Remove a product from the store by its unique ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

prodcustRoute.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

/**
 * @swagger
 * /product/change-order:
 *   post:
 *     summary: Change the order of a product on the homepage
 *     description: This endpoint allows the admin to change the order of a specific product on the homepage.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to change the order of
 *                 example: 1
 *               homePage:
 *                 type: integer
 *                 description: The new order index of the product on the homepage
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order changed successfully"
 *       400:
 *         description: Bad Request, invalid input or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error while changing order"
 */
prodcustRoute.post('/change-order', authenticate, authorize('admin'), productController.changeOrder);

/**
 * @swagger
 * /product/addDiscountTiers:
 *   post:
 *     summary: Add multiple discount tiers for a product
 *     description: Adds multiple discount tiers for a specified product, ensuring no overlapping tiers exist.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - discountTiers
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product.
 *                 example: 1
 *               discountTiers:
 *                 type: array
 *                 description: An array of discount tiers to be added for the product.
 *                 items:
 *                   type: object
 *                   required:
 *                     - startRange
 *                     - endRange
 *                     - discount
 *                   properties:
 *                     startRange:
 *                       type: number
 *                       format: float
 *                       description: The start range of the discount tier.
 *                       example: 10.0
 *                     endRange:
 *                       type: number
 *                       format: float
 *                       description: The end range of the discount tier.
 *                       example: 20.0
 *                     discount:
 *                       type: number
 *                       format: float
 *                       description: The discount percentage for this tier.
 *                       example: "15%"
 *     responses:
 *       200:
 *         description: Discount tiers added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discount tiers added successfully"
 *                 tiers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       startRange:
 *                         type: number
 *                         example: 10.0
 *                       endRange:
 *                         type: number
 *                         example: 20.0
 *                       discount:
 *                         type: number
 *                         example: 15.0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-16T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-16T10:00:00.000Z"
 *       400:
 *         description: Validation error or overlapping tier exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Overlapping tier already exists"
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error while adding discount tiers"
 */

prodcustRoute.post('/addDiscountTiers', authenticate, authorize('admin'), productController.addDiscountTiers);

/**
 * @swagger
 * /product/similar-products/{productId}:
 *   get:
 *     summary: Fetch similar products for a specific product
 *     tags:
 *       - Similar Products
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to fetch similar products for
 *     responses:
 *       200:
 *         description: Similar products fetched successfully
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
 *                   example: Similar products fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       similarProductId:
 *                         type: integer
 *                         example: 2
 *                       similarProductDetails:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: Product B
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 200.50
 *                           image:
 *                             type: string
 *                             example: https://example.com/image.jpg
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 */

prodcustRoute.get('/similar-products/:productId', productController.getSimilarProducts);

/**
 * @swagger
 * /product/similar-products:
 *   post:
 *     summary: Add similar products for a specific product
 *     tags:
 *       - Similar Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - similarProducts
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product for which similar products are being added
 *               similarProducts:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: An array of product IDs to be added as similar products
 *             example:
 *               productId: 1
 *               similarProducts: [2, 3, 4]
 *     responses:
 *       200:
 *         description: Similar products added successfully
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
 *                   example: Similar products added successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       similarProductId:
 *                         type: integer
 *                         example: 2
 *       404:
 *         description: Product or similar product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 */

prodcustRoute.post('/similar-products', authenticate, authorize('admin'), productController.addSimilarProducts);

/**
 * @swagger
 * /product/{id}/status:
 *   patch:
 *     summary: Update the status of a product
 *     description: Update the status of a specific product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product status updated successfully
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error message
 */

prodcustRoute.patch('/status', productController.patchProductStatus);
prodcustRoute.delete('/remove/:productId/:discountTierId', productController.deleteDiscountTiers);
prodcustRoute.get('/dicounted-products/:productId', productController.getDiscount);
prodcustRoute.get('/featured-products', productController.getFeacturedProducts);

module.exports = prodcustRoute;
