// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailProps {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string;
}

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  total,
  paymentMethod,
}: OrderEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set. Skipping email.");
    return;
  }

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: #0A0A0A; padding: 30px; text-align: center;">
          <h1 style="color: #CCFF00; margin: 0; font-size: 24px;">GoalWear</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0A0A0A; margin-top: 0;">Order Confirmed! 🎉</h2>
          <p style="color: #555;">Hi ${customerName || "there"},</p>
          <p style="color: #555;">Thank you for your order! We've received your order and will process it shortly.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">Order ID: <strong>${orderId}</strong></p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #555;">Payment: <strong>${paymentMethod}</strong></p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 8px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase;">Item</th>
                <th style="padding: 8px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase;">Qty</th>
                <th style="padding: 8px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 8px; text-align: right; font-weight: bold; border-top: 2px solid #CCFF00;">Total</td>
                <td style="padding: 12px 8px; text-align: right; font-weight: bold; border-top: 2px solid #CCFF00;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <p style="color: #555;">You can track your order from your account page.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://goalwear-theta.vercel.app"}/orders" 
             style="display: inline-block; background: #CCFF00; color: #000; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            View My Orders
          </a>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999;">
          <p>Need help? Contact us at support@goalwear.com</p>
          <p>© 2026 GoalWear. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "GoalWear <onboarding@resend.dev>", // ডোমেইন ভেরিফাই করলে আপনার নিজের ইমেইল দিন
      to: [to],
      subject: `Order Confirmed - ${orderId}`,
      html,
    });

    if (error) {
      console.error("[Email] Failed to send:", error.message);
    } else {
      console.log(`[Email] ✅ Confirmation sent to ${to} for order ${orderId}`);
    }
  } catch (err: any) {
    console.error("[Email] Exception:", err.message);
  }
}