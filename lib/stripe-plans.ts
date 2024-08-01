type TStripePlan = {
  name: string;
  price: number;
  priceId: string;
  priceInterval: string;
  description?: string;
  isFeatured?: boolean;
  featuredLabel?: string;
  features?: {
    name: string;
  }[];
};

const stripePlans: TStripePlan[] = [
  {
    name: "Monthly",
    price: 4.99,
    priceId: "price_1PiJutAoI61yS8advIoLnEpt",
    priceInterval: "month",
    description: "Become a verified creator for one month",
    features: [
      {
        name: "Get a cool checkmark",
      },
    ],
  },
  {
    name: "Yearly",
    price: 49.99,
    priceInterval: "year",
    priceId: "price_1PiJuOAoI61yS8adhoCZdR34",
    description: "Become a verified creator for one year",
    isFeatured: true,
    featuredLabel: "Best Value",
    features: [
      {
        name: "Get a cool checkmark",
      },
      {
        name: "Save 16% vs. Monthly",
      },
    ],
  },
];

export { stripePlans, type TStripePlan };
