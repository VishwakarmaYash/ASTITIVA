import { Product, Order, Customer } from './website/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aurelia Tote Bag',
    sku: 'VL-77291',
    category: 'Accessories',
    price: 1850.00,
    stock: 24,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1GEylk7fe00zTCibl360397qKbW4fpUIkowXKVv4k_mIOt99VKRGQs5uLlFYdJaY8f9NQlTXcG9OxwEu1SLs0yHSeaZygQLS6-nwKkAcAlNpgFjhwIHN_41_zH5pRxXcClPXD_JX5cF0NkCTVeT_yNnM0A3aevEfnEL2TRQ5vPIJCdVhp4gPJTZp_qCEzSSd3G24bNlY1Fw1xsAchslNctwBG0RHawoxY7vf2DsL4myZ6x-cBQ7w',
    description: 'A masterpiece of contemporary luxury. The Aurelia Tote Bag is crafted from smooth obsidian calfskin leather with polished gold-toned hardware. Perfectly balanced layout for standard daily elegance.',
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['#000000', '#D4AF37', '#8B5A2B']
  },
  {
    id: '2',
    name: 'Chronos Heritage XL',
    sku: 'VL-11204',
    category: 'Timepieces',
    price: 12400.00,
    stock: 2,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwbTNJBEFE8ftbJFP0Yl3XZQ8Ps3o5c2__sxNzi2dFbOZfkee-JKIs4LvHDH6nYy3bzDDHeAAZLL7QO7eM2h90tTW-9HOt5gsoz_FW3QRs8y82LuiLMmfUHqvcE8chFawctDpQVFJEy3m2V7WL2WcZKK7N3EFporVWQdtlfsXWCrqosdueSoifOV2MRZDAbNlF9IDGrVF2eM52PQnV1hVGVPdfHju7vBiIeECLU_AidprU6E3SBvgx',
    description: 'Exquisite Swiss-made automatic chronograph with brushed platinum casing, a deep ocean-navy dial, and reflective sapphire crystal casing. Engineered for high performance.',
    sizes: ['Standard 42mm', 'Oversized 45mm'],
    colors: ['#C0C0C0', '#002D61']
  },
  {
    id: '3',
    name: 'Ventus Low Pro',
    sku: 'VL-00832',
    category: 'Footwear',
    price: 890.00,
    stock: 0,
    status: 'Draft',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA20Zewt_Tbl-Wc7BfuJ4gLJWyhxOvy0tSuaMUfmN0KjYk7uE985ViWgdgvwGiublh4NmZ3OyKBOYbbfLOSIya7O5dWTsjSpf9FZ5EIc65ewIgtbLH7qIyMY0nwmBB8AaJ8mPw88-cdYWpFtjfGTh5bst5U2RKYtqesZEVpnnejY6fzIYkw8rl5n4E68AmoDEbvUq55qOPZuH1hSDUuh5nWdPD9VwUVeF6pEknBpzGIe1LWYVRRCzzD',
    description: 'Premium calfskin leather low-profile sneakers, designed with minimalist beige and off-white contrasting panels. Features an ergonomic durable natural vulcanized rubber sole.',
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    colors: ['#F5F5F7', '#E5E7EB', '#D2B48C']
  },
  {
    id: '4',
    name: 'Chronograph Midnight Edition',
    sku: 'CHR-M1',
    category: 'Timepieces',
    price: 14500.00,
    stock: 2,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkj6GKeEfy4ba9nbHOjBPwpeWe8aFcMNSggjFfx6SRc90Y4qAtGHE6dBl_yuiogLPvuteCtDlYB3voF9MPYBAecSvnzlQ0xwXLnPyxeDt3E0tJ-1Sg6GLbub_M5mbhxzzKc-uPreEHBIekyBehLe1OCLVrt9_G8D-Clyan9AvYgnNb2SrfoIVc-khwuROaVRE4HHmGCrSggTsL4wYm_vQPavDQXBywK9FpVYpPomwoGhJSGiTCdbb-',
    description: 'A striking all-black execution of our flagship chronograph. Scratch-resistant obsidian ceramic outer casing, carbon fiber complications, and a premium hand-stitched alligator strap.',
    sizes: ['40mm Slim', '42mm Standard'],
    colors: ['#000000']
  },
  {
    id: '5',
    name: 'AeroSound Elite Wireless',
    sku: 'AS-EW9',
    category: 'Accessories',
    price: 650.00,
    stock: 5,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdNuWlEki3rbDfyXB880pQLE1xBy6Je7Y3RRGZZY7gDFi7dsWcykXA1A8XbCv71wYSeE-ZiMyBFEgMPQNyAqSGL5ZgJaYJxQUEgV0_us7zjAtE_fFfyX2goDv7UeUZtJS0mBQSw8wNyMPAY58VWXgm2oBoAO5wfgwsGO3maVd4DZ-k09qOEcc8HKvJB0GEnHa8P9KFI4h_FUYsgoSonr80S9wwzCrfNje-APQFN_cUTLQen299S9Sc',
    description: 'Acoustic perfection meets modern minimalist architecture. Precision-turned brushed aluminum arms, luxurious memory foam ear cushions clad in lambskin leather, and custom hybrid active noise cancellation.',
    sizes: ['One Size Fits All'],
    colors: ['#C0C0C0', '#FFFFFF']
  },
  {
    id: '6',
    name: 'Nordic Cedar Candle',
    sku: 'NC-C22',
    category: 'Accessories',
    price: 120.00,
    stock: 12,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2iPNRik6yCNrwfZ42QZbeIWMZrNk4k6pog3yhhymSaYRxrGl7l5LOIEGj2hQYPI_dCjzmHhLbHR35F2BqpvehVbH7F8xhGaeqSmecdX5io4ayDuT9MXNAaNpM_g8Z_klxeJ-_kitH7b6vOk5Bn2OCUJmBGGQRV4YP8fHPvnRcHVcSBuLVOsCHtWosqbaqpNow3TdpTpA0SZ19oKtlrUNYmuFcVw_p4eZnrFdhsaxL2Kgsw8qyyo-S',
    description: 'Scented soy-wax candle housed in a heavy custom-molded frosted glass vessel with an embossed gold-leaf label. Warm, rich notes of smoked cedarwood, native amber, pine needle extract, and black pepper.',
    sizes: ['Standard 250g', 'Grande 600g'],
    colors: ['#F3F3F5']
  },
  {
    id: '7',
    name: 'Eclipse Gold Series',
    sku: 'EG-S5',
    category: 'Accessories',
    price: 520.00,
    stock: 1,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNDKpqpeZZnUTJPhw2ssYnjNDNpKM1D3BcBhtQFCiW_ilJVNZ7rNRLl4fZlcJ50KU8mk6AkN-pymExL-H77sqNCl_KhzFUNsUHOwvuNeKKKIOF8hNZvfU4zJW7HstOszDWhEKWHTTkxccNa_T-toQkOplRY-E_IgW_KL_08AKD_Ta3jA9E8tJL_Hv3NsD6mQMgxseyA3e6gJH1WM_9anY5FhvzwsBFHot0RS2gmf3sWq9maop_mExl',
    description: 'Designer high-contrast sunglasses featuring double-bar 18k gold-plated frames, dark tinted UV400 lenses, and bespoke Italian white marble structural temples.',
    sizes: ['Medium Regular'],
    colors: ['#D4AF37', '#000000']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#VT-90210',
    customerName: 'Aria Montgomery',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj5m-bd0hV8l1t_1WD6fmBdQdv_1n3UXljHrrD8veeZucBTuDbi2R16EcKDso743k78a8xFblpoFYKsJ51fNHQNKbR8zdZgbsBP9U7Fd-pXEtLgBxzk1ctBmDv2Ja_KT-wTdLwWmJ305qy_Q3fXRLjPzfiWdfF4Xng__6jPVDrB43OMXOyt_U2CqeG6njDl11p4IaCA_HT3jW7qNBsYPagQb8HlE_8H9H1IMv35cufQUj8rGg_v6S9',
    email: 'aria.m@vogue.com',
    phone: '+1 (555) 724-1189',
    date: 'Oct 24, 2023',
    amount: 12450.00,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    items: [
      { productName: 'Chronos Heritage XL', sku: 'VL-11204', price: 12400.00, quantity: 1 },
      { productName: 'Eclipse Gold Series', sku: 'EG-S5', price: 50.00, quantity: 1 }
    ]
  },
  {
    id: '#VT-90209',
    customerName: 'Julian Vane',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL4YJLqWEonb50hoDaALeX2-VMJogLH2bDyZRnyAKFVnEkt5t3QjxtEsK7FZYCJdX6mJW4oEW3cbrAYNyQdoxF9BaVpUFJYXIEG115xX_2GWd9Gd81-IGOnzUTHQ__XqokyTyO1-uD5z4DdnOIqW9PSbFvtgJWqJfv94dm3Tqer2U0_8WafsfJEuVSaAbgg_Oi3B7CyOcUIDDM99Cr6wRvns0M7GSsfdfkvIGnhwzZn0f0mP9it1Z',
    email: 'j.vane@heritage.co',
    phone: '+1 (555) 349-0192',
    date: 'Oct 23, 2023',
    amount: 8920.00,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    items: [
      { productName: 'Aurelia Tote Bag', sku: 'VL-77291', price: 1850.00, quantity: 4 },
      { productName: 'AeroSound Elite Wireless', sku: 'AS-EW9', price: 650.00, quantity: 2 }
    ]
  },
  {
    id: '#VT-90195',
    customerName: 'Elena Rossi',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi3FHwaEpYy5dWU5nBsilHpeKGOAiIBAOy_cftLMAxYQvpPRiuFYkBfL18AiKGX0AUXzcYGqr5GDq-4dxQuKcXKvLvLYYKobxYpvC1_JACZKkg7ABbpTZZHcJbgICrUePPBkVy9nFwqcYayx0kxnnHiAupKZuaLX1DcYG65S5sygAnCZpsr8YZSj6Z_pGSD6l9hiRmiw_tVwvZlxxfUXaPwoZQajiub2zV65MbPwWRtUYJTlkBHN54',
    email: 'e.rossi@design.it',
    phone: '+39 02 8943 21',
    date: 'Oct 22, 2023',
    amount: 34200.00,
    paymentStatus: 'Pending',
    orderStatus: 'On Hold',
    items: [
      { productName: 'Chronos Heritage XL', sku: 'VL-11204', price: 12400.00, quantity: 2 },
      { productName: 'Chronograph Midnight Edition', sku: 'CHR-M1', price: 14500.00, quantity: 1 }
    ]
  },
  {
    id: '#VT-90190',
    customerName: 'Julianne Vought',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgO9D3v3YqNKTYJUqWSDtMfdj_xnzjFKF0xVanoBJaIxDUI9grBk38uRdLU8LLT75heCHMvs9Dw1HjQmn8dCSQZtQbQJuoxWKlo3BEtunTvlZdg4yKogLZO6lgRU_yOQ7E-uSesP7ewu-zj2FR5zrCVxH-oAaAYY7OXoF-iGXLYv-wYDY0HV7-WNj2pAM45iBU5IhNoJ5JJP9YWxuoEbTZJiv02grE47j8vWtQUIiSlONM-rHRKRtd',
    email: 'j.vought@luxury.com',
    phone: '+1 (555) 890-2431',
    date: 'Oct 21, 2023',
    amount: 2450.00,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    items: [
      { productName: 'Aurelia Tote Bag', sku: 'VL-77291', price: 1850.00, quantity: 1 },
      { productName: 'Nordic Cedar Candle', sku: 'NC-C22', price: 120.00, quantity: 5 }
    ]
  },
  {
    id: '#VT-90180',
    customerName: 'Arthur Morgan',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL4YJLqWEonb50hoDaALeX2-VMJogLH2bDyZRnyAKFVnEkt5t3QjxtEsK7FZYCJdX6mJW4oEW3cbrAYNyQdoxF9BaVpUFJYXIEG115xX_2GWd9Gd81-IGOnzUTHQ__XqokyTyO1-uD5z4DdnOIqW9PSbFvtgJWqJfv94dm3Tqer2U0_8WafsfJEuVSaAbgg_Oi3B7CyOcUIDDM99Cr6wRvns0M7GSsfdfkvIGnhwzZn0f0mP9it1Z',
    email: 'arthur.m@outlaws.com',
    phone: '+1 (555) 189-9011',
    date: 'Oct 20, 2023',
    amount: 4200.00,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    items: [
      { productName: 'Aurelia Tote Bag', sku: 'VL-77291', price: 1850.00, quantity: 2 },
      { productName: 'AeroSound Elite Wireless', sku: 'AS-EW9', price: 500.00, quantity: 1 }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'C-001',
    name: 'Julianne Vought',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgO9D3v3YqNKTYJUqWSDtMfdj_xnzjFKF0xVanoBJaIxDUI9grBk38uRdLU8LLT75heCHMvs9Dw1HjQmn8dCSQZtQbQJuoxWKlo3BEtunTvlZdg4yKogLZO6lgRU_yOQ7E-uSesP7ewu-zj2FR5zrCVxH-oAaAYY7OXoF-iGXLYv-wYDY0HV7-WNj2pAM45iBU5IhNoJ5JJP9YWxuoEbTZJiv02grE47j8vWtQUIiSlONM-rHRKRtd',
    email: 'j.vought@luxury.com',
    phone: '+1 (555) 890-2431',
    joinedDate: 'Joined Oct 2023',
    totalOrders: 24,
    totalSpending: 12450.00,
    status: 'VIP',
    recentOrdersList: [
      { id: '#ORD-9021', date: 'Mar 02, 2024', amount: 1240.00 },
      { id: '#ORD-8842', date: 'Feb 14, 2024', amount: 890.00 },
      { id: '#ORD-8610', date: 'Jan 28, 2024', amount: 2100.00 }
    ],
    timeline: [
      {
        id: 'T1',
        type: 'order',
        title: 'Order Delivered',
        date: 'Mar 05, 2024 • 14:32 PM',
        description: '"Luxury Watch - Platinum Series" was signed by customer.'
      },
      {
        id: 'T2',
        type: 'loyalty',
        title: 'Loyalty Points Earned',
        date: 'Mar 02, 2024 • 11:15 AM',
        description: '+1,240 points added to balance.'
      },
      {
        id: 'T3',
        type: 'profile',
        title: 'Profile Updated',
        date: 'Feb 28, 2024 • 09:45 AM',
        description: 'Changed primary shipping address.'
      }
    ]
  },
  {
    id: 'C-002',
    name: 'Marcus Sterling',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL4YJLqWEonb50hoDaALeX2-VMJogLH2bDyZRnyAKFVnEkt5t3QjxtEsK7FZYCJdX6mJW4oEW3cbrAYNyQdoxF9BaVpUFJYXIEG115xX_2GWd9Gd81-IGOnzUTHQ__XqokyTyO1-uD5z4DdnOIqW9PSbFvtgJWqJfv94dm3Tqer2U0_8WafsfJEuVSaAbgg_Oi3B7CyOcUIDDM99Cr6wRvns0M7GSsfdfkvIGnhwzZn0f0mP9it1Z',
    email: 'm.sterling@exec.com',
    phone: '+1 (555) 123-4567',
    joinedDate: 'Joined Jan 2024',
    totalOrders: 18,
    totalSpending: 8920.00,
    status: 'Member',
    recentOrdersList: [
      { id: '#ORD-8910', date: 'Mar 01, 2024', amount: 520.00 },
      { id: '#ORD-8799', date: 'Feb 10, 2024', amount: 1850.00 }
    ],
    timeline: [
      {
        id: 'T4',
        type: 'order',
        title: 'Order Placed',
        date: 'Mar 01, 2024 • 10:12 AM',
        description: 'Placed order #ORD-8910 for Eclipse Gold Series sunglasses.'
      }
    ]
  },
  {
    id: 'C-003',
    name: 'Elena Rossi',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi3FHwaEpYy5dWU5nBsilHpeKGOAiIBAOy_cftLMAxYQvpPRiuFYkBfL18AiKGX0AUXzcYGqr5GDq-4dxQuKcXKvLvLYYKobxYpvC1_JACZKkg7ABbpTZZHcJbgICrUePPBkVy9nFwqcYayx0kxnnHiAupKZuaLX1DcYG65S5sygAnCZpsr8YZSj6Z_pGSD6l9hiRmiw_tVwvZlxxfUXaPwoZQajiub2zV65MbPwWRtUYJTlkBHN54',
    email: 'e.rossi@design.it',
    phone: '+39 02 8943 21',
    joinedDate: 'Joined Dec 2023',
    totalOrders: 42,
    totalSpending: 31200.00,
    status: 'VIP',
    recentOrdersList: [
      { id: '#ORD-9011', date: 'Mar 04, 2024', amount: 14500.00 },
      { id: '#ORD-8955', date: 'Feb 20, 2024', amount: 12400.00 }
    ],
    timeline: [
      {
        id: 'T5',
        type: 'order',
        title: 'High-Value Order Delivered',
        date: 'Mar 07, 2024 • 16:10 PM',
        description: 'Delivered Chronograph Midnight Edition. Confirmed signature.'
      }
    ]
  }
];
