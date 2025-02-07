const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();

//Swagger Setup
const setupSwaggger = require('./config/swqgger');
setupSwaggger(app);

// Association
require('./models/associations.Model');

// Middleware for serving static files
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/pdf', express.static(path.join(__dirname, '../public/pdf')));

// app.use(cors({
//     origin: ["http://16.170.239.246", "http://16.170.239.246:3000", "http://localhost:3000"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));
app.use(cors());

// Middleware for parsing incoming request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', require('./routes/user.Route'));
app.use('/image', require('./routes/image.Route'));
app.use('/category', require('./routes/category.Route'));
app.use('/product', require('./routes/products.Route'));
app.use('/reviews', require('./routes/review.Route'));
app.use('/cart', require('./routes/cart.Route'));
app.use('/orders', require('./routes/order.Route'));
app.use('/favourites', require('./routes/favourite.Route'));
app.use('/cities', require('./routes/cities.Route'));
app.use('/delivery-charges', require('./routes/productDeliveryCharges.Router'));
app.use('/quotation', require('./routes/getQuotation.Route'));
app.use('/bank', require('./routes/bankAccountDetails.Route'));
app.use('/utm', require('./routes/utm.Route'));
app.use('/tac', require('./routes/termsAndCondition.Route'));
app.use('/pap', require('./routes/privacyAndPolicy.Route'));
app.use('/frequently', require('./routes/faq.Routes'));


const PORT = process.env.PORT || 80;
// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});