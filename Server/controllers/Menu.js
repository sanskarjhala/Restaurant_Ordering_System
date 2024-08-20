const Category = require("../models/Category");
const Menu = require("../models/MenuItems");

exports.createMenuItem = async (req, res) => {
  try {
    //fetch the data
    const { name, description, price } = req.body;
    const { categoryId } = req.params;
    //validation
    if (!name || !description || !price || !categoryId) {
      return res.status(403).json({
        success: false,
        message: "please all the fileds",
      });
    }

    //create entry in database
    const newItem = await Menu.create({
      name: name,
      description: description,
      price: price,
      category: categoryId,
    });

    const categoryUpdateDetails = await Category.findByIdAndUpdate(
      { _id: categoryId },
      {
        $push: {
          items: newItem._id, // have to check this 
        },
      }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Item as been created",
      Item: newItem,
      categoryUpdateDetails: categoryUpdateDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating item",
      error: error,
    });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    //fetch the item id
    const { itemId } = req.params;
    //check whether item is present or not
    const itemPresent = await Menu.findById(itemId);

    if (!itemPresent) {
      return res.status(404).json({
        success: false,
        message: "item not found",
      });
    }

    //delete the item
    await Menu.findByIdAndDelete({
      Id: itemId,
    });

    return res.status(200).json({
      success: true,
      message: "Item has been deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Went wrong while deleting the item",
      error: error,
    });
  }
};
