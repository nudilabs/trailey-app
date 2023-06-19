import {
  mysqlTable,
  serial,
  varchar,
  int,
  datetime,
  decimal,
  boolean,
  index,
  timestamp,
  primaryKey
} from 'drizzle-orm/mysql-core';

export const supportChains = mysqlTable(
  'support_chains',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  chain => ({
    nameIdx: index('name_idx').on(chain.name)
  })
);

export const walletsInfo = mysqlTable(
  'wallets_info',
  {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 42 }),
    chainId: int('chain_id'),
    recentPage: int('recent_page'),
    recentBlock: int('recent_block'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  wallet => ({
    pk: primaryKey(wallet.chainId, wallet.address),
    addressIdx: index('address_idx').on(wallet.address)
  })
);

export const transactions = mysqlTable(
  'transactions',
  {
    id: serial('id').primaryKey(),
    signedAt: datetime('block_signed_at'),
    blockHeight: int('block_height'),
    txHash: varchar('tx_hash', { length: 66 }),
    txOffset: int('tx_offset'),
    success: boolean('success'),
    fromAddress: varchar('from_address', { length: 42 }),
    fromAddressLabel: varchar('from_address_label', { length: 255 }),
    toAddress: varchar('to_address', { length: 42 }),
    toAddressLabel: varchar('to_address_label', { length: 255 }),
    value: varchar('value', { length: 255 }),
    valueQuote: decimal('value_quote', { precision: 20, scale: 10 }),
    feesPaid: varchar('fees_paid', { length: 255 }),
    gasQuote: decimal('gas_quote', { precision: 20, scale: 10 }),
    isInteract: boolean('is_interact'),
    chainId: int('chain_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  tx => ({
    txHashIdx: index('tx_hash_idx').on(tx.txHash),
    fromAddrAtIdx: index('from_addr_at_idx').on(tx.fromAddress, tx.signedAt)
  })
);

export const erc20Transactions = mysqlTable(
  'erc20_transactions',
  {
    txHash: varchar('tx_hash', { length: 66 }),
    contractAddress: varchar('contract_address', { length: 42 }),
    contractDecimals: int('contract_decimals'),
    contractName: varchar('contract_name', { length: 255 }),
    contractSymbol: varchar('contract_symbol', { length: 255 }),
    fromAddress: varchar('from_address', { length: 42 }),
    toAddress: varchar('to_address', { length: 42 }),
    amount: varchar('value', { length: 255 }),
    amountQuote: decimal('value_quote', { precision: 20, scale: 10 }),
    transferType: varchar('transfer_type', { length: 255 }),
    chainId: int('chain_id'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  erc20Tx => ({
    pk: primaryKey(erc20Tx.txHash, erc20Tx.fromAddress, erc20Tx.toAddress),
    contractAddrIdx: index('contract_addr_idx').on(erc20Tx.contractAddress),
    fromAddrIdx: index('from_addr_idx').on(erc20Tx.fromAddress),
    toAddrIdx: index('to_addr_idx').on(erc20Tx.toAddress)
  })
);
