// src/content/emails.ts

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

type Tokens =
  | 'firstName'
  | 'resultType'
  | 'resultLink'
  | 'receiptUrl'
  | 'supportUrl'
  | 'orderId'
  | 'purchasedAt';

function render(template: string, vars: Record<Tokens, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k as Tokens] ?? '');
}

export const Emails = {
  welcome(): EmailTemplate {
    return {
      subject: 'Welcome to Swipe Type 🎉',
      html: `
        <h1>Welcome to Swipe Type</h1>
        <p>Hi {{firstName}},</p>
        <p>Ready to discover your relationship patterns? Start your quick assessment and see your Swipe Type.</p>
        <p><a href="{{resultLink}}">Start / Resume your assessment</a></p>
        <p>– The Swipe Type Team</p>
      `,
      text:
        `Welcome to Swipe Type\n\n` +
        `Hi {{firstName}},\n` +
        `Start your quick assessment and see your Swipe Type:\n{{resultLink}}\n\n` +
        `– The Swipe Type Team`,
    };
  },

  assessmentComplete(): EmailTemplate {
    return {
      subject: 'Your Swipe Type is ready ✨',
      html: `
        <h1>Your Swipe Type is ready</h1>
        <p>Hi {{firstName}},</p>
        <p>You're a <strong>{{resultType}}</strong>! View your free summary and unlock the full report any time.</p>
        <p><a href="{{resultLink}}">View your results</a></p>
        <p>Questions? <a href="{{supportUrl}}">We're here to help</a>.</p>
      `,
      text:
        `Your Swipe Type is ready\n\n` +
        `Hi {{firstName}},\n` +
        `You're a {{resultType}}! View your summary and unlock the full report:\n{{resultLink}}\n\n` +
        `Help: {{supportUrl}}\n`,
    };
  },

  premiumReceipt(): EmailTemplate {
    return {
      subject: 'Your Swipe Type premium report receipt',
      html: `
        <h1>Thanks for your purchase</h1>
        <p>Hi {{firstName}},</p>
        <p>Your premium report is unlocked. View anytime via your results page.</p>
        <ul>
          <li>Order ID: {{orderId}}</li>
          <li>Purchased: {{purchasedAt}}</li>
        </ul>
        <p><a href="{{receiptUrl}}">View receipt</a> • <a href="{{resultLink}}">Open your report</a></p>
      `,
      text:
        `Thanks for your purchase\n\n` +
        `Hi {{firstName}},\n` +
        `Your premium report is unlocked.\n` +
        `Order ID: {{orderId}}\nPurchased: {{purchasedAt}}\n` +
        `Receipt: {{receiptUrl}}\nReport: {{resultLink}}\n`,
    };
  },

  supportAutoReply(): EmailTemplate {
    return {
      subject: 'We received your message',
      html: `
        <h1>We've got your request</h1>
        <p>Hi {{firstName}},</p>
        <p>Thanks for reaching out. A team member will reply within 1 business day.</p>
        <p>In the meantime, check our FAQ: <a href="{{supportUrl}}">{{supportUrl}}</a></p>
      `,
      text:
        `We've got your request\n\n` +
        `Hi {{firstName}},\n` +
        `We'll reply within 1 business day.\nFAQ: {{supportUrl}}\n`,
    };
  },

  passwordReset(): EmailTemplate {
    return {
      subject: 'Reset your Swipe Type password',
      html: `
        <h1>Password reset</h1>
        <p>Hi {{firstName}},</p>
        <p>Use the secure link below to reset your password:</p>
        <p><a href="{{resultLink}}">Reset password</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
      text:
        `Password reset\n\n` +
        `Hi {{firstName}},\n` +
        `Reset link: {{resultLink}}\n` +
        `If you didn't request this, ignore this email.\n`,
    };
  },
};

export function renderEmail(
  tmpl: ReturnType<(typeof Emails)[keyof typeof Emails]>,
  vars: Record<Tokens, string>
) {
  return {
    subject: render(tmpl.subject, vars),
    html: render(tmpl.html, vars),
    text: render(tmpl.text, vars),
  };
}


