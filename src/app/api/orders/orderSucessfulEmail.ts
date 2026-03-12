import nodemailer from "nodemailer";

export const maxDuration = 30;

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

const sendOrderSuccessfulEmail = async ({
  email,
  items,
  name,
}: OrderEmailParams) => {
  // 1. Calculations & HTML construction (Keep as is)
  const tableRows = items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₦${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
    </tr>`,
    )
    .join("");

  const total = items.reduce(
    (sum, item) => sum + item.price * Number(item.quantity),
    0,
  );
  const finalHtml = `<table style="width:100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif;">...${tableRows}...</table>`; // (Keep your existing table template here)

  // 2. Transporter created INSIDE the function for Serverless reliability
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const customerMail = {
    from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
    to: email,
    subject: "Order Successful - Classy Choice Stores",
    html: `<div style="font-family: sans-serif;"><h2>Order Confirmed</h2>${finalHtml}</div>`,
  };

  const sellerMail = {
    from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>',
    to: "classychoicevarietiesstores@gmail.com",
    subject: "New Order Received!",
    html: `<div style="font-family: sans-serif;"><h2>New Order Alert</h2><p>Customer: ${name}</p>${finalHtml}</div>`,
  };

  // 3. The "Manual Promise" with Callback wrapper
  return new Promise((resolve, reject) => {
    console.log("Attempting to send emails...");

    // We send them sequentially to ensure the connection stays active
    // and doesn't get flooded in a limited serverless environment
    transporter.sendMail(customerMail, (err, info) => {
      if (err) {
        console.error("Customer Email Error:", err);
        return resolve({ success: false, error: err });
      }

      console.log("Customer email sent, sending seller alert...");

      transporter.sendMail(sellerMail, (err2, info2) => {
        if (err2) {
          console.error("Seller Email Error:", err2);
          return resolve({ success: false, error: err2 });
        }

        console.log("All emails sent successfully!");
        resolve({ success: true, messageId: info.messageId });
      });
    });
  });
};

export default sendOrderSuccessfulEmail;
