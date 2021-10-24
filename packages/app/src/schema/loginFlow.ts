import { mergeSchemas } from "@graphql-tools/schema";
import { Step, Action } from "@dev/web/constants";

export default mergeSchemas({
  typeDefs: `
    interface Form {
      step: String
    }

    interface LoginFlow {
      step: String
    }

    type LoginStep1Errors {
      username: String
    }

    type LoginStep1 implements LoginFlow {
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

    type LoginStep2 implements LoginFlow {
      step: String
      password: String
      errors: LoginStep2Errors
    }

    input LoginStep2Input {
      password: String
    }

    type LoginStep3 implements LoginFlow {
      step: String
    }

    type Mutation {
      loginFlow(step: String, action: String, loginStep1Input: LoginStep1Input, loginStep2Input: LoginStep2Input): LoginFlow
    }
  `,
  resolvers: {
    LoginFlow: {
      __resolveType({ step }) {
        console.log(["__resolveType"], { step });
        return (
          {
            [Step.Step1]: "LoginStep1",
            [Step.Step2]: "LoginStep2",
            [Step.Step3]: "LoginStep3",
          }[step] || null
        );
      },
    },
    Mutation: {
      loginFlow: (
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
            [Action.Next]: ({ loginStep1Input: { username } }) =>
              username
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
                  },
          },
          [Step.Step2]: {
            [Action.Back]: () => ({
              step: Step.Step1,
              username: "",
            }),
            [Action.Next]: ({ loginStep2Input: { password } }) =>
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
        }[step][action](data),
    },
  },
});
