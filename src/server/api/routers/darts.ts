// import { Test } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";

async function assertDartBoardAccess({
  session,
  dartBoardId,
  prisma,
}: {
  session?: Session;
  dartBoardId: string;
  prisma: PrismaClient;
}) {
  const dartBoard = await prisma.dartBoard.findUnique({
    where: {
      id: dartBoardId,
    },
    select: {
      userId: true,
    },
  });
  if (!dartBoard) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  if (!(session && session.user && session.user.id === dartBoard.userId)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return {
    dartBoard,
  };
}

async function assertDartAccess({
  session,
  dartId,
  prisma,
}: {
  session?: Session;
  dartId: string;
  prisma: PrismaClient;
}) {
  const dart = await prisma.dart.findUnique({
    where: {
      id: dartId,
    },
    select: {
      dartBoardId: true,
    },
  });
  if (!dart) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  await assertDartBoardAccess({
    session,
    dartBoardId: dart.dartBoardId,
    prisma,
  });

  return {
    dart,
  };
}

async function assertDartTagAccess({
  session,
  dartTagId,
  prisma,
}: {
  session?: Session;
  dartTagId: string;
  prisma: PrismaClient;
}) {
  const dartTag = await prisma.dartTag.findUnique({
    where: {
      id: dartTagId,
    },
    select: {
      dartBoardId: true,
    },
  });
  if (!dartTag) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  await assertDartBoardAccess({
    session,
    dartBoardId: dartTag.dartBoardId,
    prisma,
  });

  return {
    dartTag,
  };
}

async function assertAssociatedDartTagAccess({
  session,
  associatedDartTagId,
  prisma,
}: {
  session?: Session;
  associatedDartTagId: string;
  prisma: PrismaClient;
}) {
  const associatedDartTag = await prisma.associatedDartTag.findUnique({
    where: {
      id: associatedDartTagId,
    },
    select: {
      dartId: true,
    },
  });
  if (!associatedDartTag) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  await assertDartAccess({
    session,
    dartId: associatedDartTag.dartId,
    prisma,
  });

  return {
    associatedDartTag,
  };
}

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
      await assertDartBoardAccess({
        session: ctx.session,
        dartBoardId: input.dartBoardId,
        prisma: ctx.prisma,
      });

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
      await assertDartBoardAccess({
        session: ctx.session,
        dartBoardId: input.dartBoardId,
        prisma: ctx.prisma,
      });

      const darts = await ctx.prisma.dart.findMany({
        where: {
          dartBoardId: input.dartBoardId,
        },
        include: {
          AssociatedDartTag: {
            include: {
              dartTag: {
                select: {
                  id: true,
                },
              },
            },
          },
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
      await assertDartBoardAccess({
        session: ctx.session,
        dartBoardId: input.dartBoardId,
        prisma: ctx.prisma,
      });

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
      await assertDartAccess({
        session: ctx.session,
        dartId: input.dartId,
        prisma: ctx.prisma,
      });

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
      await assertDartAccess({
        session: ctx.session,
        dartId: input.dartId,
        prisma: ctx.prisma,
      });

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
  createDartTag: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.number(),
        dartBoardId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertDartBoardAccess({
        session: ctx.session,
        dartBoardId: input.dartBoardId,
        prisma: ctx.prisma,
      });

      const dartTag = await ctx.prisma.dartTag.create({
        data: {
          name: input.name,
          color: input.color,
          dartBoardId: input.dartBoardId,
        },
      });
      return dartTag;
    }),
  getAllDartTagsForBoard: protectedProcedure
    .input(
      z.object({
        dartBoardId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await assertDartBoardAccess({
        session: ctx.session,
        dartBoardId: input.dartBoardId,
        prisma: ctx.prisma,
      });

      const dartTags = await ctx.prisma.dartTag.findMany({
        where: {
          dartBoardId: input.dartBoardId,
        },
      });
      return dartTags;
    }),
  associateDartTagWithDart: protectedProcedure
    .input(
      z.object({
        dartId: z.string(),
        dartTagId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { dart } = await assertDartAccess({
        session: ctx.session,
        dartId: input.dartId,
        prisma: ctx.prisma,
      });
      const { dartTag } = await assertDartTagAccess({
        session: ctx.session,
        dartTagId: input.dartTagId,
        prisma: ctx.prisma,
      });
      if (dart.dartBoardId !== dartTag.dartBoardId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Dart and dart tag must be on the same dart board",
        });
      }

      const associatedDartTag = await ctx.prisma.associatedDartTag.create({
        data: {
          dartId: input.dartId,
          dartTagId: input.dartTagId,
        },
      });
      return associatedDartTag;
    }),
  disassociatedDartTag: protectedProcedure
    .input(
      z.object({
        associatedDartTagId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertAssociatedDartTagAccess({
        session: ctx.session,
        associatedDartTagId: input.associatedDartTagId,
        prisma: ctx.prisma,
      });

      const deletedAssociatedDartTag =
        await ctx.prisma.associatedDartTag.delete({
          where: {
            id: input.associatedDartTagId,
          },
        });
      return deletedAssociatedDartTag;
    }),
});
