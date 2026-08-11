import "dotenv/config";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

export const sendOrderConfirmation = async (email, items, totalAmount, estimatedDeliveryTime, paymentStatus, paymentType) => {
    try {
        const itemsHtml = items
            .map(
                (item) => `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                            ${item.productName}
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">
                            ${item.quantity}
                        </td>
                    </tr>
                `
            )
            .join("");

        const formattedDeliveryDate = new Date(
            estimatedDeliveryTime
        ).toLocaleString();

        const result =
            await brevo.transactionalEmails.sendTransacEmail({
                sender: {
                    name: process.env.SENDER_NAME || "Cake Shop",
                    email: process.env.SENDER_EMAIL
                },

                to: [
                    {
                        email
                    }
                ],

                subject: "Your order has been placed successfully",

                htmlContent: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                    ">
                        <h2>
                            Order Confirmed 
                        </h2>

                        <p>
                            Thank you for your order! Your order has been
                            placed successfully.
                        </p>

                        <h3>Order Details</h3>

                        <table style="
                            width: 100%;
                            border-collapse: collapse;
                        ">
                            <thead>
                                <tr>
                                    <th style="
                                        text-align: left;
                                        padding: 10px;
                                        border-bottom: 2px solid #ddd;
                                    ">
                                        Product
                                    </th>

                                    <th style="
                                        text-align: center;
                                        padding: 10px;
                                        border-bottom: 2px solid #ddd;
                                    ">
                                        Quantity
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>

                        <h3>
                            Total Amount: ₹${totalAmount}
                        </h3>

                        <p>
                            <strong>Payment Type:</strong>
                            ${paymentType}
                        </p>

                        <p>
                            <strong>Payment Status:</strong>
                            ${paymentStatus}
                        </p>

                        <p>
                            <strong>Estimated Delivery:</strong>
                            ${formattedDeliveryDate}
                        </p>

                        <hr />

                        <p style="
                            color: #666;
                            font-size: 13px;
                        ">
                            Thank you for shopping with us!
                        </p>
                    </div>
                `
            });

        console.log("Order confirmation email sent");
        return result;
    } catch (error) {
        console.error(
            "Brevo Email Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};