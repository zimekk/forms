import React, { useCallback, useEffect, useState } from "react";
import { useMutation } from "graphql-hooks";
import cx from "classnames";
import { Step, Action } from "../constants";
import styles from "./Forms.module.scss";

const LOGIN_FLOW_MUTATION = `mutation LoginFlow($step: String,$action: String,
  $loginStep1Input: LoginStep1Input, $loginStep2Input: LoginStep2Input) {
  loginFlow(step: $step,action: $action,loginStep1Input:$loginStep1Input,loginStep2Input:$loginStep2Input) {
    __typename
    step
    ... on LoginStep1 {
      username
      errors {
        username
      }
    }
    ... on LoginStep2 {
      password
      errors {
        password
      }
    }
  }
}`;

export default function Section() {
  const [flow] = useMutation(LOGIN_FLOW_MUTATION);
  const [data, setData] = useState({});

  const handleChange = useCallback(
    (event) =>
      (({
        target: {
          form: { name: step },
          name,
          value,
        },
      }) =>
        Boolean(console.log(["handleChange"], { step, name, value })) ||
        setData((data) => ({
          ...data,
          [step]: {
            ...data[step],
            [name]: value,
          },
        })))(event),
    []
  );
  const handleSubmit = useCallback(
    (event) =>
      event.preventDefault() ||
      (({
        target: { name: step },
        nativeEvent: {
          submitter: { value: action },
        },
      }) =>
        Boolean(console.log(["handleSubmit"], { step, action })) ||
        flow({
          variables: Object.assign(
            { step, action },
            {
              [Step.Step1]: {
                [Action.Next]: ({ username }) => ({
                  loginStep1Input: { username },
                }),
              },
              [Step.Step2]: {
                [Action.Back]: () => ({}),
                [Action.Next]: ({ password }) => ({
                  loginStep2Input: { password },
                }),
              },
              [Step.Step3]: {
                [Action.Logout]: () => ({}),
              },
            }[step][action](data[step])
          ),
        })
          .then(({ data }) => data.loginFlow)
          .then(({ step, ...update }) => setData(() => ({ [step]: update }))))(
        event
      ),
    [data]
  );

  useEffect(
    () =>
      flow()
        .then(({ data }) => data.loginFlow)
        .then(({ step, ...update }) => setData(() => ({ [step]: update }))),
    []
  );

  return (
    <section className={styles.Section}>
      <h2>Forms</h2>
      {data[Step.Step1] && (
        <form
          className={cx(styles.Form, data[Step.Step1].errors && styles.invalid)}
          name={Step.Step1}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>Step1</legend>
            <div>
              <label
                className={cx(
                  styles.Field,
                  data[Step.Step1].errors?.username && styles.invalid
                )}
              >
                <span>Username</span>
                <input
                  name="username"
                  value={data[Step.Step1].username}
                  onChange={handleChange}
                  autoFocus
                />
                {data[Step.Step1].errors?.username && (
                  <span>{data[Step.Step1].errors.username}</span>
                )}
              </label>
            </div>
            <div>
              <button type="submit" name="action" value={Action.Next}>
                Next
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {data[Step.Step2] && (
        <form
          className={cx(styles.Form, data[Step.Step2].errors && styles.invalid)}
          name={Step.Step2}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>Step2</legend>
            <div>
              <label
                className={cx(
                  styles.Field,
                  data[Step.Step2].errors?.password && styles.invalid
                )}
              >
                <span>Password</span>
                <input
                  name="password"
                  value={data[Step.Step2].password}
                  onChange={handleChange}
                  autoFocus
                />
                {data[Step.Step2].errors?.password && (
                  <span>{data[Step.Step2].errors.password}</span>
                )}
              </label>
            </div>
            <div>
              <button type="submit" name="action" value={Action.Next}>
                Next
              </button>
              <button type="submit" name="action" value={Action.Back}>
                Back
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {data[Step.Step3] && (
        <form
          className={cx(styles.Form, data[Step.Step3].errors && styles.invalid)}
          name={Step.Step3}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>Step3</legend>
            <div>
              <label>
                <span>LoggedIn</span>
              </label>
            </div>
            <div>
              <button
                type="submit"
                name="action"
                value={Action.Logout}
                autoFocus
              >
                Logout
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
}
