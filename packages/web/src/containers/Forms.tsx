import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "graphql-hooks";
import { Subject, from } from "rxjs";
import { delay, mergeMap } from "rxjs/operators";
import {
  Button,
  Errors,
  Field,
  Fieldset,
  Form,
  Input,
  Label,
  Legend,
} from "../components";
import { Step, Action, gql } from "../constants";
import styles from "./Forms.module.scss";

const SIGNIN_MUTATION = gql`
  mutation Signin(
    $step: String
    $action: String
    $step1: LoginStep1Input
    $step2: LoginStep2Input
  ) {
    signin(step: $step, action: $action, step1: $step1, step2: $step2) {
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
  }
`;

function useForm(mutate, update, submit) {
  const [data, setData] = useState(() => ({}));

  const mutate$ = useMemo(() => new Subject(), []);
  useEffect(() => {
    const subscription = mutate$
      .pipe(
        delay(500),
        mergeMap((data) => from(mutate(data))),
        delay(500)
      )
      .subscribe(
        (mutate) =>
          Boolean(console.log({ mutate })) || setData(update(mutate.data))
      );

    mutate$.next({});

    return () => subscription.unsubscribe();
  }, [mutate$]);

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
        mutate$.next(submit(step, action, data)))(event),
    [data]
  );

  return [data, handleChange, handleSubmit];
}

export default function Section() {
  const [mutate] = useMutation(SIGNIN_MUTATION);
  const [data, handleChange, handleSubmit] = useForm(
    mutate,
    ({ signin }) =>
      (data) => ({ ...data, [signin.step]: signin }),
    (step, action, data) => ({
      variables: Object.assign(
        { step, action },
        {
          [Step.Step1]: {
            [Action.Next]: ({ username }) => ({
              step1: { username },
            }),
          },
          [Step.Step2]: {
            [Action.Back]: () => ({}),
            [Action.Next]: ({ password }) => ({
              step2: { password },
            }),
          },
          [Step.Step3]: {
            [Action.Logout]: () => ({}),
          },
        }[step][action](data[step])
      ),
    })
  );

  return (
    <section className={styles.Section}>
      <h2>Forms</h2>
      {data[Step.Step1] && (
        <Form
          name={Step.Step1}
          onChange={handleChange}
          onSubmit={handleSubmit}
          // data[Step.Step1].errors && styles.invalid
        >
          <Fieldset>
            <Legend>Step1</Legend>
            <Field name="username">
              <Label>Username</Label>
              <Input autoFocus />
            </Field>
            <Errors />
            <Button value={Action.Next}>Next</Button>
          </Fieldset>
        </Form>
      )}
      {data[Step.Step2] && (
        <Form name={Step.Step2} onChange={handleChange} onSubmit={handleSubmit}>
          <Fieldset>
            <Legend>Step2</Legend>
            <Field name="password">
              <Label>Password</Label>
              <Input autoFocus />
            </Field>
            <Errors />
            <Button value={Action.Next}>Next</Button>
            <Button value={Action.Back}>Back</Button>
          </Fieldset>
        </Form>
      )}
      {data[Step.Step3] && (
        <Form
          name={Step.Step3}
          onChange={handleChange}
          onSubmit={handleSubmit}
          // data[Step.Step3].errors && styles.invalid)}
        >
          <Fieldset>
            <Legend>Step3</Legend>
            <Field name="password">
              <Label>LoggedIn</Label>
            </Field>
            <Errors />
            <Button value={Action.Logout} autoFocus>
              Logout
            </Button>
          </Fieldset>
        </Form>
      )}
    </section>
  );
}
