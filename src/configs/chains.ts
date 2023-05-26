export const CHAINS = [
  {
    name: 'base-testnet',
    chain_id: '84531',
    is_testnet: true,
    label: 'Base Testnet',
    category_label: 'Ethereum',
    logo_url:
      'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.jpg',
    black_logo_url:
      'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.jpg',
    white_logo_url:
      'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.jpg',
    is_appchain: false,
    appchain_of: null,
    protocols: [],
    achievements: [
      {
        name: 'Welcome to Base Testnet',
        description: 'Have at least one transaction on Base Testnet',
        image_url: '/badges/base-testnet/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://goerli.basescan.org/',
    scores: {
      txCount: {
        min: 1,
        average: 35,
        max: 500
      },
      contractCount: {
        min: 1,
        average: 35,
        max: 500
      },
      valueQuoteSum: {
        min: 1,
        average: 1000,
        max: 1000000
      },
      gasQuoteSum: {
        min: 1,
        average: 35,
        max: 500
      }
    }
  },
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
      },
      {
        address: '0xC458eED598eAb247ffc19d15F19cf06ae729432c',
        label: 'Syncswap',
        logo_url: '/protocols/syncswap.jpg'
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
    ],
    block_explorer_url: 'https://blockscout.scroll.io/',
    scores: {
      txCount: {
        min: 1,
        average: 35,
        max: 500
      },
      contractCount: {
        min: 1,
        average: 35,
        max: 500
      },
      valueQuoteSum: {
        min: 1,
        average: 1000,
        max: 1000000
      },
      gasQuoteSum: {
        min: 1,
        average: 35,
        max: 500
      }
    }
  },
  {
    name: 'linea-testnet',
    chain_id: '59140',
    is_testnet: true,
    label: 'Linea Testnet',
    category_label: 'Ethereum',
    logo_url:
      'https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg',
    black_logo_url:
      'https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg',
    white_logo_url:
      'https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x7191061d5d4c60f598214cc6913502184baddf18',
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png'
      },
      {
        address: '0x6aa397CAB00a2A40025Dbf839a83f16D5EC7c1eB',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Linea Testnet',
        description: 'Have at least one transaction on Linea Testnet',
        image_url: '/badges/linea-testnet/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://explorer.goerli.linea.build/',
    scores: {
      txCount: {
        min: 1,
        average: 35,
        max: 500
      },
      contractCount: {
        min: 1,
        average: 35,
        max: 500
      },
      valueQuoteSum: {
        min: 1,
        average: 1000,
        max: 1000000
      },
      gasQuoteSum: {
        min: 1,
        average: 35,
        max: 500
      }
    }
  },

  {
    name: 'arbitrum-mainnet',
    chain_id: '42161',
    is_testnet: false,
    label: 'Abritrum One',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [],
    achievements: [],
    block_explorer_url: 'https://blockscout.scroll.io/',
    scores: {
      txCount: {
        min: 1,
        average: 35,
        max: 500
      },
      contractCount: {
        min: 1,
        average: 35,
        max: 500
      },
      valueQuoteSum: {
        min: 1,
        average: 1000,
        max: 1000000
      },
      gasQuoteSum: {
        min: 1,
        average: 35,
        max: 500
      }
    }
  },
  {
    name: 'optimism-mainnet',
    chain_id: '10',
    is_testnet: false,
    label: 'Optimism',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    black_logo_url:
      'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    white_logo_url:
      'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [],
    achievements: [],
    block_explorer_url: 'https://arbiscan.io/',
    scores: {
      txCount: {
        min: 1,
        average: 35,
        max: 500
      },
      contractCount: {
        min: 1,
        average: 35,
        max: 500
      },
      valueQuoteSum: {
        min: 1,
        average: 1000,
        max: 1000000
      },
      gasQuoteSum: {
        min: 1,
        average: 35,
        max: 500
      }
    }
  }
];
