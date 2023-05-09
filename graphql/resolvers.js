import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    tasks: () => prisma.task.findMany(),
    task: (_, args) => prisma.task.findUnique({ where: { id: args.id } }),
  },
  Mutation: {
    createTask: (_, args) =>
      prisma.task.create({ data: { title: args.title } }),
    updateTask: (_, args) =>
      prisma.task.update({ where: { id: args.id }, data: args }),
    deleteTask: (_, args) => prisma.task.delete({ where: { id: args.id } }),
  },
};

export default resolvers;
