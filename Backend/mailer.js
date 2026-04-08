import nodemailer from 'nodemailer';
import { Student } from './models/Student.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.warn('SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will be logged only.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: port === '465',
    auth: { user, pass },
  });
  return transporter;
}

export async function sendProductReleaseNotification(product, toEmail, toName = '') {
  const subject = `New product: ${product.name} – Campus Threads Co.`;
  const html = `
    <h2>New product just dropped</h2>
    <p>Hi${toName ? ` ${toName}` : ''},</p>
    <p><strong>${product.name}</strong> is now available on Campus Threads Co.</p>
    <p>Price: ₹${product.price}</p>
    <p>Category: ${product.category} – ${product.subcategory}</p>
    ${product.description ? `<p>${product.description}</p>` : ''}
    <p><a href="${process.env.APP_URL || 'http://localhost:8080'}">Shop now</a></p>
    <p>– Campus Threads Co.</p>
  `;
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@campusthreads.com';

  const transport = getTransporter();
  if (transport) {
    await transport.sendMail({
      from,
      to: toEmail,
      subject,
      html,
    });
    return { sent: true };
  }
  console.log('[Mail not configured] Would send to', toEmail, ':', subject);
  return { sent: false, simulated: true };
}

export async function notifyStudentsOfNewProduct(product) {
  const students = await Student.find({}).lean();
  const results = { sent: 0, failed: 0 };
  for (const s of students) {
    try {
      const r = await sendProductReleaseNotification(product, s.email, s.name);
      if (r.sent) results.sent++;
      else if (r.simulated) results.sent++;
    } catch (err) {
      console.error('Email failed for', s.email, err.message);
      results.failed++;
    }
  }
  return results;
}

export async function sendBroadcastNotification(subject, messageHtml, toEmail, toName = '') {
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@campusthreads.com';
  const html = `
    <p>Hi${toName ? ` ${toName}` : ''},</p>
    ${messageHtml}
    <p><a href="${process.env.APP_URL || 'http://localhost:8080'}">Visit Campus Threads Co.</a></p>
  `;

  const transport = getTransporter();
  if (transport) {
    await transport.sendMail({
      from,
      to: toEmail,
      subject,
      html,
    });
    return { sent: true };
  }
  console.log('[Mail not configured] Would broadcast to', toEmail, ':', subject);
  return { sent: false, simulated: true };
}

export async function notifyStudentsBroadcast(subject, messageHtml) {
  const students = await Student.find({}).lean();
  const results = { sent: 0, failed: 0 };
  for (const s of students) {
    try {
      const r = await sendBroadcastNotification(subject, messageHtml, s.email, s.name);
      if (r.sent) results.sent++;
      else if (r.simulated) results.sent++;
    } catch (err) {
      console.error('Broadcast failed for', s.email, err.message);
      results.failed++;
    }
  }
  return results;
}

const STATUS_LABELS = {
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

function buildTrackingBar(currentStatus) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus);
  return STATUS_STEPS.map((s, i) => {
    const done = i <= currentIdx;
    const color = done ? '#6366f1' : '#d1d5db';
    const textColor = done ? '#6366f1' : '#9ca3af';
    return `<td style="text-align:center;padding:4px 8px;">
      <div style="width:28px;height:28px;border-radius:50%;background:${color};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;">${i + 1}</div>
      <div style="font-size:11px;color:${textColor};margin-top:4px;">${STATUS_LABELS[s]}</div>
    </td>`;
  }).join('');
}

export async function sendOrderConfirmation(order) {
  const appUrl = process.env.APP_URL || 'http://localhost:8080';
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@campusthreads.com';
  const toEmail = order.userDetails.email;
  const toName = order.userDetails.name;

  const itemRows = (order.items || []).map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.size || '-'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price * item.quantity}</td>
    </tr>`
  ).join('');

  const customRows = (order.customItems || []).map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.clubName || 'Custom'} – ${item.productType || ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.size || '-'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${item.price * item.quantity}</td>
    </tr>`
  ).join('');

  const subject = `Order Confirmed – ${order.orderId} | Campus Threads Co.`;
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🎉 Order Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Thank you for your order, ${toName}!</p>
      </div>
      <div style="padding:24px;">
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Order ID</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${order.orderId}</p>
        </div>
        <h3 style="margin:0 0 12px;font-size:15px;color:#374151;">Order Summary</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:8px;text-align:left;color:#6b7280;font-weight:600;">Item</th>
              <th style="padding:8px;text-align:left;color:#6b7280;font-weight:600;">Size</th>
              <th style="padding:8px;text-align:center;color:#6b7280;font-weight:600;">Qty</th>
              <th style="padding:8px;text-align:right;color:#6b7280;font-weight:600;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}${customRows}
          </tbody>
        </table>
        <div style="text-align:right;margin-top:12px;padding-top:12px;border-top:2px solid #6366f1;">
          <span style="font-size:18px;font-weight:700;color:#6366f1;">Total: ₹${order.totalPrice}</span>
        </div>
        <div style="margin-top:24px;">
          <h3 style="margin:0 0 12px;font-size:15px;color:#374151;">Tracking Status</h3>
          <table style="width:100%;"><tr>${buildTrackingBar('confirmed')}</tr></table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${appUrl}/orders" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Track Your Order</a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
        Campus Threads Co. – Medicaps University
      </div>
    </div>
  `;

  const transport = getTransporter();
  if (transport) {
    await transport.sendMail({ from, to: toEmail, subject, html });
    return { sent: true };
  }
  console.log('[Mail not configured] Would send order confirmation to', toEmail, ':', subject);
  return { sent: false, simulated: true };
}

export async function sendOrderStatusUpdate(order, newStatus) {
  const appUrl = process.env.APP_URL || 'http://localhost:8080';
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@campusthreads.com';
  const toEmail = order.userDetails.email;
  const toName = order.userDetails.name;

  const statusMessages = {
    processing: 'Your order is now being prepared! Our team is working on it.',
    shipped: 'Great news! Your order has been shipped and is on its way.',
    out_for_delivery: 'Your order is out for delivery! It will reach you shortly.',
    delivered: 'Your order has been delivered! We hope you love it. 🎉',
  };

  const subject = `Order Update – ${STATUS_LABELS[newStatus]} | ${order.orderId}`;
  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">📦 Order Update</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Hi ${toName}, here's the latest on your order.</p>
      </div>
      <div style="padding:24px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px;text-align:center;">
          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Current Status</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#16a34a;">${STATUS_LABELS[newStatus]}</p>
        </div>
        <p style="color:#374151;font-size:14px;line-height:1.6;">${statusMessages[newStatus] || ''}</p>
        <div style="background:#f8fafc;border-radius:8px;padding:12px 16px;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#6b7280;">Order ID: <strong style="color:#111827;font-family:monospace;">${order.orderId}</strong></p>
          <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Total: <strong style="color:#111827;">₹${order.totalPrice}</strong></p>
        </div>
        <div style="margin-top:20px;">
          <table style="width:100%;"><tr>${buildTrackingBar(newStatus)}</tr></table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="${appUrl}/orders" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Full Tracking</a>
        </div>
      </div>
      <div style="background:#f9fafb;padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;">
        Campus Threads Co. – Medicaps University
      </div>
    </div>
  `;

  const transport = getTransporter();
  if (transport) {
    await transport.sendMail({ from, to: toEmail, subject, html });
    return { sent: true };
  }
  console.log('[Mail not configured] Would send status update to', toEmail, ':', subject);
  return { sent: false, simulated: true };
}
