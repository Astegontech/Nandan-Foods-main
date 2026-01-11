import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

const ReturnPolicy = () => {
    return (
        <div className="mt-10">
            <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Return & Refund Policy</h1>

                <div className="space-y-6 text-gray-700">
                    {/* <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Returns</h2>
                        <p>
                            We have a "no questions asked" return policy for damaged or defective items.
                            If you receive a damaged product, please report it to us within 24 hours of delivery.
                            Due to the perishable nature of food products, we cannot accept returns for reasons other than damage or quality issues.
                        </p>
                    </section> */}

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Refunds</h2>
                        <p>
                            Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                            If approved, your refund will be processed, and a credit will automatically be applied to your credit card
                            or original method of payment within 5-7 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Cancellations</h2>
                        <p>
                            You can cancel your order within <strong>6 hour</strong> of placing it. Once the order has been processed or shipped,
                            it cannot be cancelled. To cancel an order, please visit the "My Orders" section or contact our support team.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3 text-secondary">Contact Us</h2>
                        <p>
                            If you have any questions on how to return your item to us, contact us at support@nandanfoods.com.
                        </p>
                    </section>
                </div>
            </div>
            <BottomBanner />
        </div>
    );
};

export default ReturnPolicy;
