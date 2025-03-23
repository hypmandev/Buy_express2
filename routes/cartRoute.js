const { addToCart, getcart, reduceProductQuantity, clearCart, deleteProductFromCart } = require("../controllers/cartController");
const { authenticate } = require("../middleware/authentication");

const router = require("express").Router()

/**
 * @swagger
 * /api/v1/addToCart/{productId}:
 *   post:
 *     summary: Adds a product to the user's cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add to the cart
 *         example: 603d2d4b8bcae20017b9d3c2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding the product to the cart
 *                 example: 605d2d7f8bcae20017b9d3f1
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products added to cart
 *                 data:
 *                   type: object
 *                   description: The updated cart with product details
 *       404:
 *         description: User or product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product Not Found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Adding To Cart
 *                 data:
 *                   type: string
 *                   example: Detailed error message
 */

router.post("/cart/:productId", authenticate, addToCart);

router.get("/allCart", authenticate, getcart)

router.patch("/cart/reduce/:productId", authenticate, reduceProductQuantity)

router.delete("/cart/delete/:productId", authenticate, deleteProductFromCart)

router.delete("/clearCart", authenticate, clearCart)


module.exports = router
