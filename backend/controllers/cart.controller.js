const db = require('../models');
const Cart = db.cart;
const Product = db.product;

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: { userId: req.userId },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'imageUrl', 'stock']
      }]
    });
    
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).send({ message: "Product ID and quantity are required!" });
    }
    
    // Check if product exists and has sufficient stock
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).send({ message: "Insufficient stock available!" });
    }
    
    // Check if item already exists in cart
    let cartItem = await Cart.findOne({
      where: {
        userId: req.userId,
        productId: productId
      }
    });
    
    if (cartItem) {
      // Update quantity if item already in cart
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({
        userId: req.userId,
        productId: productId,
        quantity: quantity
      });
    }
    
    res.status(200).send({
      message: "Item added to cart successfully!",
      cartItem
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    
    if (!cartItemId || !quantity) {
      return res.status(400).send({ message: "Cart item ID and quantity are required!" });
    }
    
    // Find cart item
    const cartItem = await Cart.findOne({
      where: {
        id: cartItemId,
        userId: req.userId
      }
    });
    
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found!" });
    }
    
    // Check product stock
    const product = await Product.findByPk(cartItem.productId);
    
    if (product.stock < quantity) {
      return res.status(400).send({ message: "Insufficient stock available!" });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();
    
    res.status(200).send({
      message: "Cart item updated successfully!",
      cartItem
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    
    // Find cart item
    const cartItem = await Cart.findOne({
      where: {
        id: cartItemId,
        userId: req.userId
      }
    });
    
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item not found!" });
    }
    
    // Delete cart item
    await cartItem.destroy();
    
    res.status(200).send({ message: "Item removed from cart successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { userId: req.userId }
    });
    
    res.status(200).send({ message: "Cart cleared successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 