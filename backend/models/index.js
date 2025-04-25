const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require('./user.model.js')(sequelize, Sequelize);
db.product = require('./product.model.js')(sequelize, Sequelize);
db.order = require('./order.model.js')(sequelize, Sequelize);
db.orderItem = require('./orderItem.model.js')(sequelize, Sequelize);
db.cart = require('./cart.model.js')(sequelize, Sequelize);

// Associations
db.user.hasMany(db.order, { as: 'orders', foreignKey: 'userId' });
db.order.belongsTo(db.user, { foreignKey: 'userId' });

db.order.hasMany(db.orderItem, { as: 'items', foreignKey: 'orderId' });
db.orderItem.belongsTo(db.order, { foreignKey: 'orderId' });

db.product.hasMany(db.orderItem, { foreignKey: 'productId' });
db.orderItem.belongsTo(db.product, { foreignKey: 'productId' });

db.user.hasMany(db.cart, { as: 'cartItems', foreignKey: 'userId' });
db.cart.belongsTo(db.user, { foreignKey: 'userId' });

db.product.hasMany(db.cart, { foreignKey: 'productId' });
db.cart.belongsTo(db.product, { foreignKey: 'productId' });

module.exports = db; 