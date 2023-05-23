export const CHAINS = [
  {
    name: 'scroll-alpha-testnet',
    chain_id: '534353',
    is_testnet: true,
    label: 'Scroll Alpha Testnet',
    category_label: 'Ethereum',
    logo_url:
      'https://pbs.twimg.com/profile_images/1523593944386326528/rVjsezsD_400x400.jpg',
    black_logo_url:
      'https://pbs.twimg.com/profile_images/1523593944386326528/rVjsezsD_400x400.jpg',
    white_logo_url:
      'https://pbs.twimg.com/profile_images/1523593944386326528/rVjsezsD_400x400.jpg',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0xd9880690bd717189cc3fbe7b9020f27fae7ac76f',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Scroll Alpha Testnet',
        description: 'Have at least one transaction on Scroll Alpha Testnet',
        image_url: '/badges/scroll-alpha-testnet/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ]
  },
  {
    name: 'linea-testnet',
    chain_id: '59140',
    is_testnet: true,
    label: 'Linea Testnet',
    category_label: 'Ethereum',
    logo_url:
      'https://www.datocms-assets.com/86369/1679953850-property-1-linea-colour.png',
    black_logo_url:
      'https://www.datocms-assets.com/86369/1679953850-property-1-linea-colour.png',
    white_logo_url:
      'https://www.datocms-assets.com/86369/1679953850-property-1-linea-colour.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x7191061d5d4c60f598214cc6913502184baddf18',
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png'
      }
    ],
    achievements: []
  }
];
