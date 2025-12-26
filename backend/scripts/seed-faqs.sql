-- Sample FAQs for AI Support Agent
-- Run this after migrations to populate the knowledge base

-- Account Management FAQs
INSERT INTO faqs (question, answer, category, keywords, priority, is_active) VALUES
  (
    'How do I reset my password?',
    'To reset your password, click on "Forgot Password" on the login page. You''ll receive an email with reset instructions within 5 minutes. If you don''t see the email, check your spam folder or contact support@example.com.',
    'account',
    ARRAY['password', 'reset', 'forgot', 'login', 'email'],
    10,
    true
  ),
  (
    'How do I change my email address?',
    'You can update your email address from Settings > Account > Email. You''ll need to verify the new email address by clicking the confirmation link sent to it.',
    'account',
    ARRAY['email', 'change', 'update', 'settings'],
    8,
    true
  ),
  (
    'How do I delete my account?',
    'To delete your account, go to Settings > Account > Delete Account. This action is permanent and cannot be undone. All your data will be removed within 30 days.',
    'account',
    ARRAY['delete', 'remove', 'account', 'cancel'],
    7,
    true
  );

-- Billing FAQs
INSERT INTO faqs (question, answer, category, keywords, priority, is_active) VALUES
  (
    'What payment methods do you accept?',
    'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through Stripe.',
    'billing',
    ARRAY['payment', 'credit', 'card', 'paypal', 'stripe'],
    9,
    true
  ),
  (
    'How do I upgrade my plan?',
    'To upgrade your plan, go to Settings > Billing > Change Plan. Select your desired plan and payment will be processed immediately. You''ll have access to new features right away.',
    'billing',
    ARRAY['upgrade', 'plan', 'billing', 'change'],
    9,
    true
  ),
  (
    'How do I cancel my subscription?',
    'You can cancel anytime from Settings > Billing > Cancel Subscription. You''ll retain access until the end of your current billing period. No refunds for partial months, but you can continue using the service until the period ends.',
    'billing',
    ARRAY['cancel', 'subscription', 'billing', 'refund'],
    8,
    true
  ),
  (
    'What is your refund policy?',
    'We offer a 30-day money-back guarantee for annual plans. Monthly plans are not refundable but you can cancel anytime. Enterprise plans have custom terms. Contact billing@example.com for refund requests.',
    'billing',
    ARRAY['refund', 'money', 'back', 'guarantee', 'policy'],
    7,
    true
  );

-- Technical Support FAQs
INSERT INTO faqs (question, answer, category, keywords, priority, is_active) VALUES
  (
    'Why is the app running slowly?',
    'Slow performance can be caused by browser cache, too many open tabs, or network issues. Try clearing your cache, closing unused tabs, or using Chrome/Firefox for best performance. If the issue persists, contact support.',
    'technical',
    ARRAY['slow', 'performance', 'lag', 'speed', 'cache'],
    8,
    true
  ),
  (
    'How do I export my data?',
    'Go to Settings > Data > Export Data. Choose the format (CSV or JSON) and click Export. You''ll receive a download link via email within 10 minutes. Exports are available for 7 days.',
    'technical',
    ARRAY['export', 'data', 'download', 'csv', 'backup'],
    7,
    true
  ),
  (
    'Can I use the app on mobile?',
    'Yes! We have iOS and Android apps available on the App Store and Google Play. You can also access the responsive web version from any mobile browser.',
    'technical',
    ARRAY['mobile', 'app', 'ios', 'android', 'phone'],
    6,
    true
  ),
  (
    'What browsers do you support?',
    'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox. Internet Explorer is not supported.',
    'technical',
    ARRAY['browser', 'chrome', 'firefox', 'safari', 'compatibility'],
    5,
    true
  );

-- Pricing FAQs
INSERT INTO faqs (question, answer, category, keywords, priority, is_active) VALUES
  (
    'How much does the Pro plan cost?',
    'The Pro plan costs $29/month or $290/year (save 17%). It includes unlimited projects, 10 team members, and priority support. You can upgrade from Settings > Billing > Change Plan.',
    'pricing',
    ARRAY['price', 'cost', 'pro', 'plan', 'monthly'],
    8,
    true
  ),
  (
    'Do you offer student discounts?',
    'Yes! Students and educators get 50% off any paid plan. Verify your student status with a .edu email address or student ID at Settings > Billing > Student Discount.',
    'pricing',
    ARRAY['student', 'discount', 'education', 'teacher'],
    6,
    true
  ),
  (
    'Is there a free trial?',
    'Yes! All new users get a 14-day free trial of the Pro plan. No credit card required. After the trial, you can choose to upgrade or continue with the free plan.',
    'pricing',
    ARRAY['free', 'trial', 'test', 'demo'],
    9,
    true
  );

-- General FAQs
INSERT INTO faqs (question, answer, category, keywords, priority, is_active) VALUES
  (
    'How do I contact support?',
    'You can reach our support team at support@example.com or use the live chat in the bottom-right corner. We typically respond within 24 hours. Pro users get priority support.',
    'general',
    ARRAY['support', 'contact', 'help', 'email', 'chat'],
    10,
    true
  );

-- Display FAQ count
SELECT
  category,
  COUNT(*) as count,
  AVG(priority) as avg_priority
FROM faqs
WHERE is_active = true
GROUP BY category
ORDER BY category;
