const db = require('../models');
const Order = db.order;
const OrderItem = db.orderItem;
const Cart = db.cart;
const Product = db.product;
const { sequelize } = db;

// Create new order
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).send({ message: "Shipping address is required!" });
    }
    
    // Get user's cart
    const cartItems = await Cart.findAll({
      where: { userId: req.userId },
      include: [{
        model: Product
      }],
      transaction: t
    });
    
    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).send({ message: "Cart is empty!" });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.quantity * item.product.price;
    }
    
    // Create order
    const order = await Order.create({
      userId: req.userId,
      totalAmount,
      status: 'pending',
      shippingAddress,
      paymentMethod: paymentMethod || 'cash on delivery',
      paymentStatus: 'pending'
    }, { transaction: t });
    
    // Create order items
    const orderItems = [];
    for (const item of cartItems) {
      // Check if stock is sufficient
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).send({ 
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}` 
        });
      }
      
      // Create order item
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }, { transaction: t });
      
      orderItems.push(orderItem);
      
      // Update product stock
      await Product.update({
        stock: item.product.stock - item.quantity
      }, {
        where: { id: item.productId },
        transaction: t
      });
    }
    
    // Clear cart
    await Cart.destroy({
      where: { userId: req.userId },
      transaction: t
    });
    
    await t.commit();
    
    res.status(201).send({
      message: "Order created successfully!",
      order,
      orderItems
    });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ message: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'name', 'imageUrl']
        }]
      }]
    });
    
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a specific order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'imageUrl']
        }]
      }]
    });
    
    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }
    
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const orderId = req.params.id;
    
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).send({ message: "Order not found!" });
    }
    
    if (status) {
      order.status = status;
    }
    
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    await order.save();
    
    res.status(200).send({
      message: "Order updated successfully!",
      order
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Order.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.user,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(200).send({
      totalItems: count,
      orders: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 