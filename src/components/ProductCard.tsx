// src/components/ProductCard.tsx

type Plan = {
  name: string;
  price: string;
  features: string[];
};

type ProductCardProps = {
  title: string;
  description: string;
  plans: Plan[];
};

export default function ProductCard({
  title,
  description,
  plans,
}: ProductCardProps) {
  return (
    <div className="border p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-lg font-bold mb-2">{plan.price}</p>
            <ul className="list-disc list-inside">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
