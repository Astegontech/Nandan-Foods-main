import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

const DeliveryInformation = () => {
    return (
        <div className="mt-10">
            <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Delivery Information</h1>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Shipping Policy</h2>
                        <p>
                            At Nandan Foods, we strive to deliver your orders as quickly and efficiently as possible.
                            We currently ship to select locations across India. All orders are packed with care
                            to ensure freshness and quality upon arrival.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Delivery Timelines</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Local Orders (within city):</strong> Delivered within 24-48 hours.</li>
                            <li><strong>Statewide Orders:</strong> Delivered within 2-4 business days.</li>
                            <li><strong>National Orders:</strong> Delivered within 5-7 business days depending on the location.</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-500">
                            *Please note that delivery times may vary during festivals and holidays.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Shipping Charges</h2>
                        <p>
                            Shipping charges are calculated based on the weight of the order and the delivery location.
                            You can view the final shipping cost at the checkout page before making a payment.
                            Free shipping is available on orders above ₹999.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Order Tracking</h2>
                        <p>
                            Once your order is shipped, you will receive a tracking link via email/SMS.
                            You can also track your order status in the "My Orders" section of your account.
                        </p>
                    </section>
                </div>
            </div>
            <BottomBanner />
        </div>
    );
};

export default DeliveryInformation;
