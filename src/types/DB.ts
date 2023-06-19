import { InferModel } from 'drizzle-orm';
import { transactions, supportChains, erc20Transactions } from '@/db/schema';
export type Transaction = InferModel<typeof transactions, 'insert'>;
export type SupportChain = InferModel<typeof supportChains, 'select'>;
export type Erc20Tx = InferModel<typeof erc20Transactions, 'insert'>;
