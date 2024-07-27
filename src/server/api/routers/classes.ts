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
  getClassWithStudentsAndMarks: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.class.findUnique({
        where: { id: input.id },
        include: {
          students: true,
          marks: true,
        },
      });
    }),
  addStudent: protectedProcedure
    .input(z.object({
      classId: z.string().min(1),
      studentEmail: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.db.user.findUnique({
        where: { email: input.studentEmail },
      });

      if (!student) {
        throw new Error("Student not found");
      }

      return ctx.db.class.update({
        where: { id: input.classId },
        data: {
          students: {
            connect: { id: student.id }
          }
        }
      });
    }),
  updateStudentMarks: protectedProcedure
    .input(z.object({
      classId: z.string().min(1),
      studentId: z.string().min(1),
      ia1: z.number().int(),
      ia2: z.number().int(),
      ia3: z.number().int(),
      see: z.number().int(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.studentMarks.upsert({
        where: { userId_classId: { userId: input.studentId, classId: input.classId } },
        update: {
          ia1: input.ia1,
          ia2: input.ia2,
          ia3: input.ia3,
          see: input.see,
        },
        create: {
          userId: input.studentId,
          classId: input.classId,
          ia1: input.ia1,
          ia2: input.ia2,
          ia3: input.ia3,
          see: input.see,
        },
      });
    }),
});
