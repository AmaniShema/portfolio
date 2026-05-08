module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM;
  const EMAIL_TO = process.env.EMAIL_TO;

  if (!SENDGRID_API_KEY || !EMAIL_FROM || !EMAIL_TO) {
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const payload = {
    personalizations: [
      {
        to: [{ email: EMAIL_TO }],
        subject: `Portfolio contact from ${name}`,
      },
    ],
    from: {
      email: EMAIL_FROM,
      name: 'Portfolio Contact',
    },
    reply_to: {
      email,
      name,
    },
    content: [
      {
        type: 'text/plain',
        value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      },
    ],
  };

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('SendGrid error:', response.status, errorBody);
      res.status(502).json({ error: 'Email provider error' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ error: 'Unable to send message' });
  }
};
