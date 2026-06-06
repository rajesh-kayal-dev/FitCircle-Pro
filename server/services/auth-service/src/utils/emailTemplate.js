export const getOTPEmailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f4f4f5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .header {
        background-color: #1a1a1a;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 40px 30px;
        text-align: center;
        color: #333333;
      }
      .content h2 {
        font-size: 22px;
        margin-top: 0;
        color: #1a1a1a;
      }
      .content p {
        font-size: 15px;
        line-height: 1.6;
        color: #666666;
      }
      .otp-box {
        background-color: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
      }
      .otp-code {
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 8px;
        color: #0f172a;
        margin: 0;
      }
      .footer {
        background-color: #fafafa;
        padding: 20px;
        text-align: center;
        border-top: 1px solid #eaeaea;
      }
      .footer p {
        font-size: 13px;
        color: #888888;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>FitCircle Pro</h1>
      </div>
      <div class="content">
        <h2>Verify your email</h2>
        <p>Please use the verification code below to securely sign in to your FitCircle Pro account.</p>
        
        <div class="otp-box">
          <p class="otp-code">${otp}</p>
        </div>
        
        <p><strong>This code expires in 5 minutes.</strong></p>
      </div>
      <div class="footer">
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} FitCircle Pro. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
