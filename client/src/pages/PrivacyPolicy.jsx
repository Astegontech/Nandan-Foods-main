import React from "react";
import { Link } from "react-router-dom";
import BottomBanner from "../components/ui/BottomBanner";

const PrivacyPolicy = () => {
  return (
    <div className="mt-10">
      <div className="max-w-full mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Introduction
            </h2>
            <p>
              At Nandan Foods, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, and safeguard your data when
              you visit our website and make purchases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Information We Collect
            </h2>
            <p className="mb-2">
              We collect information that you provide to us directly, such as
              when you create an account, place an order, or contact us. This
              may include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and contact details (email, phone number, address)</li>
              <li>Billing and shipping information</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              How We Use Your Information
            </h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your order status and updates</li>
              <li>Improve our website and customer service</li>
              <li>
                Send promotional emails and offers (only if you have opted in)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Data Sharing and Security
            </h2>
            <p>
              We do not sell or rent your personal information to third parties.
              We may share your data with trusted service providers who assist
              us in operating our website, conducting our business, or servicing
              you (e.g., payment gateways, logistics partners), so long as those
              parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Cookies
            </h2>
            <p>
              Our website uses cookies to enhance your browsing experience.
              Cookies are small files that a site or its service provider
              transfers to your computer's hard drive through your Web browser
              (if you allow) that enables the site's or service provider's
              systems to recognize your browser and capture and remember certain
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Contact Us
            </h2>
            <p>
              If there are any questions regarding this privacy policy, you may
              contact us via our{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
      <BottomBanner />
    </div>
  );
};

export default PrivacyPolicy;
