const { createCategory, getAllCategoryy, getOneCategory } = require("../controllers/categoryController")
const { authenticate } = require("../middleware/authentication")

const router = require("express").Router()

router.post("/category", authenticate, createCategory);

router.get("/allCategories", authenticate, getAllCategoryy)

router.get("/category/:categoryId", authenticate, getOneCategory)


module.exports = router