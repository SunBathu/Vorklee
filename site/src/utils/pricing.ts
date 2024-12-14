import * as constants from '@/utils/constants';

export const productPricing = {
  [constants.APP_CAPTURE]: {
    [constants.PLAN_BASIC]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 0.5,
      [constants.TIER_COMPANY]: 1,
    },
    [constants.PLAN_STANDARD]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 1,
      [constants.TIER_COMPANY]: 2,
    },
    [constants.PLAN_PREMIUM]: {
      [constants.TIER_TRIAL]: 0,
      [constants.TIER_INDIVIDUAL]: 2,
      [constants.TIER_COMPANY]: 4,
    },
  },
  [constants.APP_NOTES]: {
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
};
