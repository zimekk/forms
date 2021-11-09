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
import { View, Action, gql } from "../constants";
import styles from "./Forms.module.scss";
import { object } from "zod";

const SIGNIN_MUTATION = gql`
  mutation Signin(
    $flow: Flow
    $action: Action
    $step1: LoginStep1Input
    $step2: LoginStep2Input
  ) {
    signin(flow: $flow, action: $action, step1: $step1, step2: $step2) {
      __typename
      flow
      ... on Form {
        view
        errors {
          id
        }
      }
      ... on LoginStep1 {
        username
      }
      ... on LoginStep2 {
        password
      }
    }
  }
`;

function useForm(mutate, update, submit) {
  const [data, setData] = useState(() => ({
    form: {},
    view: null,
  }));

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
          // form: { name },
          name,
          value,
        },
      }) =>
        Boolean(console.log(["handleChange"], { name, value })) ||
        setData((data) => ({
          ...data,
          form: {
            ...data.form,
            [name]: value,
          },
        })))(event),
    []
  );

  const handleSubmit = useCallback(
    (event) =>
      event.preventDefault() ||
      (({
        // target: { name },
        nativeEvent: {
          submitter: { value: action },
        },
      }) =>
        Boolean(console.log(["handleSubmit"], { action })) ||
        mutate$.next(submit(action, data)))(event),
    [data]
  );

  return [
    data,
    () => ({
      form: data.form,
      handleChange,
      handleSubmit,
    }),
  ];
}

export default function Section() {
  const [mutate] = useMutation(SIGNIN_MUTATION);
  const [data, handleForm] = useForm(
    mutate,
    ({ signin: { flow, view, errors, ...form } }) =>
      (data) =>
        console.log({ data, flow, view, errors, form }) || {
          ...data,
          flow,
          view,
          errors,
          form: { ...data.form, ...form },
        },
    (action, { flow, view, form }) =>
      console.log({ action, flow, view, form }) || {
        variables: Object.assign(
          { flow, action },
          {
            [View.Step1]: {
              [Action.Next]: ({ username }) => ({
                step1: { username },
              }),
            },
            [View.Step2]: {
              [Action.Back]: () => ({}),
              [Action.Next]: ({ password }) => ({
                step2: { password },
              }),
            },
            [View.Step3]: {
              [Action.Logout]: () => ({}),
            },
          }[view][action](form)
        ),
      }
  );

  console.log({ data });

  return (
    <section className={styles.Section}>
      <h2>Forms</h2>
      {data.view &&
        {
          [View.Step1]: () => (
            <Form {...handleForm()}>
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
          ),
          [View.Step2]: () => (
            <Form {...handleForm()}>
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
          ),
          [View.Step3]: () => (
            <Form {...handleForm()}>
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
          ),
        }[data.view](data.form)}
    </section>
  );
}
