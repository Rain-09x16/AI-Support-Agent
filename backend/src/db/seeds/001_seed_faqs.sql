-- Seed data: FAQ knowledge base
-- Description: Initial FAQ data for AI support agent
-- Author: AI Support Agent
-- Date: 2025-12-24

-- Clear existing FAQs (for development only - remove in production)
-- TRUNCATE faqs CASCADE;

INSERT INTO faqs (question, answer, category, keywords, priority) VALUES

-- Account Management (High Priority)
('How do I reset my password?',
 'To reset your password, click on "Forgot Password" on the login page. You''ll receive an email with reset instructions within 5 minutes. If you don''t receive the email, check your spam folder or contact support@example.com.',
 'account',
 ARRAY['password', 'reset', 'forgot', 'login', 'access', 'email'],
 95),

('How do I change my email address?',
 'To change your email address, go to Settings > Account > Email. Enter your new email and we''ll send a verification link. Click the link to confirm the change. Your old email will remain active until you verify the new one.',
 'account',
 ARRAY['email', 'change', 'update', 'settings', 'account'],
 85),

('How do I delete my account?',
 'To delete your account, go to Settings > Account > Delete Account. This action is permanent and cannot be undone. All your data will be deleted within 30 days. If you have an active subscription, it will be cancelled and you''ll receive a pro-rated refund.',
 'account',
 ARRAY['delete', 'account', 'remove', 'cancel', 'close'],
 80),

-- Billing (High Priority)
('How do I upgrade my plan?',
 'To upgrade your plan, go to Settings > Billing > Change Plan. Select your desired plan and payment will be processed immediately. You can upgrade or downgrade at any time. Changes take effect immediately and you''ll be charged pro-rated amounts.',
 'billing',
 ARRAY['upgrade', 'plan', 'billing', 'pricing', 'subscription', 'payment'],
 90),

('How do I cancel my subscription?',
 'You can cancel anytime from Settings > Billing > Cancel Subscription. You''ll retain access until the end of your current billing period. No refunds for partial months, but you can continue using the service until the period ends.',
 'billing',
 ARRAY['cancel', 'subscription', 'refund', 'billing', 'stop', 'pause'],
 85),

('What payment methods do you accept?',
 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and bank transfers for enterprise plans. All payments are processed securely through Stripe.',
 'billing',
 ARRAY['payment', 'credit card', 'paypal', 'billing', 'stripe'],
 75),

-- Support (High Priority)
('What are your business hours?',
 'Our support team is available Monday-Friday, 9 AM - 6 PM EST. For urgent issues outside these hours, please email support@example.com and we''ll respond within 24 hours. Enterprise customers have 24/7 priority support.',
 'general',
 ARRAY['hours', 'support', 'availability', 'time', 'contact', 'help'],
 90),

('How do I contact support?',
 'You can contact us via live chat (bottom right corner), email at support@example.com, or phone at 1-800-123-4567 (business hours only). For technical issues, please include error messages and steps to reproduce.',
 'general',
 ARRAY['contact', 'support', 'help', 'email', 'phone', 'chat'],
 85),

-- Technical (Medium Priority)
('Is my data secure?',
 'Yes! We use industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit. All data is stored in SOC 2 Type II compliant data centers. We never sell your data and you own all content you create.',
 'technical',
 ARRAY['security', 'encryption', 'data', 'safe', 'privacy', 'soc2', 'compliance'],
 88),

('What browsers do you support?',
 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend Chrome. Internet Explorer is not supported. Mobile browsers on iOS and Android are fully supported.',
 'technical',
 ARRAY['browser', 'chrome', 'firefox', 'safari', 'compatibility', 'mobile'],
 70),

('Can I export my data?',
 'Yes! Go to Settings > Data > Export. You can export all your data in JSON or CSV format. Exports typically take 5-15 minutes depending on data volume. You''ll receive a download link via email.',
 'technical',
 ARRAY['export', 'data', 'download', 'backup', 'json', 'csv'],
 75),

-- Features (Medium Priority)
('How do I integrate with Shopify?',
 'Go to Settings > Integrations > Shopify. Click "Connect to Shopify" and authorize the app. Once connected, orders will automatically sync every 15 minutes. You can trigger manual sync from the integration settings.',
 'features',
 ARRAY['shopify', 'integration', 'ecommerce', 'sync', 'connect'],
 80),

('Do you have an API?',
 'Yes! Our REST API is available on all paid plans. Visit Settings > API to generate your API key. Full documentation is available at docs.example.com/api. We also offer webhooks for real-time updates.',
 'features',
 ARRAY['api', 'integration', 'webhook', 'developer', 'rest'],
 78),

('How do I invite team members?',
 'Go to Settings > Team > Invite Members. Enter email addresses and select their role (Admin, Member, or Viewer). They''ll receive an invitation email. Team features are available on Professional and Enterprise plans only.',
 'features',
 ARRAY['team', 'invite', 'members', 'users', 'collaboration', 'share'],
 72),

-- General (Lower Priority)
('What is your refund policy?',
 'We offer a 30-day money-back guarantee for annual plans. Monthly plans are not refundable but you can cancel anytime. Enterprise plans have custom terms. Contact billing@example.com for refund requests.',
 'billing',
 ARRAY['refund', 'money back', 'guarantee', 'return', 'billing'],
 70),

('Do you offer student discounts?',
 'Yes! Students and educators get 50% off all plans. Verify your status with a .edu email address at example.com/students. Verification is instant for most institutions.',
 'billing',
 ARRAY['student', 'discount', 'education', 'school', 'university', 'edu'],
 65);

-- Update statistics after bulk insert
ANALYZE faqs;
