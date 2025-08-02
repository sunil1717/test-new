import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShopStore } from '../store/shopStore';
import useAuthStore from '../store/authStore';

const RecommendedProducts = ({ tyres }) => {



  const getTyreKey = (tyre) => {
    const size = tyre.SIZE || `${tyre?.width}/${tyre?.profile}R${tyre?.rimSize}`;
    return `${tyre?.brand || tyre?.Brand}-${tyre?.model || tyre?.Model}-${size}`;
  };




  const navigate = useNavigate();
  const { addToCart, cart } = useShopStore();
  const { user } = useAuthStore();

  const [recommended, setRecommended] = useState([]);
  const [addedTyreKey, setAddedTyreKey] = useState(null);


  const getRandomTyres = () => {
    if (!tyres || tyres.length === 0) return [];
    const shuffled = [...tyres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  useEffect(() => {
    setRecommended(getRandomTyres());
  }, [tyres]);

  const handleRefresh = () => {
    setRecommended(getRandomTyres());
  };

  const handleAddToCart = (tyre) => {

    let width = '', profile = '', rimSize = '';
    if (tyre.SIZE && typeof tyre.SIZE === 'string') {
      const match = tyre.SIZE.match(/^(\d{3})\/(\d{2})R(\d{2})$/);
      if (match) {
        [, width, profile, rimSize] = match;
      }
    }
    const newTyre = {
      width: Number(width),
      profile: Number(profile),
      rimSize: rimSize,
      brand: tyre.Brand,
      model: tyre.Model,
      image: tyre.image_url,
      price: tyre["Price Incl GST"],
    };
    addToCart(newTyre);
    setAddedTyreKey(tyreKey);
    setTimeout(() => setAddedTyreKey(null), 1000);

  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
    }),
  };

  if (!tyres || tyres.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recommended for You
          </motion.h2>
          <button
            onClick={handleRefresh}
            className="text-red-600 hover:underline text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommended.map((tyre, index) => {
            const tyreKey = getTyreKey(tyre);
            const isInCart = cart.some((item) => getTyreKey(item.tyre) === tyreKey);
            const cartLimitReached = cart.length >= 5;

            return (
              <motion.div
                key={tyre._id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-lg transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.01] flex flex-col items-center"
              >
                <img
                  src={tyre.image_url || '/assets/tyre.png'}
                  alt={`${tyre.brand} tyre`}
                  className="h-28 sm:h-32 object-contain mb-4"
                />
                <h3 className="font-semibold text-center text-sm text-gray-800">
                  {tyre.Brand} - {tyre.Model}
                </h3>
                <p className="text-sm text-center text-gray-500 mt-1">
                  {tyre.SIZE}
                </p>
                <p className="text-center font-semibold text-red-600 mt-2 text-lg">
                  ${tyre["Price Incl GST"] || 'N/A'}
                </p>
                
                 <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/login/user');
                    } else if (!isInCart && !cartLimitReached) {
                      handleAddToCart(tyre);

                    }
                  }}
                  disabled={isInCart || cartLimitReached}
                  className={`mt-3 px-4 py-1  text-sm rounded font-medium transition text-white ${isInCart
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {isInCart || addedTyreKey === tyreKey
                    ? 'Added' : 'Add to Cart'}
                </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;
