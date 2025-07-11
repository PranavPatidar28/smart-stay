import Navbar from "@/components/ui/Navbar";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p>
            <strong>Effective Date:</strong> July 9, 2024
          </p>
          <p>
            Welcome to SmartStay! These Terms of Service ("Terms") govern your use of our platform, which connects students with property owners for accommodation bookings. By accessing or using SmartStay, you agree to these Terms. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h2>
          <p>
            You must be at least 18 years old to use SmartStay. By creating an account, you represent that you meet this requirement.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Registration</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>All information you provide must be accurate and up to date.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Use of the Platform</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You agree to use SmartStay only for lawful purposes and in accordance with these Terms.</li>
            <li>Do not post false, misleading, or inappropriate content.</li>
            <li>Do not attempt to access accounts or data of other users without authorization.</li>
            <li>Do not use the platform to harass, abuse, or harm others.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Bookings & Payments</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All bookings are subject to availability and the property owner’s approval.</li>
            <li>Payment terms, cancellation policies, and refunds are determined by the property owner and will be clearly stated before booking.</li>
            <li>SmartStay is not responsible for disputes between users and property owners but will assist in resolving issues where possible.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Content Ownership</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You retain ownership of content you post but grant SmartStay a license to use, display, and distribute it for platform purposes.</li>
            <li>Do not post content you do not have the right to share.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in harmful behavior.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">7. Disclaimers & Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>SmartStay is provided "as is" without warranties of any kind.</li>
            <li>We are not liable for damages resulting from your use of the platform or interactions with other users.</li>
            <li>We do not guarantee the accuracy or availability of listings.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of SmartStay after changes means you accept the new Terms.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at <a href="mailto:support@smartstay.com" className="text-[var(--color-primary-600)] underline">support@smartstay.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 