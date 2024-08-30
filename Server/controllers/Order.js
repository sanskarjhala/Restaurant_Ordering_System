const Order = require("../models/Orders");
const User = require("../models/User");
const Table = require("../models/Tabels");
const Menu = require("../models/MenuItems");

exports.createOrder = async (req, res) => {
  try {
    const { items, waiterId, tableId } = req.body;

    if (!items || !waiterId || !tableId) {
      return res.status(403).json({
        success: false,
        message: "Please provide all fileds",
      });
    }

    const waiterExist = await User.findOne({
      _id: waiterId,
      accountType: "Waiter",
    });

    if (!waiterExist) {
      return res.status(404).json({
        success: false,
        message: "Waiter Id not found",
      });
    }

    const tableEngaged = await Table.findById(tableId);
    if (!tableEngaged) {
      return res.status(404).json({
        success: false,
        message: "Table Id not found",
      });
    }
    if (tableEngaged.status !== "Free") {
      return res.status(403).json({
        success: false,
        message: "Table is not free assing another tabel",
      });
    }

    await Table.findByIdAndUpdate(
      { _id: tableId },
      {
        status: "Occupied",
      },
      { new: true }
    );

    let totalAmount = 0;
    const orderItems = [];

    for (const item in items) {
      const menuItems = await Menu.findById(item._id);
      if (!menuItems) {
        return res.status(404).json({
          success: false,
          message: "Item not not found",
        });
      }

      totalAmount += parseFloat(menuItems.price) * item.quantity; // have to cheack this
      orderItems.push({
        menuItems: menuItems._id,
        quantity: item.quantity,
      });
    }

    try {
      //creating the order
      const createdOrder = await Order.create({
        tableId: tableId,
        items: orderItems,
        waiterId: waiterId,
        totalAmount: totalAmount,
      });

      return res.status(200).json({
        success: true,
        message: "Order created successfully",
        order: createdOrder,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "error while creating the order",
      });
    }

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creatting the order",
      error: error,
    });
  }
};
