import { z } from 'zod';
import { procedure } from '../trpc';
import { db } from '../db';

export const getGoals = procedure.input(z.string()).query(async opts => {
  const { input } = opts;
  const goals = await db.goals.findByAccount(input);
  return goals;
});

export const setGoals = procedure
  .input(
    z.object({
      address: z.string(),
      goals: z.array(
        z.object({
          name: z.string(),
          amount: z.string()
        })
      )
    })
  )
  .query(async opts => {
    const { input } = opts;
    const goals = await db.goals.updateOne(input.address, input.goals);
    return goals;
  });
