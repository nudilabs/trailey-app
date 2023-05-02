import { z } from 'zod';
import { procedure } from '../trpc';
export const hello = procedure
  .input(
    z.object({
      text: z.string()
    })
  )
  .query(opts => {
    return {
      greeting: `hello ${opts.input.text}`
    };
  });
