export const accountCreationEmail = (email: string, password: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Created Successfully</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f8;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                overflow: hidden;
            }
            .top-banner {
                background-color: #4caf50;
                color: white;
                text-align: center;
                padding: 12px 20px;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            .header {
                background-color: #e8f5e9;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #4caf50;
                font-weight: 600;
            }
            .content {
                padding: 30px 24px;
                text-align: center;
            }
            .content p {
                font-size: 17px;
                margin: 12px 0;
                color: #444;
            }
            .credentials {
                margin: 24px 0;
                background-color: #f9f9f9;
                border: 1px dashed #4caf50;
                padding: 16px;
                border-radius: 8px;
            }
            .credentials p {
                margin: 6px 0;
                font-size: 16px;
            }
            .credentials strong {
                color: #4caf50;
            }
            .btn-group {
                margin-top: 24px;
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            .store-badge {
                display: inline-block;
                text-decoration: none;
            }
            .store-badge img {
                height: 50px;
                border-radius: 8px;
                transition: transform 0.2s ease;
            }
            .store-badge img:hover {
                transform: scale(1.05);
            }
            .footer {
                border-top: 1px solid #e0e0e0;
                padding: 20px;
                font-size: 13px;
                color: #999;
                text-align: center;
                background-color: #fafafa;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="top-banner">
                Account Created Successfully
            </div>
            <div class="header">
                <h1>Welcome to VMTA!</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>We are thrilled to let you know that your account has been created!</p>
                <p>Use the credentials below to log in and get started:</p>
                <div class="credentials">
                    <p>Email: <strong>${email}</strong></p>
                    <p>Password: <strong>${password}</strong></p>
                </div>
                <p>Please download our app and log in to explore all the features.</p>
                <div class="btn-group">
                    <a href="https://play.google.com/store/apps/details?id=com.building_management.user" class="store-badge">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">
                    </a>
                    <a href="https://apps.apple.com/us/app/probanesa-building-manager/id6748986825" class="store-badge">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store">
                    </a>
                </div>
            </div>
            <div class="footer">
                <p>Thank you for choosing our service.</p>
                <p>© 2025 VMTA. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;
};
