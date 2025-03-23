const cartModel = require("../models/cart")
const productModel = require("../models/products")
const userModel = require("../models/user")

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.params
        const { userId } = req.user

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        };
        console.log("product", product)

        let cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            cart = new cartModel({
                user: userId,
                products: [],
                // grandTotal:0
            })
        };
        const productExist = cart.products.find((item) => item.productId.toString() === productId)
        console.log("PRODUCT EXIST", productExist)
        if (productExist) {
            productExist.quantity += 1
            productExist.unitTotal = productExist.quantity * product.price
        } else {
            const newProduct = {
                productId: productId,
                quantity: 1,
                unitPrice: product.price,
                unitTotal: product.price * 1,
                productName: product.description,
            }
            cart.products.push(newProduct)
        }

        const subTotal = cart.products.reduce((accumulator, product) => accumulator + product.unitTotal, 0)
        cart.grandTotal = subTotal;
        await cart.save()

        res.status(201).json({
            message: "Products added to cart",
            data: cart
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Adding To Cart",
            data: error.message
        });
    }
};

exports.getcart = async (req, res) => {
    try {
        const cart = await cartModel.find()

        res.status(200).json({
            message: "All Products in the cart",
            data: cart
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



exports.reduceProductQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.user

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        };

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        };

        const productExist = cart.products.find(
            (product) => product.productId.toString() === productId.toString()
        );
        if (!productExist) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        const productIndex = cart.products.findIndex(
            (product) => product.productId.toString() === productId.toString()
        );

        if (productExist.quantity === 1) {
            cart.products.splice(productIndex, 1);
        } else {
            productExist.quantity -= 1;
            productExist.unitTotal = productExist.quantity * productExist.unitPrice;
        }

        const subTotalReduce = cart.products.reduce(
            (accumulator, product) => accumulator + product.unitTotal,
            0
        );
        cart.grandTotal = subTotalReduce;
        await cart.save();

        res.status(200).json({
            message: "Product quantity reduced",
            data: cart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User does not exist"
            })
        };

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = []
        cart.grandTotal = 0

        await cart.save()

        res.status(200).json({
            message: "Cart deleted successfully",
            data: cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.deleteProductFromCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const { productId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const productIndex = cart.products.findIndex(
            (product) => product.productId.toString() === productId.toString()
        );
        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        const productExist = cart.products[productIndex];

        if (productExist) {
            cart.products.splice(productIndex, 1);
        }

        const subTotal = cart.products.reduce(
            (accumulator, product) => accumulator + product.unitTotal,
            0
        );
        cart.grandTotal = subTotal;

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart",
            data: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

