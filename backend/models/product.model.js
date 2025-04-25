module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    category: {
      type: Sequelize.STRING
    },
    featured: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Product;
}; 