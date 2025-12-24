# EmailJS Setup Guide

The commission form is configured to send emails to **gregory.gfx1@gmail.com** using EmailJS.

## Setup Steps:

### 1. Create EmailJS Account

- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account (supports 200 emails/month)

### 2. Add Email Service

- In EmailJS dashboard, go to **Email Services**
- Click **Add New Service**
- Choose **Gmail** (or any email service you prefer)
- Connect your **gregory.gfx1@gmail.com** account
- Note down the **Service ID** (something like `service_xxxxxxx`)

### 3. Create Email Template

- Go to **Email Templates**
- Click **Create New Template**
- Use this template structure:

**Template Name:** `commission_form`

**Subject:** `New Commission Request from {{from_name}}`

**Content:**

```
New commission request received!

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
Sent from Portfolio Website
```

- Make sure the template includes these variables:

  - `{{from_name}}`
  - `{{from_email}}`
  - `{{message}}`
  - `{{to_email}}`

- Set **To Email** field to: `{{to_email}}` or directly to `gregory.gfx1@gmail.com`
- Note down the **Template ID** (something like `template_xxxxxxx`)

### 4. Get Public Key

- Go to **Account** → **General**
- Find your **Public Key** (something like `xxxxxxxxxxxxxxxxxx`)

### 5. Update Footer.jsx

Open `/src/components/Footer.jsx` and replace these placeholders around line 40:

```javascript
const serviceID = "YOUR_SERVICE_ID"; // Replace with your Service ID
const templateID = "YOUR_TEMPLATE_ID"; // Replace with your Template ID
const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your Public Key
```

With your actual values:

```javascript
const serviceID = "service_xxxxxxx"; // Your Service ID
const templateID = "template_xxxxxxx"; // Your Template ID
const publicKey = "xxxxxxxxxxxxxxxxxx"; // Your Public Key
```

### 6. Test the Form

- Fill out the commission form on your website
- Check if email arrives at gregory.gfx1@gmail.com
- Check EmailJS dashboard for delivery status

## Troubleshooting:

- **Emails not arriving?** Check your EmailJS dashboard for errors
- **Quota exceeded?** Free plan has 200 emails/month limit
- **Spam folder?** Check spam folder for first few emails
- **Template issues?** Make sure all variable names match exactly

## Security Note:

The Public Key is safe to expose in client-side code. EmailJS requires it to work from the browser and it only allows sending emails through your configured templates (prevents abuse).
