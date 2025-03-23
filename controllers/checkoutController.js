const checkoutModel = require("../models/checkout")
const cartModel = require("../models/cart")
const userModel = require("../models/user")
const formattedDate = new Date().toLocaleString()
const axios = require("axios")
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const paymentModel = require("../models/payment")


exports.checkout = async (req, res) => {
    try {
        const { userId } = req.user
        const { reference } = req.query;
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            })
        };

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({
                message: "This User does not have a cart"
            })
        };

        // IMPLEMENT PAYMENT

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`
            }
        });

        const { data } = response
        if (data?.data?.status && data?.data?.status === "success") {
            const transaction = await paymentModel.findOneAndUpdate({ reference }, { status: "Success" }, { new: true });


            const products = cart.products.map((p) => p.productId)

            const newCheckout = new checkoutModel({
                userId,
                productIds: products,
                grandTotal: cart.grandTotal,
                paymentDate: formattedDate
            })

            cart.products = [];
            cart.grandTotal = 0
            await cart.save()

            await newCheckout.save()

            res.status(200).json({
                message: "Checkout Successful",
                data: transaction
            })
        } else {
            const transaction = await paymentModel.findOneAndUpdate({ reference }, { status: "Failed" }, { new: true });

            res.status(200).json({
                message: "Payment Failed",
                daa: transaction
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error Checking Out"
        })
    }
};

exports.initializePyment = async (req, res) => {
    try {
        const { userId } = req.user
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            })
        };

        const cart = await cartModel.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({
                message: "This User does not have a cart"
            })
        };

        const paymentData = {
            amount: cart.grandTotal * 100,
            email: user.email
        };

        const response = await axios.post("https://api.paystack.co/transaction/initialize", paymentData, {
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`
            }
        });
        console.log(response);


        const { data } = response

        const payment = new paymentModel({
            amount: cart.grandTotal,
            email: paymentData.email,
            reference: data?.data?.reference,
            paymentDate: formattedDate
        })

        await payment.save();
        res.status(200).json({
            message: "Payment Initialized Successfully",
            data: {
                authorization_url: data?.data?.authorization_url,
                reference: data?.data?.reference
            },
            transactionDetails: payment
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Error Initializing Payment"
        })

    }
};