import { ApolloServer, gql } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";

// Prisma client instance
const prisma = new PrismaClient();

// スキーマの定義 (typeDefs)
const typeDefs = gql`
  type Query {
    tasks: [Task!]!
    task(id: Int!): Task
  }

  type Mutation {
    createTask(title: String!): Task!
    updateTask(id: Int!, title: String, completed: Boolean): Task!
    deleteTask(id: Int!): Task!
  }

  type Task {
    id: Int!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;

// リゾルバーの定義
const resolvers = {
  Query: {
    tasks: async () => await prisma.task.findMany(),
    task: async (_parent: any, args: any) =>
      await prisma.task.findUnique({ where: { id: args.id } }),
  },
  Mutation: {
    createTask: async (_parent: any, args: any) =>
      await prisma.task.create({ data: { title: args.title } }),
    updateTask: async (_parent: any, args: any) =>
      await prisma.task.update({
        where: { id: args.id },
        data: {
          title: args.title,
          completed: args.completed,
        },
      }),
    deleteTask: async (_parent: any, args: any) =>
      await prisma.task.delete({ where: { id: args.id } }),
  },
};

// ApolloServer の設定
const apolloServer = new ApolloServer({ typeDefs, resolvers });

// この関数を追加して、サーバーの開始を待ちます
const startApolloServer = async () => {
  await apolloServer.start();
  return apolloServer.createHandler({ path: "/api/graphql" });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default startApolloServer();
