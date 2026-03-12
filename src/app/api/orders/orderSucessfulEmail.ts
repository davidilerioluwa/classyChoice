import nodemailer from "nodemailer";

export const maxDuration = 30; // Critical for Vercel

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
 * Sends a success email to the customer and the seller.
 * Optimized specifically for Vercel Serverless environment.
 */
const sendOrderSuccessfulEmail = async ({
  email,
  items,
  name,
}: OrderEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: any;
}> => {
  // 1. Build Table Rows
  const tableRows = items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity} units</td>
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

  // 3. Construct HTML Template
  const finalHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="text-align: center; color: #346df1;">Classy Choice Varieties Store</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your order has been placed successfully! Here are your details:</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
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
          <tr style="font-weight: bold;">
            <td colspan="3" style="text-align: right; padding: 10px; border: 1px solid #ddd;">Total:</td>
            <td style="padding: 10px; border: 1px solid #ddd; color: #d9534f;">₦${total.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
              },
            )}</td>
          </tr>
        </tfoot>
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
        If you have any questions, please reply to this email.
      </p>
    </div>
  `;

  // 4. Initialize Transporter INSIDE function for fresh connection on every Vercel call
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Prevents handshake issues in cloud environments
    },
  });

  const customerMail = {
    from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
    to: email,
    subject: `Order Confirmed: ${name}, your Classy Choice order is successful!`,
    html: finalHtml,
  };

  const sellerMail = {
    from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
    to: "classychoicevarietiesstores@gmail.com",
    subject: "🚨 NEW ORDER RECEIVED - Classy Choice Stores",
    html: `<p><strong>Alert:</strong> New order from ${name} (${email})</p>${finalHtml}`,
  };

  // 5. Sequential Send Pattern (Most stable for Serverless)
  return new Promise((resolve) => {
    console.log("Classy Choice: Starting email delivery sequence...");

    transporter.sendMail(customerMail, (error, info) => {
      if (error) {
        console.error("Vercel Log - Customer Email Failed:", error);
        return resolve({ success: false, error });
      }

      console.log(
        "Vercel Log - Customer Email Sent. Now sending seller notification...",
      );

      transporter.sendMail(sellerMail, (error2, info2) => {
        if (error2) {
          console.error("Vercel Log - Seller Email Failed:", error2);
          // We still return true for success here because the customer at least got their email
          return resolve({ success: true, messageId: info.messageId });
        }

        console.log("Vercel Log - All emails dispatched successfully!");
        resolve({ success: true, messageId: info.messageId });
      });
    });
  });
};

export default sendOrderSuccessfulEmail;
