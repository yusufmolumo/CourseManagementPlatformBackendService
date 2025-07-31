# Email Setup Guide for Course Management Platform

This guide will help you set up Nodemailer to send actual emails in your Course Management Platform.

## Prerequisites

1. **Gmail Account**: You'll need a Gmail account to send emails
2. **App Password**: You'll need to generate an app password for your Gmail account

## Step 1: Generate Gmail App Password

### For Gmail Users:

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Course Management Platform"
   - Copy the generated 16-character password

### Alternative: Use Gmail with "Less Secure Apps" (Not Recommended)
- Go to Google Account settings
- Security → Less secure app access
- Turn on "Allow less secure apps"

## Step 2: Update Your .env File

Add these email configuration variables to your `.env` file:

```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-gmail@gmail.com
```

**Replace the values with your actual Gmail credentials:**
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your 16-character app password
- `EMAIL_FROM`: Your Gmail address (same as EMAIL_USER)

## Step 3: Test Email Configuration

### Method 1: Using the Test API Endpoint

1. **Start your server**:
   ```bash
   npm start
   ```

2. **Start the notification worker**:
   ```bash
   npm run worker
   ```

3. **Login as a manager** to get a JWT token:
   ```bash
   POST /api/auth/login
   {
     "email": "manager@example.com",
     "password": "password123"
   }
   ```

4. **Test email sending**:
   ```bash
   POST /api/test/test-email
   Authorization: Bearer YOUR_JWT_TOKEN
   {
     "recipient": "test@example.com",
     "type": "reminder"
   }
   ```

### Method 2: Using the Weekly Reminder System

1. **Manually trigger the weekly reminder**:
   ```javascript
   // In your code or console
   const { checkAndRemind } = require('./src/jobs/weeklyReminder');
   checkAndRemind();
   ```

## Step 4: Email Types Available

The system sends three types of emails:

### 1. Reminder Emails (to Facilitators)
- **Triggered**: Weekly on Sundays at 6 PM
- **Content**: Reminds facilitators to submit activity logs
- **Recipients**: Facilitators who haven't submitted logs

### 2. Submission Alert Emails (to Managers)
- **Triggered**: When a facilitator submits an activity log
- **Content**: Notifies managers about new submissions
- **Recipients**: The manager of the submitting facilitator

### 3. Overdue Alert Emails (to Managers)
- **Triggered**: Weekly when facilitators miss deadlines
- **Content**: Alerts managers about overdue submissions
- **Recipients**: Managers of facilitators with overdue logs

## Step 5: Troubleshooting

### Common Issues:

1. **"Invalid login" Error**:
   - Check your app password is correct
   - Ensure 2FA is enabled
   - Verify Gmail address is correct

2. **"Connection timeout" Error**:
   - Check your internet connection
   - Verify EMAIL_HOST and EMAIL_PORT are correct
   - Try using port 465 with secure: true

3. **"Authentication failed" Error**:
   - Regenerate your app password
   - Make sure you're using the app password, not your regular password

### Alternative Email Providers:

If you don't want to use Gmail, you can use other providers:

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

#### Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

#### Custom SMTP Server:
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
```

## Step 6: Production Considerations

For production use, consider:

1. **Email Service Providers**:
   - SendGrid
   - Mailgun
   - AWS SES
   - Postmark

2. **Email Templates**:
   - Customize email templates in `src/services/emailService.js`
   - Add your organization's branding
   - Include unsubscribe links

3. **Rate Limiting**:
   - Implement rate limiting for email sending
   - Respect email provider limits

4. **Error Handling**:
   - Log email failures
   - Implement retry mechanisms
   - Set up monitoring

## Step 7: Security Best Practices

1. **Never commit .env files** to version control
2. **Use environment variables** for all sensitive data
3. **Regularly rotate** app passwords
4. **Monitor email sending** for unusual activity
5. **Implement email validation** before sending

## Testing Your Setup

After configuration, test the complete flow:

1. **Create a course offering** (as manager)
2. **Submit an activity log** (as facilitator)
3. **Check for submission alert email** (sent to manager)
4. **Wait for weekly reminder** or trigger manually
5. **Check for reminder emails** (sent to facilitators)

The system will now send actual emails to real email addresses! 