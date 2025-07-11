import Navbar from "@/components/ui/Navbar";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p>
            <strong>Effective Date:</strong> July 9, 2024
          </p>
          <p>
            This Cookie Policy explains how SmartStay uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control their use.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. What Are Cookies?</h2>
          <p>
            Cookies are small data files placed on your device when you visit a website. They are widely used to make websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Cookies</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential Cookies:</strong> Necessary for the operation of our website and to enable you to use its features.</li>
            <li><strong>Performance & Analytics Cookies:</strong> Help us understand how visitors interact with our site so we can improve it.</li>
            <li><strong>Functionality Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
            <li><strong>Advertising Cookies:</strong> May be used to deliver relevant ads and track the effectiveness of our marketing campaigns.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Third-Party Cookies</h2>
          <p>
            Some cookies may be set by third-party services that appear on our pages, such as analytics providers or embedded content. We do not control these cookies.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Choices</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You can set your browser to refuse cookies or alert you when cookies are being sent. However, some parts of the site may not function properly without cookies.</li>
            <li>You can manage your cookie preferences in your browser settings at any time.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We encourage you to review this page periodically for the latest information.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at <a href="mailto:support@smartstay.com" className="text-[var(--color-primary-600)] underline">support@smartstay.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 