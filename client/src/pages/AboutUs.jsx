import React from "react";
import BottomBanner from "../components/ui/BottomBanner";

// Placeholder founder image
const founderImg = "https://via.placeholder.com/500x500?text=Founder+Image";

const AboutUs = () => {
  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary-light to-white rounded-2xl mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            Nandan Foods
          </h1>
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
            Bringing the authentic taste of <strong>Uttara Karnataka</strong> to
            your home, handcrafted with tradition, love, and care.
          </p>
        </section>

        {/* Founder Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="md:w-1/2 text-center md:text-left">
            <img
              src={founderImg}
              alt="Founder Nirmala V Shettar"
              className="w-80 h-80 object-cover rounded-full mx-auto md:mx-0 shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <p className="text-gray-700 text-sm italic mt-3 text-center md:text-left">
              Mrs. Nirmala V Shettar – Founder & Culinary Artisan
            </p>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Our Founder
            </h2>
            <p className="text-gray-700 mb-4">
              Mrs. Nirmala V Shettar started Nandan Foods with a simple idea: to
              share the <strong>taste of home-cooked meals</strong> with
              everyone. Decades of culinary passion and traditional recipes
              became the foundation of a brand loved across Karnataka.
            </p>
            <p className="text-gray-700 mb-4 italic">
              "Everyone deserves to taste food that feels like home."
            </p>
            <p className="text-gray-700">
              Today, Nandan Foods stands for authenticity, trust, and flavors
              crafted with care. Each product carries the warmth of home
              kitchens, preserving the culinary heritage of Uttara Karnataka.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-gray-50 py-12 px-6 md:px-12 rounded-2xl mb-16">
          <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
            Our Story
          </h2>
          <p className="text-gray-700 mb-4 text-center max-w-3xl mx-auto">
            Our journey began in a humble kitchen where every meal was a labor
            of love. Using fresh, natural ingredients and time-tested family
            recipes, we slowly expanded from serving friends and family to
            sharing our flavors with the world.
          </p>
          <p className="text-gray-700 mb-4 text-center max-w-3xl mx-auto">
            Today, we specialize in traditional homemade food products like
            Shenga Chutney, Putani Chutney, Gurelu Chutney, spice powders, and
            regional blends — all crafted{" "}
            <strong>without preservatives or artificial colors</strong>, just
            pure, authentic taste.
          </p>
        </section>

        {/* Products Section */}
        {/* <section className="py-12 mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Our Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Shenga Chutney</h3>
              <p className="text-gray-700 text-sm">
                Rich, nutty, and perfectly spiced for authentic flavor.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Putani Chutney</h3>
              <p className="text-gray-700 text-sm">
                Tangy, fresh, and bursting with traditional taste.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Gurelu Chutney</h3>
              <p className="text-gray-700 text-sm">
                Sweet, savory, and crafted for nostalgia.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Spice Powders</h3>
              <p className="text-gray-700 text-sm">
                Hand-roasted and ground for authentic flavor in every dish.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">Regional Blends</h3>
              <p className="text-gray-700 text-sm">
                Unique spice combinations celebrating Karnataka's heritage.
              </p>
            </div>
          </div>
        </section> */}

        {/* Mission & Vision Section */}
        <section className="py-12 mb-16 grid md:grid-cols-2 gap-6">
          <div className="bg-primary-light rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-primary mb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 text-sm">
              To bring <strong>traditional homemade flavors</strong> to every
              home while supporting local food culture and providing healthy,
              authentic alternatives to mass-produced products.
            </p>
          </div>
          <div className="bg-primary-light rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-primary mb-2">Our Vision</h3>
            <p className="text-gray-700 text-sm">
              To become Karnataka’s most trusted homemade food brand, known for
              <strong>quality, authenticity, and heartfelt service</strong>,
              connecting tradition with modern kitchens.
            </p>
          </div>
        </section>

        {/* Closing Section */}
        <section className="text-center py-12">
          <p className="text-3xl font-bold text-primary mb-4">
            Nandan Foods – A Taste of Home
          </p>
          <p className="text-gray-700 text-base">
            From our kitchen to your plate, we serve with love ❤️
          </p>
        </section>
      </div>

      <BottomBanner />
    </div>
  );
};

export default AboutUs;
