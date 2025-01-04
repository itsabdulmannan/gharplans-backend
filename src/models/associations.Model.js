const Products = require('./product.Model');
const Category = require('./category.Model');
const Review = require('./review.Model');
const User = require('./user.Model');
const cart = require('./cart.Model');
const Order = require('./order.Model');
const discountedPrice = require('./discountedProducts.Model');
const ProductsDeliveryCharge = require('./productDeliveryCharges.Model');
const Cities = require('./cities.Model');
const similerProductModel = require('../models/similarProducts.Model')

Products.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Products, { foreignKey: 'categoryId' });

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Products, { foreignKey: 'productId' });

cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
cart.belongsTo(Products, { foreignKey: 'productId', as: 'product' });
User.hasMany(cart, { foreignKey: 'userId', as: 'carts' });
Products.hasMany(cart, { foreignKey: 'productId', as: 'carts' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.belongsToMany(Products, { through: 'OrderItem', foreignKey: 'orderId' });
Products.belongsToMany(Order, { through: 'OrderItem', foreignKey: 'productId' });

Products.hasMany(discountedPrice, { foreignKey: 'productId', as: 'discountedProducts', });
discountedPrice.belongsTo(Products, { foreignKey: 'productId', as: 'product', });

Products.hasMany(ProductsDeliveryCharge, { foreignKey: 'productId', as: 'deliveryCharges' });
ProductsDeliveryCharge.belongsTo(Products, { foreignKey: 'productId', as: 'product' });

Cities.hasMany(ProductsDeliveryCharge, { foreignKey: 'sourcerCityId', as: 'sourceDeliveries' });
ProductsDeliveryCharge.belongsTo(Cities, { foreignKey: 'sourcerCityId', as: 'sourceCity' });

Cities.hasMany(ProductsDeliveryCharge, { foreignKey: 'destinationCityId', as: 'destinationDeliveries' });
ProductsDeliveryCharge.belongsTo(Cities, { foreignKey: 'destinationCityId', as: 'destinationCity' });

Products.hasMany(similerProductModel, { foreignKey: 'productId', as: 'similarProducts' });
similerProductModel.belongsTo(Products, { foreignKey: 'similarProductId', as: 'similarProductDetails' });
