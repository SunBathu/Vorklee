import * as constants from '@/utils/constants';

export const productPricing = {
  [constants.APP_SCREENSHOT_CAPTURE]: {
    [constants.PLAN_BASIC]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 2,
      [constants.PLAN_TIER_COMPANY]: 4,
    },
    [constants.PLAN_STANDARD]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 4,
      [constants.PLAN_TIER_COMPANY]: 8,
    },
    [constants.PLAN_PREMIUM]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 8,
      [constants.PLAN_TIER_COMPANY]: 16,
    },
  },
  [constants.APP_NOTES]: {
    [constants.PLAN_BASIC]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 1,
      [constants.PLAN_TIER_COMPANY]: 2,
    },
    [constants.PLAN_STANDARD]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 2,
      [constants.PLAN_TIER_COMPANY]: 4,
    },
    [constants.PLAN_PREMIUM]: {
      [constants.PLAN_TIER_FREE_TRIAL]: 0,
      [constants.PLAN_TIER_INDIVIDUAL]: 4,
      [constants.PLAN_TIER_COMPANY]: 8,
    },
  },
};
