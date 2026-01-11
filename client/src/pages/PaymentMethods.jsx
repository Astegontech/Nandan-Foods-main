import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

const PaymentMethods = () => {
  return (
    <div className="mt-10">
      <div className="max-w-full mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Payment Methods
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="mb-4">
              We offer multiple secure payment options to make your shopping
              experience smooth and hassle-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Online Payments
            </h2>
            <p>
              We accept all major credit and debit cards, UPI and Net Banking
              via our secure payment partner. Your payment information is
              encrypted and processed securely. We do not store your card
              details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Cash on Delivery (COD)
            </h2>
            <p>
              For your convenience, we also offer Cash on Delivery (COD)
              services for select pin codes. You can pay via cash or UPI at the
              time of delivery. Please note that COD may not be available for
              all orders or locations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-secondary">
              Secure Transactions
            </h2>
            <p>
              All transactions on Nandan Foods are protected with encryption. We
              are committed to ensuring that your personal and financial
              information remains secure.
            </p>
          </section>
        </div>
      </div>
      <BottomBanner />
    </div>
  );
};

export default PaymentMethods;
