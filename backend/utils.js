// Payment verification via email
import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendOrderConfirmationEmail(orderData) {
  const {
    customerName,
    email,
    items,
    totalPrice,
    date,
    selectedTime,
    orderNumber,
  } = orderData;

  // Format items for the email
  const itemsHTML = items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">€${(
        item.amount / 100
      ).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  // Create email options
  const mailOptions = {
    from: `"Lunchbox" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Order Confirmation - Lunchbox",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #7d0d0d;">Lunchbox</h1>
        </div>

        <h2 style="color: #7d0d0d; text-align: center;">Order Confirmation</h2>

        <p>Hello ${customerName},</p>

        <p>Thank you for your order! We've received your payment and your order will be ready for pickup at <strong>${selectedTime}</strong> on <strong>${date}</strong>.</p>

        <div style="margin: 20px 0; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="color: #7d0d0d; margin-top: 0;">Order Summary (Order #${orderNumber})</h3>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f3f3;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Quantity</th>
                <th style="padding: 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">€${parseFloat(
                  totalPrice
                ).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #7d0d0d;">Pickup Information</h3>
          <p>
            <strong>Date:</strong> ${date}<br>
            <strong>Time:</strong> ${selectedTime}<br>
            <strong>Location:</strong> 207 Avenue de Strasbourg, 57070 Metz, France
          </p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;">If you have any questions about your order, please contact us at +33 3 87 65 69 29</p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Thank you for choosing Lunchbox!</p>
        </div>
      </div>
    `,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}
