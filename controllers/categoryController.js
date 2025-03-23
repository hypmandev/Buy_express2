const categoryModel = require("../models/categories")
const productModel = require("../models/products")

exports.createCategory = async(req, res) => {
    try {
        const {name} = req.body

        const category = await categoryModel.findOne({name: name})
        if (category) {
            return res.status(400).json({
                message: "Category already exists"
            })
        }
        const newCategory = new categoryModel({
            name
        })
        await newCategory.save()

        res.status(201).json({
            message: "New Category Added",
            data: newCategory
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
        
    }
};

exports.getAllCategoryy = async (req, res) => {
  try {
    const allCategory = await categoryModel.find()
    
    res.status(200).json({
      message: "All Categories Available",
      data: allCategory
    })
    // console.log(allCategory);
    
  } catch (error) {
    console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    
  }
};

exports.getOneCategory = async(req, res) => {
  try {
    const {categoryId} = req.params

    const category = await categoryModel.findById(categoryId).populate('productIds')
    if(!category) {
      return res.status(404).json({
        message: "Category Not Found",
      })
    }

    res.status(200).json({
      messsage: "Category Retrieved Successfully",
      data: category
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    })
  }
}

