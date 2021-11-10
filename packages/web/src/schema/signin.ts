import { mergeSchemas } from "@graphql-tools/schema";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import update from "immutability-helper";
import { Flow, View, Action, gql } from "../constants";

const storage = {};

export default mergeSchemas({
  typeDefs: gql`
    scalar Flow
    scalar View
    scalar Action

    interface Form {
      view: View
      errors: [Error]
    }

    interface LoginFlow {
      flow: Flow
    }

    type Error {
      code: String
      message: String
      path: [String]
    }

    type LoginStep1 implements LoginFlow & Form {
      flow: Flow
      view: View
      errors: [Error]
      username: String
    }

    input LoginStep1Input {
      username: String
    }

    type LoginStep2 implements LoginFlow & Form {
      flow: Flow
      view: View
      errors: [Error]
      password: String
    }

    input LoginStep2Input {
      password: String
    }

    type LoginStep3 implements LoginFlow & Form {
      flow: Flow
      view: View
      errors: [Error]
    }

    type Mutation {
      signin(
        flow: Flow
        action: Action
        step1: LoginStep1Input
        step2: LoginStep2Input
      ): LoginFlow
    }

    type CheckUsername {
      valid: Boolean
    }

    type Query {
      checkUsername(username: String): CheckUsername
    }
  `,
  resolvers: {
    LoginFlow: {
      __resolveType({ view }) {
        return {
          [View.Step1]: "LoginStep1",
          [View.Step2]: "LoginStep2",
          [View.Step3]: "LoginStep3",
        }[view];
      },
    },
    Query: {
      checkUsername: (_, { username }) =>
        z
          .string()
          .min(5)
          .safeParseAsync(username)
          .then(({ success }) => ({
            valid: success,
          })),
    },
    Mutation: {
      signin: (
        _,
        {
          flow,
          action = Action.Init,
          ...data
        }: { flow?: Flow; action?: Action } = {}
      ) =>
        Boolean(console.log({ storage })) ||
        Promise.resolve(
          flow
            ? storage[flow.uuid]
            : {
                uuid: uuid(),
                view: View.Step1,
                form: {
                  username: "a",
                  password: "b",
                },
              }
        ).then(({ view, form, ...flow }) =>
          Promise.resolve(
            {
              [View.Step1]: {
                [Action.Init]: () => ({
                  view,
                  form,
                }),
                [Action.Next]: ({ step1: { username } }) =>
                  Promise.resolve(
                    update(form, {
                      username: { $set: username },
                    })
                  ).then((form) =>
                    z
                      .object({
                        username: z.string().min(3),
                      })
                      .parseAsync(form)
                      .then(
                        () => ({
                          view: View.Step2,
                          form,
                        }),
                        ({ issues: errors }) => ({
                          view,
                          form,
                          errors,
                        })
                      )
                  ),
              },
              [View.Step2]: {
                [Action.Back]: () => ({
                  view: View.Step1,
                  form,
                }),
                [Action.Next]: ({ step2: { password } }) =>
                  Promise.resolve(
                    update(form, {
                      password: { $set: password },
                    })
                  ).then((form) =>
                    z
                      .object({
                        password: z.string().min(3),
                      })
                      .parseAsync(form)
                      .then(
                        () => ({
                          view: View.Step3,
                          form,
                        }),
                        ({ issues: errors }) => ({
                          view,
                          form,
                          errors,
                        })
                      )
                  ),
              },
              [View.Step3]: {
                [Action.Logout]: () => ({
                  view: View.Step1,
                  form,
                }),
              },
            }[view][action](data)
          ).then(({ view, form, errors }) =>
            Promise.resolve()
              .then(() =>
                Object.assign(storage, {
                  [flow.uuid]: {
                    ...flow,
                    view,
                    form,
                  },
                })
              )
              .then(
                () =>
                  Boolean(console.log({ flow, view, form, errors })) || {
                    flow,
                    view,
                    errors,
                    ...form,
                  }
              )
          )
        ),
    },
  },
});
