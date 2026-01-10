import React from "react";
import { Link } from "react-router-dom";
import BottomBanner from "../components/ui/BottomBanner";

const TrackOrder = () => {
    return (
        <div className="mt-10">
            <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-white">
                <h1 className="text-3xl font-bold mb-8 text-center text-primary">Track Your Order</h1>

                <div className="flex flex-col items-center justify-center space-y-6 text-gray-700 py-10 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-lg text-center max-w-md">
                        To track your order status, please visit the <strong>My Orders</strong> section in your profile.
                        There you can see real-time updates for all your purchases.
                    </p>

                    <Link
                        to="/my-orders"
                        className="px-8 py-3 bg-primary text-white rounded-md hover:bg-secondary transition-colors font-medium"
                    >
                        Go to My Orders
                    </Link>

                    <p className="text-sm text-gray-500 mt-4">
                        If you have trouble finding your order, please contact our support team.
                    </p>
                </div>
            </div>
            <BottomBanner />
        </div>
    );
};

export default TrackOrder;
