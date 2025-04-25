const db = require('../models');
const Product = db.product;
const { Op } = require('sequelize');

// Get all products with pagination and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    
    // Build filter conditions
    let condition = {};
    
    if (category) {
      condition.category = category;
    }
    
    if (search) {
      condition.name = { [Op.like]: `%${search}%` };
    }
    
    if (minPrice && maxPrice) {
      condition.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      condition.price = { [Op.gte]: minPrice };
    } else if (maxPrice) {
      condition.price = { [Op.lte]: maxPrice };
    }
    
    const { count, rows } = await Product.findAndCountAll({
      where: condition,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).send({
      totalItems: count,
      products: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.findAll({
      where: { featured: true },
      limit
    });
    
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }
    
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Create a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      stock: req.body.stock,
      category: req.body.category,
      featured: req.body.featured || false
    });
    
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }
    
    // Update product fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.category = req.body.category || product.category;
    product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
    
    await product.save();
    
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }
    
    await product.destroy();
    
    res.status(200).send({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}; 