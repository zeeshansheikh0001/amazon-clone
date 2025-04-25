module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    shippingAddress: {
      type: Sequelize.STRING,
      allowNull: false
    },
    paymentMethod: {
      type: Sequelize.STRING,
      defaultValue: 'cash on delivery'
    },
    paymentStatus: {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    }
  });

  return Order;
}; 