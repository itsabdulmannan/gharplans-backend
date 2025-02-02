const Products = require('./product.Model');
const Category = require('./category.Model');
const Review = require('./review.Model');
const User = require('./user.Model');
const cart = require('./cart.Model');
const Order = require('./order.Model');
const discountedPrice = require('./discountedProducts.Model');
const ProductsDeliveryCharge = require('./productDeliveryCharges.Model');
const Cities = require('./cities.Model');
const similerProductModel = require('../models/similarProducts.Model');
const ProductColors = require('./productColor.Model');

Products.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Category.hasMany(Products, { foreignKey: 'categoryId' });

Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Products, { foreignKey: 'productId', onDelete: 'CASCADE' });

cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
cart.belongsTo(Products, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });
User.hasMany(cart, { foreignKey: 'userId', as: 'carts' });
Products.hasMany(cart, { foreignKey: 'productId', as: 'carts' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.belongsToMany(Products, { through: 'OrderItem', foreignKey: 'orderId', onDelete: 'CASCADE' });
Products.belongsToMany(Order, { through: 'OrderItem', foreignKey: 'productId', onDelete: 'CASCADE' });

Products.hasMany(discountedPrice, { foreignKey: 'productId', as: 'discountedProducts', onDelete: 'CASCADE' });
discountedPrice.belongsTo(Products, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });

Products.hasMany(ProductsDeliveryCharge, { foreignKey: 'productId', as: 'deliveryCharges', onDelete: 'CASCADE' });
ProductsDeliveryCharge.belongsTo(Products, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE' });

Cities.hasMany(ProductsDeliveryCharge, { foreignKey: 'sourceCityId', as: 'sourceDeliveries', onDelete: 'SET NULL' });
ProductsDeliveryCharge.belongsTo(Cities, { foreignKey: 'sourceCityId', as: 'sourceCity', onDelete: 'SET NULL' });

Cities.hasMany(ProductsDeliveryCharge, { foreignKey: 'destinationCityId', as: 'destinationDeliveries', onDelete: 'SET NULL' });
ProductsDeliveryCharge.belongsTo(Cities, { foreignKey: 'destinationCityId', as: 'destinationCity', onDelete: 'SET NULL' });

Products.hasMany(similerProductModel, { foreignKey: 'productId', as: 'similarProducts', onDelete: 'CASCADE' });
similerProductModel.belongsTo(Products, { foreignKey: 'similarProductId', as: 'similarProductDetails', onDelete: 'CASCADE' });

Products.hasMany(ProductColors, { foreignKey: 'productId', as: 'colors' });
ProductColors.belongsTo(Products, { foreignKey: 'productId', as: 'colors' });

ProductColors.hasMany(similerProductModel, { foreignKey: 'similarProductId', as: 'similarProductDetailsColors' });
similerProductModel.belongsTo(ProductColors, { foreignKey: 'similarProductId', as: 'similarProductDetailsColors' });