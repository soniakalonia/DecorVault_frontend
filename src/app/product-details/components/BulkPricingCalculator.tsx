'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PricingTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
  discount: number;
}

interface BulkPricingCalculatorProps {
  pricingTiers: PricingTier[];
  basePrice: number;
}

const BulkPricingCalculator = ({ pricingTiers, basePrice }: BulkPricingCalculatorProps) => {
  const [calculatorQty, setCalculatorQty] = useState(100);

  const calculatePrice = (qty: number): { total: number; perUnit: number; savings: number } => {
    const tier = pricingTiers.find(
      (t) => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)
    );

    const pricePerUnit = tier ? tier.pricePerUnit : basePrice;
    const total = pricePerUnit * qty;
    const savings = (basePrice - pricePerUnit) * qty;

    return { total, perUnit: pricePerUnit, savings };
  };

  const pricing = calculatePrice(calculatorQty);

  return (
    <div className="rounded-xl bg-white border shadow-lg p-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Icon name="CalculatorIcon" size={32} className="text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Bulk Pricing Calculator
        </h3>
        <p className="text-gray-600">
          Calculate savings on bulk orders
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Calculator */}
        <div className="space-y-6">
          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Enter Quantity
            </label>
            <input
              type="number"
              value={calculatorQty}
              onChange={(e) => setCalculatorQty(parseInt(e.target.value) || 0)}
              className="w-full text-2xl font-bold text-center rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>

          {/* Pricing Result */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700 font-medium">Price per unit:</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{pricing.perUnit.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-blue-200">
              <span className="text-gray-700 font-medium">Total amount:</span>
              <span className="text-3xl font-bold text-gray-900">
                ₹{pricing.total.toLocaleString('en-IN')}
              </span>
            </div>
            {pricing.savings > 0 && (
              <div className="flex items-center justify-between py-2 border-t border-blue-200">
                <span className="text-green-700 font-semibold">You save:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{pricing.savings.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Pricing Tiers */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4">Bulk Pricing Tiers:</h4>
          <div className="space-y-3">
            {pricingTiers.map((tier, index) => {
              const isActive = calculatorQty >= tier.minQty && (tier.maxQty === null || calculatorQty <= tier.maxQty);
              return (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-semibold ${
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} units
                      </span>
                      {tier.discount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tier.discount}% OFF
                        </span>
                      )}
                    </div>
                    <span className={`text-xl font-bold ${
                      isActive ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPricingCalculator;



