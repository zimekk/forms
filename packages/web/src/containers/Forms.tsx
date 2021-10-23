import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import styles from "./Forms.module.scss";

enum Step {
  Step1 = "STEP_1",
  Step2 = "STEP_2",
  Step3 = "STEP_3",
}

enum Action {
  Init = "INIT",
  Submit = "SUBMIT",
  Next = "NEXT",
  Back = "BACK",
  Logout = "LOGOUT",
}

const flow = ({
  step = Step.Step1,
  action = Action.Init,
  ...data
}: { step?: Step; action?: Action } = {}) =>
  ({
    [Step.Step1]: {
      [Action.Init]: () => ({
        step: Step.Step1,
        username: "",
      }),
      [Action.Next]: ({ username }) =>
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
      [Action.Next]: ({ password }) =>
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
  }[step][action](data));

export default function Section() {
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
      Promise.resolve(
        event.preventDefault() || event
        // Object.fromEntries(new FormData(event.target))
      )
        .then(
          ({
            target: { name: step },
            nativeEvent: {
              submitter: { value: action },
            },
          }) =>
            Boolean(console.log(["handleSubmit"], { step, action })) ||
            new Promise((resolve) =>
              setTimeout(resolve, 200, flow({ ...data[step], step, action }))
            )
        )
        .then(({ step, ...update }) => setData(() => ({ [step]: update }))),
    [data]
  );

  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 200, flow())).then(
      ({ step, ...update }) => setData(() => ({ [step]: update }))
    );
  }, []);

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
                  onChange={(e) =>
                    setData((data) => ({
                      ...data,
                      [Step.Step2]: {
                        ...data[Step.Step2],
                        password: e.target.value,
                      },
                    }))
                  }
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
