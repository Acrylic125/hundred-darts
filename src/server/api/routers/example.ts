// import { Test } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    return users;
  }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  // add: publicProcedure.mutation(async ({ ctx }) => {
  //   const testValue = await ctx.prisma.test.create({
  //     data: {},
  //   });
  //   return testValue;
  // }),
  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   try {
  //     const testValues = await ctx.prisma.test.findMany();
  //     return testValues;
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
