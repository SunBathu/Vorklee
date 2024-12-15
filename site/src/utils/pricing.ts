import * as constants from '@/utils/constants';

//These all before discount prices. I will multiply it with constants.APP_CAPTURE_DISCOUNT_RATE and constants.APP_NOTES_DISCOUNT_RATE

export const productPricing: {
  [key: string]: {
    [key: string]: {
      [key: string]: number;
    };
  };
} = {
  [constants.APP_CAPTURE]: {
    [constants.PLAN_BASIC]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 1,
      [constants.TIER_COMPANY]: 2,
    },
    [constants.PLAN_STANDARD]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 2,
      [constants.TIER_COMPANY]: 4,
    },
    [constants.PLAN_PREMIUM]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 4,
      [constants.TIER_COMPANY]: 8,
    },
  },
  [constants.APP_NOTES]: {
    [constants.PLAN_BASIC]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 10,
      [constants.TIER_COMPANY]: 20,
    },
    [constants.PLAN_STANDARD]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 20,
      [constants.TIER_COMPANY]: 40,
    },
    [constants.PLAN_PREMIUM]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 40,
      [constants.TIER_COMPANY]: 80,
    },
  },
};

export const getDiscountedPrice = (
  price: number,
  discountRate: number,
): number => {
  if (typeof price !== 'number' || typeof discountRate !== 'number') {
    return 0; // Default fallback value
  }
  return price - price * discountRate;
};

/**
 * Calculates the after-discount price and total in cents.
 *
 * @param beforeDiscountPrice - The price before the discount (in USD).
 * @param quantity - The number of items.
 * @param discountRate - The discount rate (e.g., 0.2 for 20%).
 * @returns An object containing after-discount price and total in cents.
 **/
export function calculatePricesToCents(
  beforeDiscountPrice: number,
  quantity: number,
  discountRate: number,
) {
  const afterDiscountPrice = beforeDiscountPrice * (1 - discountRate);
  const afterDiscountUnitPriceInCents = Math.round(afterDiscountPrice * 100);
  const afterDiscountTotalPriceInCents =
    afterDiscountUnitPriceInCents * quantity;

  return {
    afterDiscountUnitPriceInCents,
    afterDiscountTotalPriceInCents,
  };
}

/**
 * Converts prices in cents back to USD.
 *
 * @param afterDiscountPriceInCents - The after-discount price in cents.
 * @param afterDiscountTotalInCents - The after-discount total price in cents.
 * @returns An object containing after-discount price and total in USD.
 */
export function calculatePricesToUSD(
  afterDiscountUnitPriceInCents: number,
  afterDiscountTotalPriceInCents: number,
) {
  const afterDiscountUnitPriceInUSD = (afterDiscountUnitPriceInCents / 100).toFixed(2);
  const afterDiscountTotalPriceInUSD = (afterDiscountTotalPriceInCents / 100
  ).toFixed(2);

  return {
    afterDiscountUnitPriceInUSD: parseFloat(afterDiscountUnitPriceInUSD),
    afterDiscountTotalPriceInUSD: parseFloat(afterDiscountTotalPriceInUSD),
  };
}
