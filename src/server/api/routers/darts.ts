// import { Test } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dartRouter = createTRPCRouter({
  createDart: protectedProcedure
    .input(
      z.object({
        dartBoardId: z.string(),
        text: z.string(),
        createdAt: z.date().optional(),
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
          createdAt: input.createdAt || new Date(),
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
  getDartBoard: protectedProcedure
    .input(
      z.object({
        dartBoardId: z.string(),
        includeDarts: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dartBoardWithDarts = await ctx.prisma.dartBoard.findUnique({
        where: {
          id: input.dartBoardId,
        },
        include: {
          Dart: input.includeDarts,
        },
      });
      if (!dartBoardWithDarts) {
        return null;
      }

      if (
        !(
          ctx.session &&
          ctx.session.user &&
          ctx.session.user.id === dartBoardWithDarts.userId
        )
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return dartBoardWithDarts;
    }),
  updateDart: protectedProcedure
    .input(
      z.object({
        dartId: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dart = await ctx.prisma.dart.findUnique({
        where: {
          id: input.dartId,
        },
        select: {
          dartBoardId: true,
        },
      });
      if (!dart) {
        return null;
      }

      const dartBoard = await ctx.prisma.dartBoard.findUnique({
        where: {
          id: dart.dartBoardId,
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

      const updatedDart = await ctx.prisma.dart.update({
        where: {
          id: input.dartId,
        },
        data: {
          text: input.text,
          updatedAt: new Date(),
        },
      });
      return updatedDart;
    }),
  deleteDart: protectedProcedure
    .input(
      z.object({
        dartId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dart = await ctx.prisma.dart.findUnique({
        where: {
          id: input.dartId,
        },
        select: {
          dartBoardId: true,
        },
      });
      if (!dart) {
        return null;
      }

      const dartBoard = await ctx.prisma.dartBoard.findUnique({
        where: {
          id: dart.dartBoardId,
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

      const deletedDart = await ctx.prisma.dart.delete({
        where: {
          id: input.dartId,
        },
      });
      return deletedDart;
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
