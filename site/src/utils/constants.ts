import exp from 'constants';

// src/utils/constants.ts
export const APP_CAPTURE = 'Screenshot Capture App' as const;
export const APP_NOTES = 'Notes App' as const;
export const DISCOUNT_RATE = 0.5 as const; //Percentage

export const PLAN_BASIC = 'Basic' as const;
export const PLAN_STANDARD = 'Standard' as const;
export const PLAN_PREMIUM = 'Premium' as const;

export const TIER_TRIAL = 'Free Trial' as const;
export const TIER_INDIVIDUAL = 'Individual' as const;
export const TIER_COMPANY = 'Company' as const;
export const QTY_DEFAULT = 1 as const;
export const QTY_MIN = 1 as const;
export const QTY_MAX = 100 as const;
export const CURRENCY_USD = 'USD' as const;
export const STATUS_CANCELLED = 'Cancelled' as const;
export const STATUS_PENDING = 'Pending' as const;
export const STATUS_PAID = 'Paid' as const;
export const STATUS_COMPLETED = 'Completed' as const;

 

export const FEATURES = {
  [APP_CAPTURE]: {
    [PLAN_BASIC]: [
      '✅ Capture interval 5 minutes to 10 hours',
      '✅ Save up to 100 screenshots/day',
      '✅ Image quality Max: 500 Kb',
      '✅ On/Off client notification',
      '✅ Remote On/Off capture',
      '✅ Folder date format',
      '❌ Save under nickname',
      '❌ Last captured time',
      '❌ Storage used info',
      '❌ Save as video',
      '❌ Video length N/A',
      '❌ 2 Step authentication',
      '❌ Email support',
    ],
    [PLAN_STANDARD]: [
      '✅ Capture interval 2 minutes to 10 hours',
      '✅ Save up to 300 screenshots/day',
      '✅ Image quality Max: 1 Mb',
      '✅ On/Off client notification',
      '✅ Remote On/Off capture',
      '✅ Folder date format',
      '✅ Save under nickname',
      '✅ Last captured time',
      '❌ Storage used info',
      '❌ Save as video',
      '❌ Video length N/A',
      '❌ 2 Step authentication',
      '❌ Email support',
    ],
    [PLAN_PREMIUM]: [
      '✅ Capture interval 1 second 5 hours',
      '✅ Save up to 50000 screenshots/day',
      '✅ Image quality Max: 5 Mb',
      '✅ On/Off client notification',
      '✅ Remote On/Off capture',
      '✅ Folder date format',
      '✅ Save under nickname',
    ],
  },
  [APP_NOTES]: {
    [PLAN_BASIC]: [
      '✅ Create and organize notes',
      '✅ Sync across devices',
      '✅ Rich text formatting',
      '✅ Search within notes',
      '✅ Auto-save functionality',
      '✅ Note tagging',
      '✅ Note categorization',
      '✅ Dark mode support',
      '❌ Voice-to-text notes',
      '❌ Handwriting recognition',
      '❌ Offline access',
      '❌ Collaboration features',
      '❌ Password-protected notes',
      '❌ Cloud backup',
      '❌ Priority support',
    ],
    [PLAN_STANDARD]: [
      '✅ Create and organize notes',
      '✅ Sync across devices',
      '✅ Rich text formatting',
      '✅ Search within notes',
      '✅ Auto-save functionality',
      '✅ Note tagging',
      '✅ Note categorization',
      '✅ Dark mode support',
      '✅ Voice-to-text notes',
      '✅ Handwriting recognition',
      '✅ Offline access',
      '❌ Collaboration features',
      '❌ Password-protected notes',
      '❌ Cloud backup',
      '❌ Priority support',
    ],
    [PLAN_PREMIUM]: [
      '✅ Create and organize notes',
      '✅ Sync across devices',
      '✅ Rich text formatting',
      '✅ Search within notes',
      '✅ Auto-save functionality',
      '✅ Note tagging',
      '✅ Note categorization',
      '✅ Dark mode support',
      '✅ Voice-to-text notes',
      '✅ Handwriting recognition',
      '✅ Offline access',
      '✅ Collaboration features',
      '✅ Password-protected notes',
      '✅ Cloud backup',
      '✅ Priority support',
    ],
  },
} as const;
