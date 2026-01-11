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
              At Nandan Foods ("we," "our," or "us"), we are committed to
              protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy outlines how we collect, use,
              disclose, and safeguard your data when you visit our website or
              make a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Information We Collect
            </h2>
            <p className="mb-2">
              We collect information to provide you with a seamless shopping
              experience. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and delivery address provided during registration
                or checkout.
              </li>
              <li>
                <strong>Payment Information:</strong> While we do not store your
                debit/credit card details, our payment partner (Razorpay)
                processes payments securely.
              </li>
              <li>
                <strong>Order History:</strong> Details of the products you have
                purchased and your order preferences.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              How We Use Your Information
            </h2>
            <p className="mb-2">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and deliver your orders accurately.</li>
              <li>
                To send you transactional updates like order confirmations and
                shipping status (via Email/SMS).
              </li>
              <li>
                To improve our website functionality and customer service.
              </li>
              <li>
                To communicate with you regarding inquiries or support requests.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Payment Security
            </h2>
            <p>
              We prioritize the security of your transactions. We use{" "}
              <strong>Razorpay</strong>, a trusted and secure payment gateway,
              to process online payments. We do not save your banking or card
              information on our servers. Razorpay adheres to strict industry
              security standards to ensure your financial data is safe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Data Sharing
            </h2>
            <p>
              We respect your privacy and do not sell or trade your personal
              information. We may share necessary details (Name, Address, Phone)
              with our trusted logistics partners solely for the purpose of
              delivering your order.
            </p>
          </section>

          {/* <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Cookies
            </h2>
            <p>
              Our website uses cookies to enhance your experience, such as keeping you logged in 
              and remembering your cart items. You can choose to disable cookies through your 
              browser settings, but this may affect some website functionalities.
            </p>
          </section> */}

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions or concerns regarding this Privacy
              Policy, please contact us:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:nandanfoods@yahoo.com"
                  className="text-primary hover:underline"
                >
                  nandanfoods@yahoo.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong> +91 93800 31861 / +91 63629 81088
              </li>
              <li>
                <strong>Address:</strong> Nirmal Jothi Nilaya, near New Bus
                Stand, Jaynagar, Shiggaon - 581205
              </li>
            </ul>
          </section>
        </div>
      </div>
      <BottomBanner />
    </div>
  );
};

export default PrivacyPolicy;
