// src/app/products/page.tsx

import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const screenshotAppPlans = [
    {
      name: 'Free Plan',
      price: '$0/month',
      features: [
        'Basic Capture',
        'Watermark Included',
        'Limited Storage',
        'Community Support',
      ],
    },
    {
      name: 'Pro Plan',
      price: '$5/month',
      features: [
        'Advanced Capture',
        'No Watermark',
        '5GB Storage',
        'Email Support',
      ],
    },
    {
      name: 'Team Plan',
      price: '$15/month',
      features: [
        'Team Collaboration',
        '10GB Storage',
        'Priority Support',
        'Analytics',
      ],
    },
    {
      name: 'Enterprise Plan',
      price: 'Custom Pricing',
      features: [
        'Unlimited Storage',
        'Dedicated Support',
        'Custom Features',
        'API Access',
      ],
    },
  ];

  const notesAppPlans = [
    {
      name: 'Free Plan',
      price: '$0/month',
      features: [
        'Basic Notes',
        'Sync Across 2 Devices',
        'Limited Storage',
        'Community Support',
      ],
    },
    {
      name: 'Pro Plan',
      price: '$4/month',
      features: [
        'Rich Formatting',
        'Sync Across 5 Devices',
        '5GB Storage',
        'Email Support',
      ],
    },
    {
      name: 'Team Plan',
      price: '$12/month',
      features: [
        'Team Collaboration',
        '10GB Storage',
        'Priority Support',
        'Version History',
      ],
    },
    {
      name: 'Enterprise Plan',
      price: 'Custom Pricing',
      features: [
        'Unlimited Storage',
        'Dedicated Support',
        'Custom Integrations',
        'SSO',
      ],
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>

      <div className="space-y-12">
        <ProductCard
          title="Screenshot Capture App"
          description="Capture and manage your screenshots with ease."
          plans={screenshotAppPlans}
        />

        <ProductCard
          title="Notes App"
          description="Take and organize notes efficiently."
          plans={notesAppPlans}
        />
      </div>
    </div>
  );
}
