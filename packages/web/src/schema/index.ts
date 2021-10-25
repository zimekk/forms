import { mergeSchemas } from "@graphql-tools/schema";

export default mergeSchemas({
  schemas: [require("./loginFlow").default],
  typeDefs: `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => "Hello World!",
    },
  },
});
