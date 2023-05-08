import {
  mysqlTable,
  serial,
  varchar,
  int,
  datetime,
  decimal,
  boolean,
  index
} from 'drizzle-orm/mysql-core';
// {
//   "block_signed_at": "2022-06-29T10:35:44Z",
//   "block_height": 16411417,
//   "tx_hash": "0xdcb54379169abd8461170e09ab35dcb332f91880e3729e935902b6add3667f13",
//   "tx_offset": 0,
//   "successful": true,
//   "from_address": "0xfbfa1dc9e4a3972421abca95c85891df83acab54",
//   "from_address_label": null,
//   "to_address": "0xa906f338cb21815cbc4bc87ace9e68c87ef8d8f1",
//   "to_address_label": null,
//   "value": "1398016221591607",
//   "value_quote": 1.5340432417126224,
//   "gas_offered": 176548,
//   "gas_spent": 114589,
//   "gas_price": 127597532045,
//   "fees_paid": "11697097764136160",
//   "gas_quote": 16.043923957488452,
//   "gas_quote_rate": 1097.3000298710067,
//   "log_events": ""
// }

export const supportChains = mysqlTable(
  'support_chains',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 })
  },
  chain => ({
    nameIdx: index('name_idx').on(chain.name)
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
    isInteract: boolean('is_interact'),
    page: int('page'),
    chainId: int('chain_id').references(() => supportChains.id)
  },
  tx => ({
    txHashIdx: index('tx_hash_idx').on(tx.txHash),
    fromAddrAtIdx: index('from_addr_at_idx').on(tx.fromAddress, tx.signedAt)
  })
);
