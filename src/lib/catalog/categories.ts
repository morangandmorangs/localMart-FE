import type { Category } from './types';

/** The catalogue that drives the hero quick-tiles and the category grid.
 *  UI reads this — nothing below renders a hard-coded category. */
export const CATEGORIES: Category[] = [
  {
    slug: 'livestock-vegetables',
    title: 'Livestock & Vegetables',
    subtitle: 'From local farms and ghats',
    tileLabel: 'Fresh daily',
    icon: 'leaf',
    image: 'https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Shop fresh',
    subCategories: [
      { slug: 'seasonal-vegetables', label: 'Seasonal vegetables' },
      { slug: 'leafy-greens-herbs', label: 'Leafy greens & herbs' },
      { slug: 'fresh-fish', label: 'Fresh fish' },
      { slug: 'chicken-duck-mutton', label: 'Chicken, duck & mutton' },
      { slug: 'eggs', label: 'Eggs' },
      { slug: 'fruits', label: 'Fruits' },
    ],
  },
  {
    slug: 'grocery',
    title: 'Grocery',
    subtitle: 'Kitchen staples and home needs',
    tileLabel: 'Staples',
    icon: 'basket',
    image: 'https://images.pexels.com/photos/5951182/pexels-photo-5951182.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Shop grocery',
    subCategories: [
      { slug: 'rice-atta-dal', label: 'Rice, atta & dal' },
      { slug: 'oil-ghee-spices', label: 'Oil, ghee & spices' },
      { slug: 'assam-tea-beverages', label: 'Assam tea & beverages' },
      { slug: 'dairy-bakery', label: 'Dairy & bakery' },
      { slug: 'snacks-packaged-food', label: 'Snacks & packaged food' },
      { slug: 'cleaning-household', label: 'Cleaning & household' },
    ],
  },
  {
    slug: 'food',
    title: 'Food',
    subtitle: 'Cooked fresh by local kitchens',
    tileLabel: 'Hot meals',
    icon: 'bowl',
    image: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Order food',
    subCategories: [
      { slug: 'assamese-thali', label: 'Assamese thali' },
      { slug: 'home-style-tiffin', label: 'Home-style tiffin' },
      { slug: 'pitha-sweets', label: 'Pitha & sweets' },
      { slug: 'street-food-snacks', label: 'Street food & snacks' },
      { slug: 'cakes-bakery', label: 'Cakes & bakery' },
      { slug: 'healthy-bowls', label: 'Healthy bowls' },
    ],
  },
  {
    slug: 'medicine',
    title: 'Medicine',
    subtitle: 'Licensed pharmacies only',
    tileLabel: 'Rx verified',
    icon: 'pill',
    image: 'https://images.pexels.com/photos/8900031/pexels-photo-8900031.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'rx',
    cta: 'Upload prescription',
    notice:
      'Rx items ship only after a pharmacist checks your valid prescription. No substitutions without consent.',
    subCategories: [
      {
        slug: 'prescription-medicines',
        label: 'Prescription medicines',
        requiresPrescription: true,
      },
      { slug: 'over-the-counter', label: 'Over-the-counter' },
      { slug: 'baby-mother-care', label: 'Baby & mother care' },
      { slug: 'health-devices', label: 'Health devices' },
    ],
  },
];

export const categoryPath = (slug: string) => `/category/${slug}`;
export const subCategoryPath = (slug: string, sub: string) =>
  `/category/${slug}/${sub}`;

/** Where the Rx flow starts. Anything flagged requiresPrescription routes
 *  here instead of to the cart. */
export const PRESCRIPTION_UPLOAD_PATH = '/prescription/upload';
