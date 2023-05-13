import { InferModel } from 'drizzle-orm';
import { transactions, supportChains } from '@/db/schema';
export type Transaction = InferModel<typeof transactions, 'insert'>;
export type SupportChain = InferModel<typeof supportChains, 'select'>;
