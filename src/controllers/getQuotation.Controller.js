const Product = require('../models/product.Model');
const discountedProducts = require('../models/discountedProducts.Model'); // Import the discountedProducts model
const generatePdf = require('../utils/generatePdf.utils');

const quotationController = {
    getQuotation: async (req, res) => {
        try {
            const { products } = req.body;
            if (!products || products.length === 0) {
                return res.status(400).json({ message: "Product details are required" });
            }

            let totalQuotationValue = 0;
            const productDetails = [];

            const host = req.protocol + '://' + req.get('host');

            for (const product of products) {
                const { productId, quantity, color, weight } = product;

                if (!productId || !quantity || !color || !weight) {
                    return res.status(400).json({ message: "Product ID, quantity, color, and weight are required for all products" });
                }
                const checkData = await Product.findOne({ where: { id: productId } });
                if (!checkData) {
                    return res.status(404).json({ message: `Product with ID ${productId} not found` });
                }

                const originalPrice = parseFloat(checkData.price);
                let finalPrice = originalPrice;
                const finalWeight = weight;
                let applicableDiscount = null;

                if (checkData.hasDiscount) {
                    const discountTiers = await discountedProducts.findAll({
                        where: { productId },
                    });

                    applicableDiscount = discountTiers.find(tier => {
                        if (tier.range) {
                            const [min, max] = tier.range.split('-').map(Number);
                            return quantity >= min && quantity <= max;
                        }
                        return false;
                    });

                    if (applicableDiscount) {
                        const discountPercentage = parseFloat(applicableDiscount.discount);
                        finalPrice = originalPrice - (originalPrice * (discountPercentage / 100));
                    }
                }

                const total = finalPrice * quantity;
                totalQuotationValue += total;

                productDetails.push({
                    productName: checkData.name,
                    productImage: host + checkData.image,
                    originalPrice: originalPrice && !isNaN(originalPrice) ? originalPrice.toFixed(2) : "0.00",
                    finalPrice: finalPrice && !isNaN(finalPrice) ? finalPrice.toFixed(2) : "0.00",
                    quantity,
                    total: total && !isNaN(total) ? total.toFixed(2) : "0.00",
                    color: color,
                    weight: finalWeight,
                });
            }

            const generatedPdf = await generatePdf({
                products: productDetails,
                totalQuotationValue: totalQuotationValue && !isNaN(totalQuotationValue) ? totalQuotationValue.toFixed(2) : "0.00",
            });
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=quotation.pdf',
            });
            res.status(200).end(generatedPdf);

        } catch (error) {
            console.error("Error getting quotation:", error);
            return res.status(500).json({ status: false, message: "Internal server error" });
        }
    }
}

module.exports = quotationController;
