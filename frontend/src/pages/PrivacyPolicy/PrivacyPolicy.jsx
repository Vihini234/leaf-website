import React, { useState, useEffect } from 'react';
import StaticNavbar from '../../components/StaticNavbar/StaticNavbar';
import './PrivacyPolicy.css'; 

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'information-collection', label: 'Information We Collect' },
    { id: 'information-use', label: 'How We Use Information' },
    { id: 'information-sharing', label: 'Information Sharing' },
    { id: 'data-security', label: 'Data Security' },
    { id: 'cookies', label: 'Cookies & Tracking' },
    { id: 'user-rights', label: 'Your Rights' },
    { id: 'children-privacy', label: 'Children\'s Privacy' },
    { id: 'updates', label: 'Policy Updates' },
    { id: 'contact', label: 'Contact Us' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <StaticNavbar />
    <div className="privacy-container">
      <header className="privacy-header">
        <div className="header-content">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </p>
          <div className="last-updated">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>

      <nav className="privacy-nav">
        <div className="nav-content">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="privacy-content">

        <section id="overview" className="content-section">
          <h2 className="section-title">Overview</h2>
          <div className="section-content">
            <p>
              At DeliveryHub, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our delivery services, website, and mobile application.
            </p>
            <p>
              By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
            <div className="highlight-box">
              <p><strong>Key Points:</strong></p>
              <ul>
                <li>We only collect information necessary to provide our services</li>
                <li>We never sell your personal data to third parties</li>
                <li>You have control over your data and can request deletion at any time</li>
                <li>We use industry-standard security measures to protect your information</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="information-collection" className="content-section">
          <h2 className="section-title">Information We Collect</h2>
          <div className="section-content">
            <p>We collect several types of information to provide and improve our services:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Personal Information
            </h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
              <li><strong>Profile Information:</strong> Profile picture, delivery preferences, and saved addresses</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through encrypted payment processors)</li>
              <li><strong>Contact Information:</strong> Emergency contacts and delivery instructions</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Usage Information
            </h3>
            <ul>
              <li><strong>Order Data:</strong> Items ordered, delivery addresses, order history, and preferences</li>
              <li><strong>Location Data:</strong> GPS coordinates for delivery tracking and route optimization</li>
              <li><strong>Device Information:</strong> Device type, operating system, IP address, and browser type</li>
              <li><strong>App Usage:</strong> Features used, time spent, and interaction patterns</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Communication Data
            </h3>
            <ul>
              <li>Customer service interactions and support tickets</li>
              <li>Feedback and reviews you provide</li>
              <li>Communications with delivery drivers</li>
            </ul>
          </div>
        </section>

        <section id="information-use" className="content-section">
          <h2 className="section-title">How We Use Your Information</h2>
          <div className="section-content">
            <p>We use the collected information for the following purposes:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Service Delivery
            </h3>
            <ul>
              <li>Process and fulfill your delivery orders</li>
              <li>Coordinate with delivery drivers and track deliveries</li>
              <li>Send order confirmations, updates, and delivery notifications</li>
              <li>Handle customer service inquiries and support requests</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Service Improvement
            </h3>
            <ul>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Personalize your experience and recommendations</li>
              <li>Optimize delivery routes and estimated delivery times</li>
              <li>Develop new features and services</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Communications
            </h3>
            <ul>
              <li>Send promotional offers and marketing communications (with your consent)</li>
              <li>Notify you about service changes and updates</li>
              <li>Conduct surveys and gather feedback</li>
            </ul>

            <div className="warning-box">
              <p><strong>Marketing Communications:</strong> You can opt out of promotional emails at any time by clicking the unsubscribe link in our emails or by updating your preferences in your account settings.</p>
            </div>
          </div>
        </section>

        <section id="information-sharing" className="content-section">
          <h2 className="section-title">Information Sharing and Disclosure</h2>
          <div className="section-content">
            <p>We may share your information in the following circumstances:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Service Providers
            </h3>
            <ul>
              <li><strong>Delivery Partners:</strong> Driver name and contact information for coordination</li>
              <li><strong>Payment Processors:</strong> Billing information for payment processing</li>
              <li><strong>Technology Services:</strong> Cloud hosting, analytics, and communication platforms</li>
              <li><strong>Customer Support:</strong> Third-party support tools and services</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Legal Requirements
            </h3>
            <ul>
              <li>Comply with applicable laws and regulations</li>
              <li>Respond to legal requests and court orders</li>
              <li>Protect our rights and prevent fraud or abuse</li>
              <li>Ensure safety and security of users and drivers</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Business Transfers
            </h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity. We will notify you via email and/or prominent notice on our website before your information becomes subject to a different privacy policy.
            </p>

            <div className="highlight-box">
              <p><strong>We Never:</strong></p>
              <ul>
                <li>Sell your personal information to third parties for marketing purposes</li>
                <li>Share your data without a legitimate business or legal reason</li>
                <li>Allow unauthorized access to your personal information</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="data-security" className="content-section">
          <h2 className="section-title">Data Security</h2>
          <div className="section-content">
            <p>We implement comprehensive security measures to protect your personal information:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Technical Safeguards
            </h3>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit using SSL/TLS protocols</li>
              <li><strong>Data Storage:</strong> Personal information is stored in secure, encrypted databases</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication requirements</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Operational Security
            </h3>
            <ul>
              <li>Employee training on data protection and privacy practices</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Regular security updates and system maintenance</li>
              <li>Incident response procedures for potential security breaches</li>
            </ul>

            <div className="warning-box">
              <p><strong>Important:</strong> While we implement strong security measures, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but continuously work to protect your information.</p>
            </div>
          </div>
        </section>

        <section id="cookies" className="content-section">
          <h2 className="section-title">Cookies and Tracking Technologies</h2>
          <div className="section-content">
            <p>We use cookies and similar technologies to enhance your experience and improve our services:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Types of Cookies
            </h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic website functionality and security</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Managing Cookies
            </h3>
            <p>
              You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our services. You can also manage your cookie preferences through our cookie consent banner.
            </p>
          </div>
        </section>

        <section id="user-rights" className="content-section">
          <h2 className="section-title">Your Rights and Choices</h2>
          <div className="section-content">
            <p>You have several rights regarding your personal information:</p>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Access and Control
            </h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
              <li><strong>Update:</strong> Correct or update your personal information through your account</li>
              <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Request your data in a structured, commonly used format</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Communication Preferences
            </h3>
            <ul>
              <li>Opt out of marketing communications at any time</li>
              <li>Choose which types of notifications you receive</li>
              <li>Update your communication preferences in your account settings</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginTop: '24px', marginBottom: '12px' }}>
              Location Services
            </h3>
            <ul>
              <li>Control location sharing through your device settings</li>
              <li>Disable location services (may limit delivery functionality)</li>
              <li>Choose when to share location information</li>
            </ul>
          </div>
        </section>

        <section id="children-privacy" className="content-section">
          <h2 className="section-title">Children's Privacy</h2>
          <div className="section-content">
            <p>
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
            <p>
              If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>
            
            <div className="warning-box">
              <p><strong>Parental Notice:</strong> If you believe your child under 13 has created an account or provided personal information, please contact our support team immediately at privacy@deliveryhub.com</p>
            </div>
          </div>
        </section>

        <section id="updates" className="content-section">
          <h2 className="section-title">Changes to This Privacy Policy</h2>
          <div className="section-content">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will:
            </p>
            <ul>
              <li>Notify you via email (if you have provided an email address)</li>
              <li>Post a prominent notice on our website and mobile app</li>
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>For material changes, provide 30 days advance notice when possible</li>
            </ul>
            <p>
              Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </div>
        </section>

        <section id="contact" className="content-section">
          <div className="contact-section">
            <h2 className="contact-title">Questions or Concerns?</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please don't hesitate to contact us. We're here to help and ensure your privacy concerns are addressed.
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <strong>Email</strong><br />
                  <a href="mailto:privacy@deliveryhub.com" className="contact-link">
                    privacy@deliveryhub.com
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <strong>Phone</strong><br />
                  <a href="tel:+1-800-DELIVERY" className="contact-link">
                    1-800-DELIVERY
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <strong>Address</strong><br />
                  <span>123 Privacy Lane<br />Data City, DC 12345</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="privacy-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Cookie Policy</a>
            <a href="#" className="footer-link">Data Protection</a>
            <a href="#" className="footer-link">Support Center</a>
          </div>
          <p className="footer-text">
            © {new Date().getFullYear()} DeliveryHub. All rights reserved. 
            Your privacy is our priority.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default PrivacyPolicy;