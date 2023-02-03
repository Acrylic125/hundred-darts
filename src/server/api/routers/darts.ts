// import { Test } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  t,
} from "../trpc";

// const dartProcedure = protectedProcedure.use(
//   t.middleware(async ({ ctx, input, next }) => {

//   })
// );

export const dartRouter = createTRPCRouter({
  createDart: protectedProcedure
    .input(
      z.object({
        dartBoardId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dartBoard = await ctx.prisma.dartBoard.findUnique({
        where: {
          id: input.dartBoardId,
        },
        select: {
          userId: true,
        },
      });
      if (!dartBoard) {
        return null;
      }

      if (
        !(
          ctx.session &&
          ctx.session.user &&
          ctx.session.user.id === dartBoard.userId
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const dart = await ctx.prisma.dart.create({
        data: {
          text: input.text,
          dartBoardId: input.dartBoardId,
        },
      });
      return dart;
    }),
  getAllDartsForBoard: protectedProcedure
    .input(
      z.object({
        dartBoardId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dartBoard = await ctx.prisma.dartBoard.findUnique({
        where: {
          id: input.dartBoardId,
        },
        select: {
          userId: true,
        },
      });
      if (!dartBoard) {
        return null;
      }

      if (
        !(
          ctx.session &&
          ctx.session.user &&
          ctx.session.user.id === dartBoard.userId
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const darts = await ctx.prisma.dart.findMany({
        where: {
          dartBoardId: input.dartBoardId,
        },
      });
      return darts;
    }),
  createDartBoard: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(
          ctx.session &&
          ctx.session.user &&
          ctx.session.user.id === input.userId
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const dartBoard = await ctx.prisma.dartBoard.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
      return dartBoard;
    }),
  getAllDartBoards: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (
        !(
          ctx.session &&
          ctx.session.user &&
          ctx.session.user.id === input.userId
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const dartBoards = await ctx.prisma.dartBoard.findMany({
        where: {
          userId: input.userId,
        },
      });
      return dartBoards;
    }),
});
