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
const sendOrderSuccessfulEmail = async ({ email }: { email: string }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Classy Choice Stores" <classychoicevarietiesstores@gmail.com>', // Professional sender format
      to: email,
      subject: "Order Successful",
      text: "Your order has been placed successfully.",
      html: "<strong>Your order has been placed successfully!</strong>",
    });

    console.log("Email sent successfully to: %s", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending order email:", error);
    // You might want to log this to a service like Sentry
    return { success: false, error };
  }
};

export default sendOrderSuccessfulEmail;
