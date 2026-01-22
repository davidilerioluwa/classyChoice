import nodemailer from "nodemailer";

// Initialize the transporter with pooling for better reliability
const transporter = nodemailer.createTransport({
  pool: true, // Keeps the connection open to prevent intermittent handshake failures
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  maxConnections: 3, // Limits simultaneous connections to avoid being flagged as spam
});

/**
 * Sends a success email to the customer and the seller after an order is placed.
 */
const sendOrderSuccessfulEmail = async ({
  email,
  items,
  name,
}: {
  email: string;
  name: string;
  items: {
    productId: string;
    quantity: string;
    title: string;
    price: number;
  }[];
}) => {
  const tableRows = items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₦${item.price.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}</td>
    </tr>`
    )
    .join("");

  const total = items.reduce(
    (sum, item) => sum + item.price * Number(item.quantity),
    0
  );

  const finalHtml = `
    <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif;">
      <thead>
        <tr style="text-align: left; background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">S/N</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
      <tfoot>
        <tr style="font-weight: bold; border-top: 2px solid #000;">
          <td colspan="3" style="text-align: right; padding: 8px;">Total:</td>
          <td style="padding: 8px;">₦${total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}</td>
        </tr>
      </tfoot>
    </table>
  `;

  try {
    // Define both email configurations
    const customerMail = {
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
      to: email,
      subject: "Order Successful - Classy Choice Stores",
      text: `Hi ${name}, your order has been placed successfully.`,
      html: `<p>Hi ${name},</p><strong>Your order has been placed successfully!</strong>${finalHtml}`,
    };

    const sellerMail = {
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
      to: "davidilerioluwa1998@gmail.com",
      subject: "New Order Received!",
      text: `An order has been placed by ${name}.`,
      html: `<strong>An order has successfully been placed by ${name}</strong><br/>Email: ${email}${finalHtml}<p>Please check the admin panel to process the order.</p>`,
    };

    // Send both emails concurrently
    const [info, messageToSeller] = await Promise.all([
      transporter.sendMail(customerMail),
      transporter.sendMail(sellerMail),
    ]);

    console.log(
      "Emails sent successfully. IDs:",
      info.messageId,
      messageToSeller.messageId
    );

    return {
      success: true,
      messageId: info.messageId,
      sellerMessageId: messageToSeller.messageId,
    };
  } catch (error) {
    console.error("Error sending order email:", error);
    return { success: false, error };
  }
};

export default sendOrderSuccessfulEmail;
