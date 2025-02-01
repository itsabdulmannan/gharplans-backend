const Product = require('../models/product.Model');
const DiscountedProducts = require('../models/discountedProducts.Model');
const generatePdf = require('../utils/generatePdf.utils');

const quotationController = {
    getQuotation: async (req, res) => {
        try {
            const { products, billTo, billFrom, quotation } = req.body;

            if (!products || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: "Product details are required" });
            }

            let totalQuotationValue = 0;
            const productDetails = [];
            const host = req.protocol + '://' + req.get('host');

            if (!quotation || !quotation.invoiceNo || !quotation.date) {
                return res.status(400).json({ message: "Invoice number and date are required" });
            }

            if (!billFrom || !billFrom.billFromAddress || !billFrom.billFromPhone || !billFrom.billFromEmail) {
                return res.status(400).json({ message: "Name, phone, and address are required for bill from details" });
            }

            if (!billTo || !billTo.billToName || !billTo.billToPhone || !billTo.billToAddress) {
                return res.status(400).json({ message: "Name, phone, and address are required for bill to details" });
            }

            for (const product of products) {
                const { productId, quantity, color, weight } = product;
                if (!productId || !quantity || !color || !weight) {
                    return res.status(400).json({ message: "Product ID, quantity, color, and weight are required" });
                }


                const checkData = await Product.findOne({ where: { id: productId } });
                if (!checkData) {
                    return res.status(404).json({ message: `Product with ID ${productId} not found` });
                }

                const originalPrice = parseFloat(checkData.price);
                let finalPrice = originalPrice;
                let discountAmount = 0;

                if (checkData.hasDiscount) {
                    const discountTiers = await DiscountedProducts.findAll({ where: { productId } });
                    const applicableDiscount = discountTiers.find(tier => {
                        if (tier.range) {
                            const [min, max] = tier.range.split('-').map(Number);
                            return quantity >= min && quantity <= max;
                        }
                        return false;
                    });
                    if (applicableDiscount) {
                        discountAmount = originalPrice * (parseFloat(applicableDiscount.discount) / 100);
                        finalPrice -= discountAmount;
                    }
                }

                const total = finalPrice * quantity;
                totalQuotationValue += total;

                productDetails.push({
                    productName: checkData.name,
                    productImage: host + checkData.image,
                    originalPrice: originalPrice.toFixed(2),
                    finalPrice: finalPrice.toFixed(2),
                    quantity,
                    total: total.toFixed(2),
                    color,
                    weight,
                    discountAmount: discountAmount.toFixed(2)
                });
            }

            const quotationData = {
                quotationDetails: quotation,
                billFromDetails: billFrom,
                billToDetails: billTo,
                productDetails: productDetails,
                totalQuotationValue: totalQuotationValue.toFixed(2)
            };

            const generatedPdfPath = await generatePdf(quotationData);

            const publicUrl = `${process.env.BASE_URL}/pdf/${generatedPdfPath.split('/').pop()}`;

            res.status(200).json({ message: "PDF generated successfully", fileUrl: publicUrl });

        } catch (error) {
            console.error("Error generating quotation:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = quotationController;
