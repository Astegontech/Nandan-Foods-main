import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

const ReturnPolicy = () => {
  return (
    <div className="mt-10">
      <div className="max-w-full mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Cancellation & Refund Policy
        </h1>

        <div className="space-y-6 text-gray-700">
          {/* Cancellation Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Cancellation Policy
            </h2>
            <p>
              You can cancel your order within <strong>6 hours</strong> of
              placing it. Once the order has been processed, packed, or shipped,
              it cannot be cancelled.
            </p>
            <p className="mt-2">
              To cancel an order, please visit the <strong>"My Orders"</strong>{" "}
              section on our website or contact our support team with your order
              details.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Refund Policy (Online Payments)
            </h2>
            <p>
              If your order is successfully cancelled within the eligible time
              period, the refund will be processed to the original mode of
              payment used at the time of purchase.
            </p>
            <p className="mt-2">
              For online payments such as UPI, debit card, credit card, net
              banking, or wallets, the refund will be initiated within{" "}
              <strong>3–5 business days</strong> after cancellation approval.
              Depending on your bank or payment provider, it may take an
              additional <strong>5–10 business days</strong> for the amount to
              reflect in your account.
            </p>
          </section>

          {/* Non-Refundable Cases */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Non-Refundable Cases
            </h2>
            <p>Refunds will not be applicable in the following situations:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cancellation requests made after the order is shipped</li>
              <li>Orders that have already been processed or packed</li>
              <li>Perishable or customized items (if applicable)</li>
            </ul>
          </section>

          {/* Failed Payments */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Failed or Duplicate Payments
            </h2>
            <p>
              In case of failed transactions or duplicate payments where the
              amount is debited but the order is not confirmed, the excess
              amount will be automatically refunded to the original payment
              method within <strong>5–7 business days</strong>.
            </p>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Contact & Support
            </h2>
            <p>
              For any questions regarding cancellations or refunds, please
              contact our support team with your <strong>order ID</strong> and
              registered contact details. We are committed to assisting you and
              ensuring a smooth shopping experience.
            </p>
          </section>
        </div>
      </div>

      <BottomBanner />
    </div>
  );
};

export default ReturnPolicy;
