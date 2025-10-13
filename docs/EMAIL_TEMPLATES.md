# Email Templates (Transactional + Marketing)

> Notes
> - Keep subject lines ≤ 50 characters for mobile truncation.
> - Keep preview (preheader) text ≤ 100 characters.
> - Include a plain-text version for every email.
> - HTML structure notes specify sections and accessibility guidance (semantic headings, alt text, button as <a> with role="button").
> - Use variables like `{{firstName}}`, `{{verifyUrl}}`, `{{assessmentUrl}}`, `{{premiumUrl}}`, `{{resetUrl}}`, `{{receiptUrl}}`, `{{supportEmail}}`, `{{companyName}}`.

---

## 1) Welcome / Email Verification

**Subject:** Welcome to Swipe Type — verify your email  
**Preview:** One tap to verify your email and save your results.

**Plain Text**
```
Hi {{firstName}},

Welcome to Swipe Type — the 3-minute relationship self-discovery test.

Please verify your email so we can save your results and unlock your free summary.

Verify your email: {{verifyUrl}}

If you didn't create this account, ignore this message and we'll delete it automatically.

— {{companyName}}
Support: {{supportEmail}}
```

**HTML Structure Notes**
- Header: logo alt text "Swipe Type"
- H1: "Welcome to Swipe Type"
- Body copy (short paragraphs)
- Primary CTA button: "Verify email" → `{{verifyUrl}}` (role="button", aria-label)
- Secondary note on ignoring if unintended
- Footer: support link/mailto, address placeholder, unsubscribe not required (transactional)
- Color contrast AA, button min height 44px

**Accessibility Notes**
- Button has descriptive aria-label
- Clear link text (no "click here")

---

## 2) Assessment Complete (Free)

**Subject:** Your Swipe Type is ready 🎉  
**Preview:** See your free summary and explore your full report.

**Plain Text**
```
Hi {{firstName}},

You've completed the Swipe Type assessment — nice work!

Your Swipe Type: {{swipeType}}
Summary preview: {{summaryOneLiner}}

View your results: {{assessmentUrl}}

Want the full picture? Unlock your premium report for $12.
Get premium: {{premiumUrl}}

— {{companyName}}
Need help? {{supportEmail}}
```

**HTML Structure Notes**
- H1: "Your Swipe Type is ready 🎉"
- Type badge: large, centered label with type name
- Summary paragraph (1–2 sentences)
- Primary CTA: "View my results" → `{{assessmentUrl}}`
- Secondary CTA: "Unlock full report — $12" → `{{premiumUrl}}`
- Footer: support mailto

**Accessibility Notes**
- Distinguish CTAs via text and position, not color alone
- Provide sufficient link focus styles

---

## 3) Purchase Confirmation

**Subject:** Payment confirmed — premium report unlocked  
**Preview:** Access your full report any time from your results page.

**Plain Text**
```
Hi {{firstName}},

Thanks for your purchase. Your premium report is now unlocked.

Order details:
Product: Swipe Type Premium Report
Amount: $12.00
Date: {{purchaseDate}}
Assessment: {{assessmentId}}

Open premium report: {{premiumUrl}}
View receipt: {{receiptUrl}}

— {{companyName}}
Questions? {{supportEmail}}
```

**HTML Structure Notes**
- H1: "Premium unlocked"
- Order summary list with amount, date, assessment reference
- Primary CTA: "Open premium report" → `{{premiumUrl}}`
- Secondary link: "View receipt" → `{{receiptUrl}}`
- Footer with support

**Accessibility Notes**
- Use <dl> for order details if possible (semantic)

---

## 4) Password Reset

**Subject:** Reset your Swipe Type password  
**Preview:** This link expires in 60 minutes for your security.

**Plain Text**
```
Hi {{firstName}},

We received a request to reset your password. If this was you, use the link below. It expires in 60 minutes.

Reset password: {{resetUrl}}

If you didn't request this, you can safely ignore this email.

— {{companyName}}
Support: {{supportEmail}}
```

**HTML Structure Notes**
- H1: "Reset your password"
- Short instructions with expiry note
- Primary CTA: "Reset password" → `{{resetUrl}}`
- Secondary text on ignoring if not requested
- Footer with support

**Accessibility Notes**
- Clear error-prevention information; no ambiguous CTAs

---

## 5) Account Deletion Confirmation

**Subject:** Your Swipe Type account has been deleted  
**Preview:** We've removed your personal data as requested.

**Plain Text**
```
Hi {{firstName}},

This is to confirm we deleted your Swipe Type account and associated personal data.

What we removed:
• Account profile (email, display name)
• Assessment history and responses
• Purchase entitlements (non-personal records retained for tax/audit)

If this was a mistake, reply to this email within 7 days and we'll try our best to help.

— {{companyName}}
Support: {{supportEmail}}
```

**HTML Structure Notes**
- H1: "Account deleted"
- List what was removed; note about retained non-personal financial records
- Support contact
- No CTA required

**Accessibility Notes**
- Use bullet list with proper semantics

---

## 6) Marketing Email (Optional)

**Subject Options (pick one)**
- "Understand your relationship patterns in 3 minutes"
- "Your Swipe Type: the guide to how you love"
- "See what your Swipe Type reveals about connection"

**Preview:** Take the free assessment — get your type and summary.

**Plain Text**
```
Hi {{firstName}},

Discover your Swipe Type — a fast, science-informed look at your relationship patterns.

• 57 swipes, about 3 minutes
• Free summary at the end
• Optional $12 premium report for deeper insights

Start now: {{landingUrl}}

You're receiving this because you joined our waitlist or opted in. Unsubscribe: {{unsubscribeUrl}}

— {{companyName}}
Support: {{supportEmail}}
```

**HTML Structure Notes**
- H1: benefit-forward headline
- 3 bullets of value
- Primary CTA: "Start free assessment" → `{{landingUrl}}`
- Footer: clear unsubscribe link `{{unsubscribeUrl}}` and support

**Accessibility Notes**
- Prominent unsubscribe link, descriptive CTA text


