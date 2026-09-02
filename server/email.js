import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'hasnaintahir605@gmail.com';
const GMAIL_USER = process.env.SMTP_USER || 'hasnaintahir605@gmail.com';
const GMAIL_APP_PASS = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'xips wfpv qrcz rjla').replace(/\s+/g, '');

/**
 * Creates or retrieves a nodemailer transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = GMAIL_USER;
  const pass = GMAIL_APP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Gmail direct service with app password
  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  // Fallback json / stream transporter for preview & logging
  return nodemailer.createTransport({
    jsonTransport: true
  });
}

/**
 * Sends order notification email to store admin (hasnaintahir605@gmail.com)
 * and customer order confirmation.
 */
export async function sendOrderNotificationEmail(order) {
  try {
    const transporter = getTransporter();

    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #f0ebe4;">
        <td style="padding: 12px 8px; vertical-align: top;">
          ${item.product?.images?.[0] ? `<img src="${item.product.images[0]}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 10px; vertical-align: middle;" />` : ''}
          <strong style="color: #1c1917; font-size: 14px;">${item.product?.name || item.name || 'Luxury Gift'}</strong>
          ${item.customText ? `<br><small style="color: #b45309; font-weight: 600;">Custom Engraving: "${item.customText}"</small>` : ''}
          ${item.giftMessage ? `<br><small style="color: #78716c; font-style: italic;">Gift Message: "${item.giftMessage}"</small>` : ''}
          ${item.wrappingOption ? `<br><small style="color: #e11d48;">Packaging: ${item.wrappingOption}</small>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #44403c; font-weight: 600;">${item.quantity || 1}</td>
        <td style="padding: 12px 8px; text-align: right; color: #1c1917; font-weight: 700;">$${((item.price || item.product?.discountPrice || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="max-width: 620px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fafaf9; padding: 24px; border-radius: 16px; border: 1px solid #e7e5e4;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e11d48;">
          <h1 style="color: #1c1917; font-size: 26px; margin: 0; font-family: Georgia, serif; letter-spacing: 1px;">BLUSH BOX</h1>
          <p style="color: #e11d48; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0; font-weight: 700;">Haute Gifting Maison • New Order Alert</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #f5f5f4;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600;">Order ID</span>
              <h2 style="margin: 2px 0 0 0; color: #e11d48; font-size: 20px; font-weight: bold;">${order.orderNumber || order._id}</h2>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600;">Date</span>
              <p style="margin: 2px 0 0 0; color: #1c1917; font-size: 13px;">${new Date().toLocaleString()}</p>
            </div>
          </div>

          <div style="background-color: #fdf2f8; border-left: 4px solid #f43f5e; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; color: #881337; font-size: 14px; font-weight: 600;">
              ✨ New customer purchase received on Blush Box store!
            </p>
          </div>

          <h3 style="color: #1c1917; font-size: 15px; border-bottom: 1px solid #f5f5f4; padding-bottom: 8px; margin-top: 0;">Customer Information</h3>
          <p style="margin: 4px 0; color: #292524; font-size: 14px;"><strong>Name:</strong> ${order.customer?.name || 'Customer'}</p>
          <p style="margin: 4px 0; color: #292524; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${order.customer?.email}" style="color: #e11d48;">${order.customer?.email}</a></p>
          <p style="margin: 4px 0; color: #292524; font-size: 14px;"><strong>Phone:</strong> ${order.customer?.phone || 'Not provided'}</p>
          <p style="margin: 4px 0; color: #292524; font-size: 14px;"><strong>Shipping Address:</strong> ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''} (${order.shippingAddress?.country || ''})</p>

          <h3 style="color: #1c1917; font-size: 15px; border-bottom: 1px solid #f5f5f4; padding-bottom: 8px; margin-top: 24px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
            <thead>
              <tr style="background-color: #fafaf9; text-align: left; color: #78716c; font-size: 11px; text-transform: uppercase;">
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 2px solid #f5f5f4;">
            <table style="width: 100%; font-size: 13px; color: #44403c;">
              <tr>
                <td style="padding: 4px 0;">Subtotal:</td>
                <td style="text-align: right; font-weight: 600;">$${Number(order.subtotal || 0).toFixed(2)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #16a34a;">Discount (${order.couponCode || 'PROMO'}):</td>
                <td style="text-align: right; color: #16a34a; font-weight: 600;">-$${Number(order.discount).toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 4px 0;">Shipping (${order.shippingMethod || 'Express White-Glove'}):</td>
                <td style="text-align: right; font-weight: 600;">$${Number(order.shippingFee || 0).toFixed(2)}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; color: #1c1917; border-top: 1px solid #e7e5e4;">
                <td style="padding: 10px 0;">Grand Total:</td>
                <td style="text-align: right; color: #e11d48;">$${Number(order.grandTotal || 0).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #78716c;">Payment Method: <strong>${order.paymentMethod || 'Credit Card / Apple Pay'}</strong> • Status: <strong>${order.paymentStatus || 'Paid'}</strong></p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #a8a29e;">
          <p>© ${new Date().getFullYear()} Blush Box. All rights reserved. Notification sent to ${ADMIN_EMAIL}</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Blush Box Store Alerts" <${process.env.SMTP_FROM || 'orders@blushbox.com'}>`,
      to: ADMIN_EMAIL,
      cc: order.customer?.email,
      subject: `🛍️ New Order Received: #${order.orderNumber} - $${Number(order.grandTotal).toFixed(2)} from ${order.customer?.name || 'Customer'}`,
      text: `New Order #${order.orderNumber} received from ${order.customer?.name} (${order.customer?.email}). Total: $${Number(order.grandTotal).toFixed(2)}`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(` Order notification dispatched successfully to ${ADMIN_EMAIL} for Order ${order.orderNumber}!`, info.messageId || info);

    return {
      success: true,
      sentTo: ADMIN_EMAIL,
      orderNumber: order.orderNumber,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(" Error dispatching order notification email to admin:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
