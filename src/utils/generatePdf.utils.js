const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePdf(quotationData) {
    const { quotationDetails, billFromDetails, billToDetails, productDetails, totalQuotationValue } = quotationData;
    const invoiceNo = quotationDetails?.invoiceNo || 'N/A';
    const date = quotationDetails?.date || 'N/A';
    const billFrom = billFromDetails || {};
    const billTo = billToDetails || {};

    const productRows = productDetails.map((product, index) => {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${product.productName || ''} - ${product.color || ''}</td>
                <td>${product.quantity || 0}</td>
                <td>${product.originalPrice || 0}</td>
                <td>${product.discountAmount || 0}</td>
                <td>${product.finalPrice || 0}</td>
                <td>${product.total || 0}</td>
            </tr>
        `;
    }).join('');

    const htmlContent = `
   <!DOCTYPE html>
<html>

<head>
    <title>Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f4f4f4;
        }

        .header-table td {
            border: none;
            text-align: left;
        }

        .total-row {
            font-weight: bold;
        }

        .logo {
            width: 100px;
            height: auto;
        }
    </style>
</head>

<body>

    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <img src="data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="blue" />
            </svg>`).toString('base64')}" class="logo" />
        </div>
        <div>
            <h2>QUOTATION</h2>
            <p>Invoice No: ${invoiceNo}</p>
            <p>Date: ${date}</p>
        </div>
    </div>

    <div style="display: flex; justify-content: space-between;">
        <div>
            <h2 style="margin-top: -3px;">Ghar Plans</h2>
            <p style="margin-top: -10px;">Add: ${billFrom.billFromAddress || 'N/A'}</p>
            <p style="margin-top: -10px;">Ph: ${billFrom.billFromPhone || 'N/A'}</p>
            <p style="margin-top: -10px;">Email: ${billFrom.billFromEmail || 'N/A'}</p>
        </div>
        <div>
            <h2 style="margin-top: -10px;">Bill To:</h2>
            <p style="margin-top: -10px;">Name: ${billTo.billToName || 'N/A'}</p>
            <p style="margin-top: -10px;">Add: ${billTo.billToAddress || 'N/A'}</p>
           <p style="margin-top: -10px;">Ph: ${billTo.billToPhone || 'N/A'}</p>

        </div>
    </div>

    <hr>

    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Rs.</th>
                <th>Discount</th>
                <th>Rate</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${productRows}
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="6">TOTAL:</td>
                <td>${totalQuotationValue}</td>
            </tr>
            <tr class="total-row">
                <td colspan="7">IN WORDS: ${numberToWords(totalQuotationValue)}</td>
            </tr>
        </tfoot>
    </table>
</body>

</html>
`;

    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

        const fileName = `quotation_${Date.now()}.pdf`;
        const fullPath = path.resolve(__dirname, '../../public/pdf', fileName);

        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await page.pdf({ path: fullPath, format: 'A4', printBackground: true });
        await browser.close();

        return `/pdf/${fileName}`;
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        throw new Error('PDF generation failed');
    }
}

function numberToWords(num) {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    function convert(num) {
        if (num < 10) return units[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "");
        if (num < 1000) return units[Math.floor(num / 100)] + " Hundred " + (num % 100 ? convert(num % 100) : "");
        if (num < 1000000) return convert(Math.floor(num / 1000)) + " Thousand " + (num % 1000 ? convert(num % 1000) : "");
        return "Number too large";
    }

    return convert(num) || "Zero";
}

module.exports = generatePdf;
