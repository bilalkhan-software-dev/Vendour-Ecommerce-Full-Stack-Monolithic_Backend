package com.vendor_marketplace.utils;

public class EmailSendingTemplate {

    public static String sendEmailForOTP(String firstName, String OTP) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #f2f2f3;
                            color: rgb(10, 115, 165);
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 5px 5px;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: rgb(10, 115, 165);
                            text-align: center;
                            margin: 20px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Email Verify OTP</h2>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>Thanks for choosing us. Please use the following OTP to proceed:</p>
                        <div class="otp">%s</div>
                        <p>Use this OTP when you Login</p>
                        <p>For security reasons, don't share this OTP with anyone.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Your Own Vendor. All rights reserved.</p>
                    </div>
                </body>
                </html>
                """.formatted(firstName, OTP);
    }

    public static String sendEmailForOTPWithFrontendUrl(String firstName, String OTP, String frontendUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #f2f2f3;
                            color: rgb(10, 115, 165);
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 5px 5px;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: rgb(10, 115, 165);
                            text-align: center;
                            margin: 20px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Email Verification OTP</h2>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>Thanks for choosing us. Please use the following OTP to proceed:</p>
                        <div class="otp">%s</div>
                        <p>Use this OTP when you login.</p>
                        <a href="%s" style="display:inline-block;padding:10px 20px;
                            background-color:#4CAF50;color:#fff;text-decoration:none;
                            border-radius:5px;margin:15px 0;">
                            Click here to verify email
                        </a>
                        <p>For security reasons, do not share this OTP with anyone.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Your Own Vendor. All rights reserved.</p>
                    </div>
                </body>
                </html>
                """.formatted(firstName, OTP, frontendUrl);
    }

    public static String sendWelcomeEmail(String firstName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: rgb(10, 115, 165);
                            color: white;
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 5px 5px;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Welcome to Your Own Vendor!</h2>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>We’re thrilled to have you on board 🎉</p>
                        <p>Thank you for choosing <strong>Your Own Vendor</strong>. We’re committed to bringing you the best online shopping experience with quality products and trusted sellers.</p>
                        <p>Start exploring amazing deals today!</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Your Own Vendor. All rights reserved.</p>
                    </div>
                </body>
                </html>
                """.formatted(firstName);
    }

    public static String sendOrderStatusUpdateEmail(
            String firstName,
            String orderId,
            String orderStatus,
            String sellerName,
            String sellerEmail,
            String userEmail
    ) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: rgb(10, 115, 165);
                            color: white;
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 5px 5px;
                        }
                        .status {
                            font-weight: bold;
                            color: #4CAF50;
                            text-transform: uppercase;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Order Update</h2>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>We wanted to update you about your recent order.</p>
                        <p><strong>Order ID:</strong> %s</p>
                        <p><strong>Current Status:</strong> <span class="status">%s</span></p>
                        <hr />
                        <h4>Seller Information:</h4>
                        <p><strong>Name:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <hr />
                        <h4>Your Information:</h4>
                        <p><strong>Name:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <p>Thank you for shopping with us. We appreciate your trust and patience!</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Your Own Vendor. All rights reserved.</p>
                    </div>
                </body>
                </html>
                """.formatted(firstName, orderId, orderStatus, sellerName, sellerEmail, firstName, userEmail);
    }
}
