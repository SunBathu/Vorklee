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

