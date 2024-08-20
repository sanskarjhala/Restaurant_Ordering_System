const Category = require("../models/Category");
const Menu = require("../models/MenuItems");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    const response = await Category.create({
      name: name,
      description: description,
    });
    return res.status(200).json({
      success: true,
      message: "Category created",
      response: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the category",
      error: error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const items = category.items;
    for (const itemId of items) {
      await Menu.findByIdAndDelete(itemId);
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting category",
      error: error,
    });
  }
};

exports.fetchItemWithSpecificCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const items = await Category.findById(categoryId).populate("items").exec();

    return res.status(200).json({
      success: false,
      message: "items fetched successfully",
      items: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the items",
    });
  }
};
