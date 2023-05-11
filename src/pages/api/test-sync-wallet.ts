import { type NextApiRequest, type NextApiResponse } from 'next';
import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { appRouter } from '@/server/routers/_app';
import { trpc } from '@/connectors/Trpc';

const userByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  //   const ctx = await createTRPCContext({ req, res });
  //   const caller = appRouter.createCaller(ctx);
  try {
    // const { id } = req.query;
    // const user = await caller.user.getById(id);
    const { mutate } = trpc.txs.syncWalletTxs.useMutation();
    const data = await mutate({
      chainName: 'ethereum',
      walletAddr: '0x0'
    });
    res.status(200).json(data);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode);
    }
    // Another error occured
    console.error(cause);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default userByIdHandler;
