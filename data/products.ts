export interface ProductData {
    id: string;
    img: string;
    category: string;
    name: string;
    price: number;
    priceFormatted: string;
    oldPrice: number | null;
    oldPriceFormatted: string | null;
    badge: string | null;
    badgeColor: string;
    categoryColor: string;
    rating: number;
    description: string;
}

export const PRODUCTS_DATA: ProductData[] = [
    {
        id: '1',
        img: 'photo-1695048133142-1a20484d2569', // iPhone 15 Pro Max equivalent
        category: 'SMARTPHONES',
        name: 'iPhone 15 Pro Max Titanium',
        price: 13500000,
        priceFormatted: '₲ 13.500.000',
        oldPrice: 15000000,
        oldPriceFormatted: '₲ 15.000.000',
        badge: 'NUEVO',
        badgeColor: 'bg-blue-600',
        categoryColor: 'text-primary',
        rating: 5,
        description: 'Titanium design, A17 Pro chip'
    },
    {
        id: '2',
        img: 'photo-1611186871348-b1ce696e52c9', // MacBook Pro (using working MBA image for now)
        category: 'LAPTOPS',
        name: 'MacBook Pro 14" M3 Pro',
        price: 18400000,
        priceFormatted: '₲ 18.400.000',
        oldPrice: 21000000,
        oldPriceFormatted: '₲ 21.000.000',
        badge: '-15%',
        badgeColor: 'bg-red-500',
        categoryColor: 'text-indigo-500',
        rating: 5,
        description: 'Potencia extrema para profesionales'
    },
    {
        id: '3',
        img: 'photo-1544244015-0df4b3ffc6b0', // iPad Pro
        category: 'TABLETS',
        name: 'iPad Pro 12.9" M2',
        price: 9800000,
        priceFormatted: '₲ 9.800.000',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: null,
        badgeColor: '',
        categoryColor: 'text-purple-500',
        rating: 4,
        description: 'La experiencia definitiva en iPad'
    },
    {
        id: '4',
        img: 'https://lh3.googleusercontent.com/22AC6Qcb5-4qN6QJTkBzGK2N5kS5AZyuss9AcAQzAuxjHqGz3VfI5-MSXsKDzuUuePoqHAmyAFyewt9CdNyw3oQikUDY7dTSmyDsVPo=rw-e365-w842-v1',
        category: 'SMARTPHONES',
        name: 'Google Pixel 8 Pro',
        price: 8200000,
        priceFormatted: '₲ 8.200.000',
        oldPrice: 9500000,
        oldPriceFormatted: '₲ 9.500.000',
        badge: 'OFERTA',
        badgeColor: 'bg-green-500',
        categoryColor: 'text-primary',
        rating: 5,
        description: 'La mejor cámara con IA de Google'
    },
    {
        id: '5',
        img: 'photo-1610945415295-d9bbf067e59c', // Samsung S24 Ultra eq
        category: 'SMARTPHONES',
        name: 'Samsung Galaxy S24 Ultra',
        price: 11500000,
        priceFormatted: '₲ 11.500.000',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: 'HOT',
        badgeColor: 'bg-orange-500',
        categoryColor: 'text-primary',
        rating: 5,
        description: 'Galaxy AI is here'
    },
    {
        id: '6',
        img: 'photo-1611186871348-b1ce696e52c9', // MacBook Air
        category: 'LAPTOPS',
        name: 'MacBook Air 15" M2',
        price: 12100000,
        priceFormatted: '₲ 12.100.000',
        oldPrice: 14000000,
        oldPriceFormatted: '₲ 14.000.000',
        badge: null,
        badgeColor: '',
        categoryColor: 'text-indigo-500',
        rating: 4,
        description: 'Delgada. Ligera. Poderosa.'
    },
    {
        id: '7',
        img: 'photo-1589739900243-4b52cd9b104e', // Galaxy Tab
        category: 'TABLETS',
        name: 'Samsung Galaxy Tab S9 En',
        price: 6500000,
        priceFormatted: '₲ 6.500.000',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: null,
        badgeColor: '',
        categoryColor: 'text-purple-500',
        rating: 4,
        description: 'Tablet Android de alto rendimiento'
    },
    {
        id: '8',
        img: 'https://tecnoga.com.py/wp-content/uploads/2024/11/3-12.jpg',
        category: 'SMARTPHONES',
        name: 'iPhone 14 128GB',
        price: 6200000,
        priceFormatted: '₲ 6.200.000',
        oldPrice: 7500000,
        oldPriceFormatted: '₲ 7.500.000',
        badge: '-15%',
        badgeColor: 'bg-red-500',
        categoryColor: 'text-primary',
        rating: 5,
        description: 'Increíble como siempre'
    }
];
