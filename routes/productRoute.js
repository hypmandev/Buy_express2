const { addProduct, getAllProducts, getOneProduct, getProductsByCategory, deleteProduct } = require("../controllers/productController.js")
const { authenticate, adminAuth } = require("../middleware/authentication.js")

const router = require("express").Router()

const upload = require("../utils/multer.js")



/**
 * @swagger
 * /api/v1/getAllProducts:
 *   get:
 *     summary: Retrieves all products from the database
 *     responses:
 *       200:
 *         description: A list of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Products
 *                 data:
 *                   type: array
 *                   description: An array of product objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique product ID
 *                         example: 603d2d4b8bcae20017b9d3c2
 *                       description:
 *                         type: string
 *                         description: Description of the product
 *                         example: A stylish handbag
 *                       price:
 *                         type: number
 *                         description: Price of the product
 *                         example: 59.99
 *                       categoryName:
 *                         type: string
 *                         description: Name of the product's category
 *                         example: Accessories
 *                       productImage:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             description: URL of the product image
 *                             example: https://example.com/image.jpg
 *                           publicId:
 *                             type: string
 *                             description: Public ID of the image from Cloudinary
 *                             example: abc123
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get("/allProducts", authenticate, upload.single("productImage"),getAllProducts)

/**
 * @swagger
 * /api/v1/getOneProduct/{productId}:
 *   get:
 *     summary: Retrieves a single product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *         example: 603d2d4b8bcae20017b9d3c2
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products Retrieved
 *                 data:
 *                   type: object
 *                   description: Details of the retrieved product
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique product ID
 *                       example: 603d2d4b8bcae20017b9d3c2
 *                     description:
 *                       type: string
 *                       description: Description of the product
 *                       example: A stylish handbag
 *                     price:
 *                       type: number
 *                       description: Price of the product
 *                       example: 59.99
 *                     categoryName:
 *                       type: string
 *                       description: Name of the product's category
 *                       example: Accessories
 *                     productImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           description: URL of the product image
 *                           example: https://example.com/image.jpg
 *                         publicId:
 *                           type: string
 *                           description: Cloudinary public ID of the product image
 *                           example: abc123
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get("/product/:productId", authenticate, upload.single("productImage"),getOneProduct);

/**
 * @swagger
 * /api/v1/deleteProduct/{categoryId}/{productId}:
 *   delete:
 *     summary: Deletes a product and updates the associated category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category the product belongs to
 *         example: 603d2d4b8bcae20017b9d3c2
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be deleted
 *         example: 603d2d4b8bcae20017b9d3e4
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product or category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete("/product/delete/:productId/:categoryId", adminAuth,upload.single("productImage"), deleteProduct)

module.exports = router