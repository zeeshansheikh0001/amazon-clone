module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("orderItem", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return OrderItem;
}; 