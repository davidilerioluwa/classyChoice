import nodemailer from "nodemailer";

// Initialize the transporter once (outside the function) to reuse the connection
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Sends a success email to the customer after an order is placed.
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
    .map((item, index) => {
      return `
    <tr>
      <td>${index + 1}</td>
      <td>${item.title}</td>
      <td>${item.quantity}</td>
      <td>₦${item.price.toFixed(2)}</td>
    </tr>`;
    })
    .join("");

  const total = items.reduce(
    (sum, item) => sum + item.price * Number(item.quantity),
    0
  );
  const finalHtml = `

  <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
    <thead>
      <tr style="text-align: left; border-bottom: 1px solid #ccc;">
        <th>S/N</th>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
    <tfoot>
      <tr style="font-weight: bold; border-top: 2px solid #000;">
        <td colspan="3" style="text-align: right;">Total:</td>
        <td>₦${total.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>
`;

  try {
    const info = await transporter.sendMail({
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>', // Professional sender format
      to: email,
      subject: "Order Successful",
      text: "Your order has been placed successfully.",
      html:
        `  <strong>Your order has been placed successfully!</strong>` +
        finalHtml,
    });
    const messageToSeller = await transporter.sendMail({
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>', // Professional sender format
      to: "davidilerioluwa1998@gmail.com",
      subject: "Order Successful",
      text: "Your order has been placed successfully.",
      html:
        `  <strong>An order has sucessfully been Placed by </strong>` +
        name +
        // `<br/>Email Address: ${email}` +
        finalHtml +
        `. <br/> Please check the admin panel to process the order.`,
    });
    console.log("Email sent successfully to: %s", email);
    return {
      success: true,
      messageId: info.messageId,
      sellerMessageId: messageToSeller.messageId,
    };
  } catch (error) {
    console.error("Error sending order email:", error);
    // You might want to log this to a service like Sentry
    return { success: false, error };
  }
};

export default sendOrderSuccessfulEmail;
