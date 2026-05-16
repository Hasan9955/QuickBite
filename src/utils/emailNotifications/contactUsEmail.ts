export const contactMessageTemplate = (
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message - Stay Halal</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4fafd; margin: 0; padding: 0; line-height: 1.6;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);">
    
    <!-- Header -->
    <div style="background-color: #4AA6BB; background-image: linear-gradient(135deg, #4AA6BB, #6FC3D5); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">
        📩 New Contact Message
      </h1>
      <p style="color: #e9f9fc; margin: 8px 0 0; font-size: 15px;">
        Stay Halal — Scan Products & Check Halal Status Instantly
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding: 24px 20px;">
      <p style="font-size: 17px; color: #333333; margin-bottom: 15px;">Assalamu Alaikum Admin,</p>
      <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">
        You have received a new contact inquiry from the <strong>Stay Halal</strong> app/website user.
      </p>
      
      <div style="background-color: #f2fafc; border-radius: 8px; padding: 20px; border: 1px solid #d5eef3;">
        <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
        
        <div style="background-color: #e8f7fa; border-left: 4px solid #4AA6BB; padding: 12px 16px; border-radius: 6px; margin-top: 6px; white-space: pre-wrap; font-size: 15px; color: #333333;">
          ${message}
        </div>
      </div>
      
      <p style="margin-top: 30px; font-size: 15px; color: #555;">
        You may respond directly to 
        <a href="mailto:${email}" style="color: #4AA6BB; text-decoration: none;">${email}</a>.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #dff1f5; padding: 12px; text-align: center; font-size: 12px; color: #666;">
      <p style="margin: 0;">© 2025 Stay Halal — Empowering Muslims to Make Halal & Ethical Product Choices.</p>
    </div>
  </div>
</body>
</html>`;
