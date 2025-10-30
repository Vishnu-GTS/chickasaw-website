import React from "react";
import heroBg from "@/assets/hero_bg.png";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative h-[300px] overflow-hidden">
        {/* Background Image with Red Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(296.02deg, rgba(211, 25, 28, 0.7) 0%, rgba(191, 17, 20, 0.8) 100%)",
          }}
        />

        {/* Page Title */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Effective Date */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            <strong>Effective Date:</strong> October 30, 2025
          </p>
          <p className="text-gray-600">
            <strong>Last Updated:</strong> October 30, 2025
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-lg max-w-none space-y-6 text-gray-800">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1) Introduction
            </h2>
            <p>
              Anompa ("Anompa", "we", "our", or "the App") helps users learn the
              Chickasaw language. We respect your privacy and are committed to
              being clear about what the App does and does not do with
              information.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2) Scope</h2>
            <p>
              This Policy applies to the Anompa mobile and web apps and any
              content we provide through them.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3) What We Collect (Summary)
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal Data:</strong> We do NOT collect, sell, share,
                or track personal information. The App does not require sign‑in
                or accounts.
              </li>
              <li>
                <strong>On‑Device Data (Local Only):</strong> The App stores
                learning progress, favorites, and settings locally on your
                device (e.g., via on‑device storage). This data never leaves
                your device unless you choose to back up or sync your device
                using your platform's tools.
              </li>
              <li>
                <strong>Network Requests:</strong> The App fetches language
                content and audio from our servers. Our hosting provider may
                maintain standard server logs (e.g., IP address, user agent,
                timestamps) for security, diagnostics, and reliability. We do
                not use these logs to identify or profile users.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4) What We Do NOT Collect
            </h2>
            <p>
              We do not collect your name, email, phone number, precise
              location, contacts, photos, media, files, microphone audio, camera
              images, advertising identifiers, or analytics/usage profiles.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5) How We Use Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide and improve content delivery (e.g., audio playback and
                learning content).
              </li>
              <li>
                Maintain service reliability and security (via standard server
                logging).
              </li>
            </ul>
            <p className="mt-2">
              We do not create user profiles, perform targeted advertising, or
              resell data.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6) On‑Device Storage & Retention
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Learning progress, favorites, and settings are stored locally on
                your device.
              </li>
              <li>
                You can remove this data by clearing the App's data or
                uninstalling the App. We do not hold copies of your on‑device
                data.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7) Third‑Party Services & Libraries
            </h2>
            <p>
              We use open‑source libraries (e.g., for audio playback, UI,
              storage). These libraries operate within the App and do not
              transmit your personal data to their authors. We do not include
              advertising SDKs or analytics SDKs.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              8) Permissions & Platform Disclosures
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Android
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>INTERNET:</strong> Needed to fetch content/audio
                    from our servers.
                  </li>
                  <li>
                    No access to camera, microphone, contacts, SMS, call logs,
                    or precise location.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  iOS
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>App Transport Security (ATS):</strong> Configured to
                    allow loading content/audio from our servers.
                  </li>
                  <li>
                    The App does not access the microphone, camera, photos,
                    contacts, or location.
                  </li>
                  <li>
                    <strong>Encryption:</strong> The App does not use non‑exempt
                    encryption for export compliance purposes.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              9) Children's Privacy
            </h2>
            <p>
              We do not knowingly collect personal information from children.
              The App can be used without providing any personal data. If you
              believe a child has provided us with personal information, please
              contact us so we can address it.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              10) Security
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Personal data:</strong> Not collected.
              </li>
              <li>
                <strong>Network traffic:</strong> Delivered over standard web
                protocols; server logs are maintained by our hosting provider
                for operations and security.
              </li>
              <li>
                <strong>On‑device data:</strong> Remains on your device under
                your control.
              </li>
            </ul>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              11) International Transfers
            </h2>
            <p>
              If our servers are located outside your region, network requests
              may be processed in that region. We do not use such information to
              identify individuals.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              12) Your Choices & Controls
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You can clear the App's local data via device settings or by
                uninstalling the App.
              </li>
              <li>
                Because we do not maintain user accounts or collect personal
                data, there is no personal information for us to provide,
                correct, or delete.
              </li>
            </ul>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              13) Changes to This Policy
            </h2>
            <p>
              We may update this Policy from time to time. Material changes will
              be reflected by an updated "Last Updated" date within the App
              and/or in our store listings.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              14) Contact Us
            </h2>
            <p>
              If you have questions about this Policy or the App, please
              contact:
            </p>
            <div className="mt-3 space-y-1">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@ndnlanguage.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  info@ndnlanguage.com
                </a>
              </p>
              <p>
                <strong>Developer:</strong> Thornton Media, Inc.
              </p>
              <p>
                <strong>Address:</strong> 4132 S Rainbow Blvd # 508
              </p>
              <p>Las Vegas - 89103-3106</p>
              <p>United States (US)</p>
            </div>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              15) Consent
            </h2>
            <p>By using Anompa, you consent to this Privacy Policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
