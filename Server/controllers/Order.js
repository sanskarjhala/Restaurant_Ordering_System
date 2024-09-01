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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creatting the order",
      error: error,
    });
  }
};

//update order -> adding new items
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newItems } = req.body;
    const waiterId = req.user.id;

    if (!orderId || !newItems || !waiterId) {
      return res.status(403).json({
        success: false,
        message: "please provide all fileds",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found ",
      });
    }

    let totalAmount = parseInt(order.totalAmount);

    for (const item of newItems) {
      const menuItem = Menu.findById(item._id);

      if (!menuItem) {
        res.status(404).json({
          success: false,
          message: "Item not found",
          item: item,
        });
        continue;
      }

      order.items.push({
        menuItems: menuItem._id,
        quantity: item.quantity,
      });

      totalAmount += parseInt(menuItem.price) * item.quantity;
    }

    order.totalAmount = totalAmount;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated",
      updatedOrder: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating order",
      error: error,
    });
  }
};

//marking order conmpleted
exports.markCompleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(403).json({
        success: false,
        message: "Order-Id not provided",
      });
    }

    const order = Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const updatedStatus = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        status: "Completed",
      },
      { new: true }
    );

    const updatedTableStatus = await Table.findByIdAndUpdate(
      { _id: order.tableId },
      {
        status: "Free",
      },
      { new: true }
    );

    return res.status(200).json({
      success: false,
      message: "order status updated successfully",
      updatedStatus,
      updatedTableStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went worng marking order as completed",
    });
  }
};


exports.listAllOrders  = async(req,res) => {
  try {
    const allOrders = await Order.find({});

    return res.status(200).json({
      success:true,
      message:"orders fetched successfully",
      data:allOrders
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Something went wrong while fetching the orders"
    })
  }
}