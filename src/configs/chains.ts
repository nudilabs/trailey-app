export const CHAINS = [
  {
    name: 'arbitrum-mainnet',
    chain_id: '42161',
    is_testnet: false,
    label: 'Arbitrum One',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        addresses: [
          '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
          '0x6694340fc020c5E6B96567843da2df01b2CE1eb6'
        ],
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png',
        protocol_url: 'https://stargate.finance/'
      },
      {
        addresses: [
          '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5',
          '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
        ],
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png',
        protocol_url: 'https://uniswap.org/'
      },
      {
        addresses: [
          '0x3749C4f034022c39ecafFaBA182555d4508caCCC',
          '0x33ceb27b39d2Bb7D2e61F7564d3Df29344020417',
          '0x10541b07d8Ad2647Dc6cD67abd4c03575dade261'
        ],
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png',
        protocol_url: 'https://hop.exchange/'
      },
      {
        addresses: ['0xBeb09beB09e95E6FEBf0d6EEb1d0D46d1013CC3C'],
        label: 'Bepop',
        logo_url:
          'https://3867326743-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F1RxNDo04vPwMIPYZIvks%2Fuploads%2FJQ1qNdZJJpTeuXu7N2mK%2FBebop_B_Logo.svg?alt=media&token=166f9c3a-6be2-4feb-b2d5-f35a73799dc0',
        protocol_url: 'https://bepop.xyz/'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Arbitrum',
        description: 'Have at least one transaction on Arbitrum',
        image_url: '/badges/arbitrum/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://arbiscan.io/',
    scores: {
      txCount: {
        min: 1,
        average: 34.323727,
        max: 76121486
      },
      contractCount: {
        min: 1,
        average: 33.389309,
        max: 76121486
      },
      valueQuoteSum: {
        min: 1,
        average: 6979.667017,
        max: 4689727203
      },
      gasQuoteSum: {
        min: 1,
        average: 5.955650887,
        max: 1535042.772
      }
    },
    symbol: 'ETH'
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
    protocols: [
      {
        addresses: ['0xB0D502E938ed5f4df2E681fE6E419ff29631d62b'],
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png',
        protocol_url: 'https://stargate.finance/'
      },
      {
        addresses: ['0xb555edF5dcF85f42cEeF1f3630a52A108E55A654'],
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png',
        protocol_url: 'https://uniswap.org/'
      },
      {
        addresses: ['0x83f6244Bd87662118d96D9a6D44f09dffF14b30E'],
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png',
        protocol_url: 'https://hop.exchange/'
      },
      {
        addresses: ['0x41838b44C20EB6b89b7169e4017eb1435165C1C3'],
        label: 'Holograph',
        logo_url:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0OSA0OCIgY2xhc3M9ImZpbGwtWyNGOUY5RjldIGxpZ2h0OmZpbGwtWyMwMDAwMDBdICIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOS45NjQ2MiAxNi40MDhMMjAuMzI5NyAxMC40MzJWMEwwIDExLjcyVjQ3Ljk2TDkuOTY0NjIgNDIuMjE2VjE2LjQwOFpNMTQuNzcwNyAzOS40NEwyMi45MzMgMzQuNzM2VjE0LjQ3MkwxNC43NzA3IDE5LjE3NlYzOS40NFpNMjcuNzM5MSA0OEw0OC4wNjA5IDM2LjI4TDQ4LjAyODggMEwyNy43MzkxIDExLjY5NlY0OFoiPjwvcGF0aD48L3N2Zz4=',
        protocol_url: 'https://holograph.xyz/'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Optimism',
        description: 'Have at least one transaction on Optimism',
        image_url: '/badges/optimism/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://optimistic.etherscan.io/',
    scores: {
      txCount: {
        min: 1,
        average: 35.92368381854108,
        max: 2148767
      },
      contractCount: {
        min: 1,
        average: 35.92368381854108,
        max: 2148767
      },
      valueQuoteSum: {
        min: 1,
        average: 3891.0945700362267,
        max: 1022670764.303293
      },
      gasQuoteSum: {
        min: 1,
        average: 0.1143610545076827,
        max: 9197.049514224103
      }
    },
    symbol: 'ETH'
  },
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
        average: 8.993319,
        max: 4390064
      },
      contractCount: {
        min: 1,
        average: 7.677852,
        max: 4390064
      },
      valueQuoteSum: {
        min: 1,
        average: 2795.424831,
        max: 1825249923
      },
      gasQuoteSum: {
        min: 1,
        average: 30.60477239,
        max: 811277.9842
      }
    },
    symbol: 'ETH'
  },
  {
    name: 'scroll-alpha-testnet',
    chain_id: '534353',
    is_testnet: true,
    label: 'Scroll Alpha Testnet',
    category_label: 'Ethereum',
    logo_url:
      'data:image/png;base64,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',
    black_logo_url:
      'data:image/png;base64,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',
    white_logo_url:
      'data:image/png;base64,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',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        addresses: ['0xd9880690bd717189cc3fbe7b9020f27fae7ac76f'],
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png',
        protocol_url: 'http://uniswap-v3.scroll.io/'
      },
      {
        addresses: ['0xC458eED598eAb247ffc19d15F19cf06ae729432c'],
        label: 'Syncswap',
        logo_url: '/protocols/syncswap.jpg',
        protocol_url: 'https://syncswap.xyz/'
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
        min: 0,
        average: 0,
        max: 0
      },
      contractCount: {
        min: 0,
        average: 0,
        max: 0
      },
      valueQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      },
      gasQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      }
    },
    symbol: 'ETH'
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
        addresses: ['0x7191061d5d4c60f598214cc6913502184baddf18'],
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png',
        white_logo_url: 'https://goerli.hop.exchange/'
      },
      {
        addresses: ['0x6aa397CAB00a2A40025Dbf839a83f16D5EC7c1eB'],
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png',
        protocol_url: 'https://swap.goerli.linea.build/'
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
        min: 0,
        average: 0,
        max: 0
      },
      contractCount: {
        min: 0,
        average: 0,
        max: 0
      },
      valueQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      },
      gasQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      }
    },
    symbol: 'ETH'
  },
  {
    name: 'polygon-zkevm-mainnet',
    chain_id: '1101',
    is_testnet: false,
    label: 'Polygon zkEVM',
    category_label: 'Ethereum',
    logo_url:
      'https://assets-global.website-files.com/6364e65656ab107e465325d2/642235057dbc06788f6c45c1_polygon-zkevm-logo.png',
    black_logo_url:
      'https://assets-global.website-files.com/6364e65656ab107e465325d2/642235057dbc06788f6c45c1_polygon-zkevm-logo.png',
    white_logo_url:
      'https://assets-global.website-files.com/6364e65656ab107e465325d2/642235057dbc06788f6c45c1_polygon-zkevm-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [],
    achievements: [
      {
        name: 'Welcome to Polygon zkEVM Mainnet',
        description: 'Have at least one transaction on Polygon zkEVM Mainnet',
        image_url: '/badges/polygon-zkevm-mainnet/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://zkevm.polygonscan.com/',
    scores: {
      txCount: {
        min: 0,
        average: 0,
        max: 0
      },
      contractCount: {
        min: 0,
        average: 0,
        max: 0
      },
      valueQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      },
      gasQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      }
    },
    symbol: 'MATIC'
  },
  {
    name: '',
    chain_id: '',
    is_testnet: false,
    label: 'zkSync Era Mainnet',
    category_label: 'Ethereum',
    logo_url: 'https://lite.zksync.io/images/logo-no-letters.svg',
    black_logo_url: 'https://lite.zksync.io/images/logo-no-letters.svg',
    white_logo_url: 'https://lite.zksync.io/images/logo-no-letters.svg',
    is_appchain: false,
    appchain_of: null,
    protocols: [],
    achievements: [],
    block_explorer_url: 'https://explorer.zksync.io/',
    scores: {
      txCount: {
        min: 0,
        average: 0,
        max: 0
      },
      contractCount: {
        min: 0,
        average: 0,
        max: 0
      },
      valueQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      },
      gasQuoteSum: {
        min: 0,
        average: 0,
        max: 0
      }
    },
    symbol: 'ETH'
  }
];
