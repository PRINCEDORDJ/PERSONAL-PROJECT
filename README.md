
# Integrating Supabase and EmailJS into your Portfolio

This guide will walk you through the steps to integrate Supabase for database storage and EmailJS for sending emails into your personal portfolio website.

## 1. Getting your Supabase Credentials

Supabase will be used to store the messages sent from your contact form.

1.  **Create a Supabase Project:** If you haven't already, go to [supabase.com](https://supabase.com), create an account, and start a new project.
2.  **Create a Table:** In your Supabase project, go to the "Table Editor" and create a new table. You can name it `Messages` and add columns for `name` (text), `email` (text), and `message` (text).
    *   **Set a default value for the `id` column:**
        *   In the table editor, with the `Messages` table selected, find the `id` column.
        *   Click the dropdown menu next to the column name and select **Edit column**.
        *   In the **Default Value** field, enter `uuid_generate_v4()`.
        *   Click **Save**.
3.  **Enable Row Level Security (RLS) for Insertions:** To allow your contact form to insert data into the `Messages` table, you need to create a security policy.
    *   In your Supabase project, go to the **Authentication** icon (a shield) on the left sidebar, then select **Policies**.
    *   Select your `Messages` table.
    *   Click on **New Policy**.
    *   Choose **For full customization**.
    *   For the **Policy Name**, enter a descriptive name like `Allow public insert`.
    *   For **Allowed operation**, select `INSERT`.
    *   For the **USING expression**, enter `true`.
    *   For the **WITH CHECK expression**, enter `true`.
    *   Click **Review** and then **Save policy**.
4.  **Find your API Keys:**
    *   On the left sidebar of your Supabase project, click on the **Settings** icon (the gear icon).
    *   In the "Project Settings" page, click on **API**.
    *   Under "Project API keys", you will find your **Project URL** and your `anon` **public key**. You will need these for the next steps.

## 2. Getting your EmailJS Credentials

EmailJS will be used to send the form data to your email address.

1.  **Create an EmailJS Account:** If you don't have one, sign up at [emailjs.com](https://emailjs.com).
2.  **Add an Email Service:**
    *   In your EmailJS dashboard, click on **Email Services**.
    *   Click on **Add New Service** and choose your email provider (e.g., Gmail).
    *   Follow the instructions to connect your email account.
    *   Note down the **Service ID** of the service you just created.
3.  **Create an Email Template:**
    *   Click on **Email Templates** in the dashboard.
    *   Click on **Create New Template**.
    *   Customize the template as you wish. You can use variables like `{{name}}`, `{{email}}`, and `{{message}}` which will be replaced with the data from your contact form.
    *   Note down the **Template ID** of your new template.
4.  **Find your Public Key:**
    *   Go to **Account** > **API Keys**.
    *   Your **Public Key** will be listed there.

## 3. Updating your HTML and JavaScript

Once you have all the credentials, you will need to update your `index.html` file to include the necessary scripts to connect to Supabase and EmailJS.

### Add the following script tags to the `<head>` section of your `index.html` file:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### Add the following script to your `script.js` file:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const emailjsServiceID = 'YOUR_EMAILJS_SERVICE_ID';
const emailjsTemplateID = 'YOUR_EMAILJS_TEMPLATE_ID';
const emailjsPublicKey = 'YOUR_EMAILJS_PUBLIC_KEY';

emailjs.init(emailjsPublicKey);

const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Store in Supabase
    const { data, error } = await supabase
        .from('messages')
        .insert([{ name, email, message }]);

    if (error) {
        console.error('Error inserting data into Supabase:', error);
        alert('There was an error sending your message. Please try again.');
        return;
    }

    // Send email via EmailJS
    const templateParams = {
        name: name,
        email: email,
        message: message,
    };

    emailjs.send(emailjsServiceID, emailjsTemplateID, templateParams)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Your message has been sent successfully!');
        }, (error) => {
            console.log('FAILED...', error);
            alert('There was an error sending your message. Please try again.');
        });
});
```

### **Important:**

*   Replace `'YOUR_SUPABASE_URL'`, `'YOUR_SUPABASE_ANON_KEY'`, `'YOUR_EMAILJS_SERVICE_ID'`, `'YOUR_EMAILJS_TEMPLATE_ID'`, and `'YOUR_EMAILJS_PUBLIC_KEY'` with the actual credentials you obtained from Supabase and EmailJS.
*   Make sure the table in Supabase is named `messages` and has the columns `name`, `email`, and `message`.
*   Make sure the variables in your EmailJS template match the `templateParams` object in the JavaScript code (`name`, `email`, `message`).

After following these steps, your contact form should be able to store messages in your Supabase database and send you an email notification.
