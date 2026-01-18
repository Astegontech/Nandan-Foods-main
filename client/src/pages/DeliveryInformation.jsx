import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

const DeliveryInformation = () => {
  return (
    <div className="mt-10">
      <div className="max-w-full mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Delivery Information
        </h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Shipping Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Shipping Policy
            </h2>
            <p>
              At <strong>Nandan Foods</strong>, we currently deliver our products
              exclusively within the state of <strong>Karnataka</strong>. All
              orders are hygienically packed and carefully handled to ensure
              freshness, quality, and safety until delivery.
            </p>
            <p className="mt-2">
              We do not deliver outside Karnataka at this time. This helps us
              maintain better quality control and reliable service for our
              customers.
            </p>
          </section>

          {/* Delivery Timelines */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Delivery Timelines
            </h2>
            <p className="mb-3">
              Orders placed with Nandan Foods are delivered within approximately
              <strong> 7 business days</strong> from the date of order
              confirmation.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Delivery Area:</strong> All districts within Karnataka
              </li>
              <li>
                <strong>Estimated Delivery Time:</strong> Around 7 business days
              </li>
              <li>
                <strong>Order Processing:</strong> 1–2 working days before
                dispatch
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              *Delivery timelines may vary slightly due to location, weather
              conditions, public holidays, or unforeseen logistical delays.
            </p>
          </section>

          {/* Shipping Charges */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Shipping Charges
            </h2>
            <p>
              Shipping charges are calculated based on the total order weight and
              delivery destination within Karnataka. The final shipping cost
              will be displayed at checkout before completing the payment.
            </p>
            <p className="mt-2 font-medium text-green-600">
              🎉 Free shipping is available on orders above ₹999.
            </p>
          </section>

          {/* Order Tracking */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Order Tracking
            </h2>
            <p>
              Once your order has been dispatched, you can track its status
              directly from the <strong>“My Orders”</strong> section in your
              account.
            </p>
            <p className="mt-2">
              Order updates such as <em>Processing</em>, <em>Dispatched</em>, and
              <em>Delivered</em> will be visible within your account dashboard.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              *Currently, order tracking updates are available only within your
              account.
            </p>
          </section>
        </div>
      </div>

      <BottomBanner />
    </div>
  );
};

export default DeliveryInformation;
