import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const classRouter = createTRPCRouter({
    createClass: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      semester: z.string().min(1),
      year: z.number().int().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.class.create({
        data: {
          name: input.name,
          semester: input.semester,
          year: input.year,
        },
      });
    }),
    getClass: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.class.findMany()
    }),
})