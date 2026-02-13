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
        img: 'photo-1571175443880-49e1d25b2bc5',
        category: 'HELADERAS',
        name: 'Heladera No Frost 350L Inverter',
        price: 249999,
        priceFormatted: '$249,999',
        oldPrice: 329999,
        oldPriceFormatted: '$329,999',
        badge: 'NUEVO',
        badgeColor: 'bg-green-500',
        categoryColor: 'text-primary',
        rating: 4,
        description: 'Tecnología inverter, bajo consumo'
    },
    {
        id: '2',
        img: 'photo-1626806787461-102c1bfaaea1',
        category: 'LAVARROPAS',
        name: 'Lavarropas Carga Superior 7kg',
        price: 159999,
        priceFormatted: '$159,999',
        oldPrice: 209999,
        oldPriceFormatted: '$209,999',
        badge: '-25%',
        badgeColor: 'bg-red-500',
        categoryColor: 'text-blue-400',
        rating: 5,
        description: 'Carga superior, 7kg de capacidad'
    },
    {
        id: '3',
        img: 'photo-1585659722983-3a675dabf23d',
        category: 'HORNOS',
        name: 'Horno Eléctrico Empotrable 60cm',
        price: 179999,
        priceFormatted: '$179,999',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: null,
        badgeColor: '',
        categoryColor: 'text-purple-400',
        rating: 4,
        description: 'Empotrable, multifunción'
    },
    {
        id: '4',
        img: 'photo-1574269909862-7e1d70bb8078',
        category: 'MICROONDAS',
        name: 'Microondas Digital 28L Grill',
        price: 89999,
        priceFormatted: '$89,999',
        oldPrice: 119999,
        oldPriceFormatted: '$119,999',
        badge: 'OFERTA',
        badgeColor: 'bg-amber-500',
        categoryColor: 'text-amber-400',
        rating: 5,
        description: '28L, función grill'
    },
    {
        id: '5',
        img: 'photo-1588854337221-4cf9fa96059c',
        category: 'AIRE ACONDICIONADO',
        name: 'Aire Split Frío/Calor 3500W',
        price: 329999,
        priceFormatted: '$329,999',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: null,
        badgeColor: '',
        categoryColor: 'text-cyan-400',
        rating: 4,
        description: 'Split, frío/calor, 3500W'
    },
    {
        id: '6',
        img: 'photo-1556911220-bff31c812dba',
        category: 'LAVAVAJILLAS',
        name: 'Lavavajillas 12 Cubiertos A++',
        price: 279999,
        priceFormatted: '$279,999',
        oldPrice: 399999,
        oldPriceFormatted: '$399,999',
        badge: '-30%',
        badgeColor: 'bg-red-500',
        categoryColor: 'text-pink-400',
        rating: 5,
        description: '12 cubiertos, eficiencia A++'
    },
    {
        id: '7',
        img: 'photo-1595515106969-1ce29566ff1c',
        category: 'COCINAS',
        name: 'Cocina a Gas 4 Hornallas Vidrio',
        price: 199999,
        priceFormatted: '$199,999',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: null,
        badgeColor: '',
        categoryColor: 'text-emerald-400',
        rating: 4,
        description: '4 hornallas, tapa de vidrio'
    },
    {
        id: '8',
        img: 'photo-1558618666-fcd25c85cd64',
        category: 'FREEZERS',
        name: 'Freezer Vertical 250L A+ Inverter',
        price: 219999,
        priceFormatted: '$219,999',
        oldPrice: null,
        oldPriceFormatted: null,
        badge: 'ECO',
        badgeColor: 'bg-green-500',
        categoryColor: 'text-primary',
        rating: 5,
        description: 'Vertical, 250L, bajo consumo'
    },
];
