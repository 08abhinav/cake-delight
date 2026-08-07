import "dotenv/config";
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendVerificationOtp = async (email, otp) => {
  try {
    // if (process.env.MOCK_EMAIL_FAILURE === 'true') {
    //   throw new Error('[TEST MODE] Simulated Brevo Email Outage');
    // }
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.SENDER_NAME || 'My App',
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email }],
      subject: 'Verify your email address',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up! Use the code below to verify your email address:</p>
          <div style="background: #f4f4f5; padding: 12px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 15px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    return result;
  } catch (error) {
    console.error('Brevo Email Error:', error);
    throw new Error('Failed to send verification email');
  }
};