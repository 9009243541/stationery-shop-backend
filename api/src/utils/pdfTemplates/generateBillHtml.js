// api/src/utils/pdfTemplates/generateBillHtml.js
// api/src/utils/pdfTemplates/generateBillHtml.js
// api/src/utils/pdfTemplates/generateBillHtml.js
const fs = require("fs").promises;
const path = require("path");
const hbs = require("hbs");

async function generateBillHtml({ bill, order, user }) {
  const templatePath = path.join(__dirname, "../../views/invoice.hbs");
  const template = await fs.readFile(templatePath, "utf8");
  const compiledTemplate = hbs.compile(template);
  const htmlContent = compiledTemplate({
    bill: bill.toObject ? bill.toObject() : bill,
    order: {
      ...order,
      products: order.products.map((p) => ({
        ...p,
        price: p.price || p.productId?.finalPrice || 0,
        total: p.total || (p.price || p.productId?.finalPrice || 0) * p.quantity,
      })),
    },
    user,
  }, { allowProtoPropertiesByDefault: true });
  
  // Debug: Log and save HTML
  console.log("Generated HTML Length:", htmlContent.length);
  const debugPath = path.join(__dirname, "../../../Uploads/debug.html");
  console.log("Debug HTML Path:", debugPath); // Log path for verification
  await fs.mkdir(path.join(__dirname, "../../../Uploads"), { recursive: true }); // Create Uploads if not exists
  await fs.writeFile(debugPath, htmlContent);
  
  return htmlContent;
}

module.exports = generateBillHtml;
// const fs = require("fs").promises;
// const path = require("path");
// const hbs = require("hbs");

// async function generateBillHtml({ bill, order, user }) {
//   const templatePath = path.join(__dirname, "../../views/invoice.hbs");
//   const template = await fs.readFile(templatePath, "utf8");
//   const compiledTemplate = hbs.compile(template);
//   const htmlContent = compiledTemplate({
//     bill: bill.toObject ? bill.toObject() : bill,
//     order: {
//       ...order,
//       products: order.products.map((p) => ({
//         ...p,
//         price: p.price || p.productId?.finalPrice || 0,
//         total: p.total || (p.price || p.productId?.finalPrice || 0) * p.quantity,
//       })),
//     },
//     user,
//   }, { allowProtoPropertiesByDefault: true });
  
//   // Log HTML to debug
//   console.log("Generated HTML:", htmlContent);
//   // Optionally save HTML to file for inspection
//   await fs.writeFile(path.join(__dirname, "../../Uploads/debug.html"), htmlContent);
  
//   return htmlContent;
// }

// module.exports = generateBillHtml;
