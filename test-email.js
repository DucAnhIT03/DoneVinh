const nodemailer = require('nodemailer');

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ducanhinformationtechnology@gmail.com',
    pass: 'yagpsurkvveqatte'
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: 'ducanhinformationtechnology@gmail.com',
      to: 'test@example.com',
      subject: 'Test Email từ Bus Ticket API',
      html: `
        <h1>Xin chào!</h1>
        <p>Đây là email test từ Bus Ticket API.</p>
        <p>Nếu bạn nhận được email này, nghĩa là cấu hình SMTP đã thành công!</p>
        <p>Thời gian: ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email đã gửi thành công!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error.message);
    console.log('\n🔧 Hướng dẫn sửa lỗi:');
    console.log('1. Kiểm tra email và password trong file test-email.js');
    console.log('2. Đảm bảo đã bật 2FA và tạo App Password cho Gmail');
    console.log('3. Kiểm tra kết nối internet');
  }
}

// Chạy test
sendTestEmail();
