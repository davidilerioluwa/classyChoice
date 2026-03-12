import nodemailer from "nodemailer";
export const maxDuration = 30; // Extend to 30 seconds
/**
 * TRANSPORTER CONFIGURATION
 * Note: Pooling is disabled for Vercel/Serverless to prevent handshake errors.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // TLS settings improve reliability on cloud hosting
  tls: {
    rejectUnauthorized: false,
  },
});

interface OrderItem {
  productId: string;
  quantity: string;
  title: string;
  price: number;
}

interface OrderEmailParams {
  email: string;
  name: string;
  items: OrderItem[];
}

/**
 * Sends a success email to the customer and the seller after an order is placed.
 */
const sendOrderSuccessfulEmail = async ({
  email,
  items,
  name,
}: OrderEmailParams) => {
  // 1. Build Table Rows
  const tableRows = items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₦${item.price.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 },
      )}</td>
    </tr>`,
    )
    .join("");

  // 2. Calculate Total
  const total = items.reduce(
    (sum, item) => sum + item.price * Number(item.quantity),
    0,
  );

  // 3. Construct HTML
  const finalHtml = `
    <table style="width:100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif;">
      <thead>
        <tr style="text-align: left; background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">S/N</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
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
    console.log("Starting email process on Vercel...");

    // 4. Force a connection check (Crucial for Vercel)
    await transporter.verify();

    const customerMail = {
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
      to: email,
      subject: "Order Successful - Classy Choice Stores",
      text: `Hi ${name}, your order has been placed successfully.`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #346df1;">Classy Choice Varieties Store</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your order has been placed successfully! Here are your order details:</p>
          ${finalHtml}
          <p style="margin-top: 20px;">Thank you for shopping with us!</p>
        </div>
      `,
    };

    const sellerMail = {
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
      to: "classychoicevarietiesstores@gmail.com",
      subject: "New Order Received!",
      text: `An order has been placed by ${name}.`,
      html: `
        <div style="font-family: sans-serif;">
          <h2 style="color: #d9534f;">New Order Alert!</h2>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${finalHtml}
          <p style="margin-top: 20px;">Please check the admin panel to process this order.</p>
        </div>
      `,
    };

    return new Promise((resolve) => {
      transporter.verify(async (error) => {
        if (error) {
          console.error("Vercel Connection Error:", error);
          return resolve({ success: false, error });
        }

        try {
          const [info] = await Promise.all([
            transporter.sendMail(customerMail),
            transporter.sendMail(sellerMail),
          ]);
          console.log("Emails sent!", info.messageId);
          resolve({ success: true, messageId: info.messageId });
        } catch (sendError) {
          console.error("Vercel Send Error:", sendError);
          resolve({ success: false, error: sendError });
        }
      });
    });
  } catch (error) {
    console.error("Critical Error sending order email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

export default sendOrderSuccessfulEmail;
