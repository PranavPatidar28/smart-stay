import Navbar from "@/components/ui/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <p>
            <strong>Effective Date:</strong> July 9, 2024
          </p>
          <p>
            At SmartStay, your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to find, book, or list student accommodations. By using SmartStay, you agree to the practices described below.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Personal Information:</strong> Name, email address, phone number, profile photo, and account type (e.g., student, landlord).</li>
            <li><strong>Booking & Listing Data:</strong> Accommodation preferences, booking history, property details, and communication with other users.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, device information, and IP address.</li>
            <li><strong>Cookies & Tracking:</strong> We use cookies to enhance your experience, remember preferences, and analyze site traffic.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and improve our services, including matching students with suitable accommodations.</li>
            <li>To communicate with you about bookings, updates, and support requests.</li>
            <li>To personalize your experience and recommend relevant listings.</li>
            <li>To ensure the security and integrity of our platform.</li>
            <li>To comply with legal obligations and resolve disputes.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We may share your information with landlords, property managers, or other users as necessary to facilitate bookings and communication.</li>
            <li>We do not sell your personal information to third parties.</li>
            <li>We may share data with trusted service providers who help us operate our platform (e.g., payment processors, analytics providers), subject to strict confidentiality agreements.</li>
            <li>We may disclose information if required by law or to protect our rights and users' safety.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Choices & Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You can update your profile information and notification preferences in your account settings.</li>
            <li>You may request access to, correction, or deletion of your personal data by contacting us.</li>
            <li>You can opt out of marketing communications at any time.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your account information confidential.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Children's Privacy</h2>
          <p>
            SmartStay is intended for users aged 18 and above. We do not knowingly collect personal information from children under 18.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the effective date.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@smartstay.com" className="text-[var(--color-primary-600)] underline">support@smartstay.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 