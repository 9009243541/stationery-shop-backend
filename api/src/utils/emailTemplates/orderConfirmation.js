module.exports = function orderConfirmationTemplate({
  userName,
  order,
  deliveryAddress,
}) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #232f3e; padding: 16px; text-align: center;">
      <img src="https://tbtdj99v-3300.inc1.devtunnels.ms/uploads/logo/aa.png" alt="AV Foundation Logo" style="height: 50px;" />
    </div>

    <div style="padding: 24px;">
      <h2 style="color: #232f3e;">Hi ${userName},</h2>
      <p style="font-size: 16px; color: #333;">
        Thank you for your order! 🎉 We're happy to let you know that your order has been successfully placed.
      </p>

      <div style="margin: 24px 0; padding: 16px; background-color: #f8f8f8; border-radius: 6px;">
        <p style="margin: 0;"><strong>Order ID:</strong> ${order._id}</p>
        <p style="margin: 0;"><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</p>
        <p style="margin: 0;"><strong>Shipping To:</strong> ${deliveryAddress}</p>
      </div>

     <h3 style="margin-top: 24px;">🛍️ Items Ordered</h3>
<ul style="padding-left: 20px; color: #444;">
  ${(order.items || [])
    .map(
      (item) =>
        `<li>${item.name} - ₹${item.price} × ${item.quantity} = ₹${item.total}</li>`
    )
    .join("")}
</ul>

<p style="margin-top: 16px;">
  <strong>Total Amount:</strong> ₹${order.totalAmount || "0"}
</p>


      <p style="margin-top: 16px; font-size: 15px; color: #555;">
        📅 <strong>Estimated Delivery:</strong> Within 3–5 business days
      </p>

      <div style="text-align: center; margin-top: 32px;">
        <a href="https://avfoundation.com/orders/${order._id}" 
           style="background-color: #ff9900; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View or Track Order
        </a>
      </div>

      <p style="margin-top: 32px; font-size: 14px; color: #777;">
        If you have any questions, feel free to contact our support team at 
        <a href="mailto:support@avfoundation.com">support@avfoundation.com</a>.
      </p>

      <p style="margin-top: 16px;">Thanks for shopping with us!<br />– Team AV Foundation</p>
    </div>

    <div style="background-color: #f2f2f2; padding: 16px; text-align: center; font-size: 12px; color: #888;">
      AV Foundation, Your Trustworthy Store.<br />
      Follow us on 
      <a href="#" style="color: #0066c0;">Facebook</a> | 
      <a href="#" style="color: #0066c0;">Instagram</a> | 
      <a href="#" style="color: #0066c0;">Twitter</a>
    </div>
  </div>
  `;
};



// module.exports = function orderConfirmationTemplate({
//   userName,
//   order,
//   deliveryAddress,
//   paymentMode,
//   total,
// }) {
//   return `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//     <div style="background-color: #232f3e; padding: 16px; text-align: center;">
//       <img src="https://tbtdj99v-3300.inc1.devtunnels.ms/uploads/logo/aa.png" alt="AV Foundation Logo" style="height: 50px;" />
//     </div>

//     <div style="padding: 24px;">
//       <h2 style="color: #232f3e;">Hi ${userName},</h2>
//       <p style="font-size: 16px; color: #333;">
//         Thank you for your order! 🎉 We're happy to let you know that your order has been successfully placed.
//       </p>

//       <div style="margin: 24px 0; padding: 16px; background-color: #f8f8f8; border-radius: 6px;">
//         <p style="margin: 0;"><strong>Order ID:</strong> ${order._id}</p>
//         <p style="margin: 0;"><strong>Order Date:</strong> ${new Date(
//           order.createdAt
//         ).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
//         <p style="margin: 0;"><strong>Shipping To:</strong> ${deliveryAddress}</p>
//         <p style="margin: 0;"><strong>Payment Mode:</strong> ${paymentMode}</p>
//       </div>

//       <h3 style="margin-top: 24px;">🛍️ Items Ordered</h3>
//       <ul style="padding-left: 20px; color: #444;">
//         ${order.products
//           .map(
//             (item) =>
//               `<li>${item.productId?.productName || "Unknown Product"} &times; ${
//                 item.quantity
//               } (₹${item.productId?.finalPrice || 0} each)</li>`
//           )
//           .join("")}
//       </ul>

//       <p style="margin-top: 16px;"><strong>Total Amount:</strong> ₹${total.toFixed(
//         2
//       )}</p>

//       <p style="margin-top: 16px; font-size: 15px; color: #555;">
//         📅 <strong>Estimated Delivery:</strong> Within 3–5 business days
//       </p>

//       <div style="text-align: center; margin-top: 32px;">
//         <a href="https://avfoundation.com/orders/${order._id}" 
//            style="background-color: #ff9900; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//           View or Track Order
//         </a>
//       </div>

//       <p style="margin-top: 32px; font-size: 14px; color: #777;">
//         If you have any questions, feel free to contact our support team at 
//         <a href="mailto:support@avfoundation.com">support@avfoundation.com</a>.
//       </p>

//       <p style="margin-top: 16px;">Thanks for shopping with us!<br />– Team AV Foundation</p>
//     </div>

//     <div style="background-color: #f2f2f2; padding: 16px; text-align: center; font-size: 12px; color: #888;">
//       AV Foundation, Your Trustworthy Store.<br />
//       Follow us on 
//       <a href="#" style="color: #0066c0;">Facebook</a> | 
//       <a href="#" style="color: #0066c0;">Instagram</a> | 
//       <a href="#" style="color: #0066c0;">Twitter</a>
//     </div>
//   </div>
//   `;
// };
