# EmailJS Setup Guide

This guide explains how to set up EmailJS to make the contact form functional.

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. Go to the **Email Services** section in your dashboard
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### For Gmail:
1. Select **Gmail**
2. Click **Connect Account**
3. Sign in with your Gmail account
4. Allow EmailJS permissions
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates** section
2. Click **Create New Template**
3. Use this template content:

### Template Settings:
- **Template Name**: Contact Form
- **Subject**: `New message from {{from_name}} - {{subject}}`

### Template Content:
```
Hello,

You have received a new message from your portfolio contact form:

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website.
Reply to: {{reply_to}}
```

4. Save the template and copy the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** section
2. Find your **Public Key** (e.g., `user_abcdef123456`)
3. Copy this key

## Step 5: Update Environment Variables

Add these to your `.env` file:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_abcdef123456
```

Replace the values with your actual IDs from EmailJS.

## Step 6: Test the Contact Form

1. Restart your development server: `npm run dev`
2. Go to the contact form on your website
3. Fill out and submit the form
4. Check your email for the message

## Troubleshooting

### Common Issues:

#### 1. "Failed to send message"
- Check that all environment variables are set correctly
- Verify the Service ID, Template ID, and Public Key
- Make sure your email service is connected properly

#### 2. "Demo Mode" message
- This means the environment variables are not set
- Check your `.env` file and restart the server

#### 3. Emails not received
- Check your spam folder
- Verify the email template is set up correctly
- Make sure the email service is active

#### 4. Rate Limiting
- EmailJS free plan allows 200 emails/month
- Upgrade to paid plan for higher limits

## EmailJS Limits

### Free Plan:
- 200 emails per month
- 2 email services
- 1 email template
- EmailJS branding in emails

### Paid Plans:
- Higher email limits
- Remove EmailJS branding
- Priority support
- Advanced features

## Security Notes

- Never commit your `.env` file to version control
- The Public Key is safe to expose (it's meant to be public)
- Service ID and Template ID are also safe to expose
- Keep your EmailJS account credentials secure

## Alternative Email Services

If you prefer other solutions:

### 1. Formspree
- Simple form handling service
- Free tier available
- Easy integration

### 2. Netlify Forms
- Built into Netlify hosting
- Automatic spam protection
- Form submissions in dashboard

### 3. Custom Backend
- Build your own email API
- Full control over functionality
- Requires backend development

## Production Deployment

When deploying to production:

1. **Vercel**: Add environment variables in project settings
2. **Netlify**: Add environment variables in site settings
3. **Other hosts**: Follow their environment variable setup

The contact form will automatically work in production once the environment variables are set!

## Testing Template

Use this test data to verify your setup:

- **Name**: Test User
- **Email**: test@example.com
- **Subject**: Testing Contact Form
- **Message**: This is a test message to verify the contact form is working correctly.

You should receive an email with this information formatted according to your template.
