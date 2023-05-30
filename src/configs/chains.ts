export const CHAINS = [
  {
    name: 'eth-mainnet',
    chain_id: '1',
    is_testnet: false,
    label: 'Ethereum',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      },
      {
        address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png'
      },
      {
        address: '0xb8901acB165ed027E32754E0FFe830802919727f',
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Ethereum',
        description: 'Have at least one transaction on Ethereum',
        image_url: '/badges/ethereum/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://etherscan.io/',
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
    label: 'Arbitrum One',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png'
      },
      {
        address: '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      },
      {
        address: '0x3749C4f034022c39ecafFaBA182555d4508caCCC',
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png'
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
        average: 37.887706047840176,
        max: 72689782
      },
      contractCount: {
        min: 1,
        average: 37.887706047840176,
        max: 72689782
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
    protocols: [
      {
        address: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png'
      },
      {
        address: '0xb555edF5dcF85f42cEeF1f3630a52A108E55A654',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      },
      {
        address: '0x83f6244Bd87662118d96D9a6D44f09dffF14b30E',
        label: 'Hop',
        logo_url: 'https://app.hop.exchange/images/hop_logo.png'
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
    }
  },
  {
    name: 'bsc-mainnet',
    chain_id: '56',
    is_testnet: false,
    label: 'BNB Chain',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png'
      },
      {
        address: '0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to BNB Chain',
        description: 'Have at least one transaction on BNB Chain',
        image_url: '/badges/bnb-chain/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://bscscan.com/',
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
    name: 'matic-mainnet',
    chain_id: '137',
    is_testnet: false,
    label: 'Polygon',
    category_label: 'Ethereum',
    logo_url:
      'https://pbs.twimg.com/profile_images/1624229555333373952/JXGKFcO__400x400.jpg',
    black_logo_url:
      'https://pbs.twimg.com/profile_images/1624229555333373952/JXGKFcO__400x400.jpg',
    white_logo_url:
      'https://pbs.twimg.com/profile_images/1624229555333373952/JXGKFcO__400x400.jpg',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
        label: 'Stargate Finance',
        logo_url:
          'https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png'
      },
      {
        address: '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Polygon',
        description: 'Have at least one transaction on Polygon',
        image_url: '/badges/polygon/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://polygonscan.com/',
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
    name: 'eth-goerli',
    chain_id: '5',
    is_testnet: true,
    label: 'Ethereum Goerli Testnet',
    category_label: 'Ethereum',
    logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    black_logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    white_logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    is_appchain: false,
    appchain_of: null,
    protocols: [
      {
        address: '0x4648a43B2C14Da09FdF82B161150d3F634f40491',
        label: 'Uniswap',
        logo_url: '/protocols/uniswap.png'
      }
    ],
    achievements: [
      {
        name: 'Welcome to Ethereum Goerli Testnet',
        description: 'Have at least one transaction on Ethereum Goerli Testnet',
        image_url: '/badges/ethereum/welcome.png',
        conditions: [
          {
            type: 'txCount',
            value: 1
          }
        ]
      }
    ],
    block_explorer_url: 'https://goerli.etherscan.io/',
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
  }
];
