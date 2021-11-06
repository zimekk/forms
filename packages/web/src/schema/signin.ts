import { mergeSchemas } from "@graphql-tools/schema";
import { Step, Action, gql } from "../constants";

import { z } from "zod";

export default mergeSchemas({
  typeDefs: gql`
    interface Form {
      step: String
    }

    interface LoginFlow implements Form {
      step: String
    }

    type LoginStep1Errors {
      username: String
    }

    type LoginStep1 implements LoginFlow & Form {
      step: String
      username: String
      errors: LoginStep1Errors
    }

    input LoginStep1Input {
      username: String
    }

    type LoginStep2Errors {
      password: String
    }

    type LoginStep2 implements LoginFlow & Form {
      step: String
      password: String
      errors: LoginStep2Errors
    }

    input LoginStep2Input {
      password: String
    }

    type LoginStep3 implements LoginFlow & Form {
      step: String
    }

    type Mutation {
      signin(
        step: String
        action: String
        step1: LoginStep1Input
        step2: LoginStep2Input
      ): LoginFlow
    }
  `,
  resolvers: {
    LoginFlow: {
      __resolveType({ step }) {
        return {
          [Step.Step1]: "LoginStep1",
          [Step.Step2]: "LoginStep2",
          [Step.Step3]: "LoginStep3",
        }[step];
      },
    },
    Mutation: {
      signin: (
        _,
        {
          step = Step.Step1,
          action = Action.Init,
          ...data
        }: { step?: Step; action?: Action } = {}
      ) =>
        Boolean(console.log(["loginFlow"], { step, action, data })) ||
        {
          [Step.Step1]: {
            [Action.Init]: () => ({
              step: Step.Step1,
              username: "",
            }),
            [Action.Next]: ({ step1: { username } }) => {
              const data = { username, fields: {} };
              console.log({ data });

              const schema = z.object({
                username: z.string().min(1).max(3),
                fields: z.object({
                  password: z.string().min(1).max(3),
                }),
              });
              console.log("--", { schema });
              try {
                schema.parse(data);
              } catch (error) {
                console.error(error);
              }

              return username
                ? {
                    step: Step.Step2,
                    password: "",
                  }
                : {
                    step,
                    username,
                    errors: {
                      username: "Required!",
                    },
                  };
            },
          },
          [Step.Step2]: {
            [Action.Back]: () => ({
              step: Step.Step1,
              username: "",
            }),
            [Action.Next]: ({ step2: { password } }) =>
              password
                ? {
                    step: Step.Step3,
                  }
                : {
                    step,
                    password,
                    errors: {
                      password: "Required!",
                    },
                  },
          },
          [Step.Step3]: {
            [Action.Logout]: () => ({
              step: Step.Step1,
              username: "",
            }),
          },
          // @ts-ignore
        }[step][action](data),
    },
  },
});
