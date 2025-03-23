const { initializePyment, checkout } = require("../controllers/checkoutController")
const { authenticate } = require("../middleware/authentication")

const router = require("express").Router()

router.post("/payment/initialize", authenticate, initializePyment)

router.post("/checkout", authenticate, checkout)

module.exports = router