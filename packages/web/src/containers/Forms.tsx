import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "graphql-hooks";
import { Subject, from } from "rxjs";
import { debounceTime, delay, mergeMap, tap } from "rxjs/operators";
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

const CHECK_USERNAME_QUERY = gql`
  query CheckUsername($username: String) {
    checkUsername(username: $username) {
      valid
    }
  }
`;

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
          code
          message
          path
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

let activeElement = null;

function useForm(mutate, update, submit) {
  const [data, setData] = useState(() => ({
    form: {},
    view: null,
  }));

  const mutate$ = useMemo(() => new Subject(), []);
  useEffect(() => {
    const subscription = mutate$
      .pipe(
        // tap(() => (activeElement = document.activeElement, console.log(activeElement))),
        tap(() => setData((data) => ({ ...data, busy: true }))),
        delay(500),
        mergeMap((variables) => from(mutate({ variables }))),
        delay(500),
        tap(() => setData((data) => ({ ...data, busy: false })))
      )
      .subscribe(
        (mutate) =>
          Boolean(console.log({ mutate })) ||
          setData(update(mutate.data)) ||
          (document.contains(activeElement) && activeElement.focus())
      );

    mutate$.next({});

    return () => subscription.unsubscribe();
  }, [mutate$]);

  const change$ = useMemo(() => new Subject(), []);
  useEffect(() => {
    const subscription = change$
      // .pipe(
      //   tap((a) => console.log(["change"], { a }))
      // )
      .subscribe(
        (change) =>
          Boolean(console.log({ change })) ||
          //  setData(update(mutate.data))

          setData((data) => ({
            ...data,
            form: {
              ...data.form,
              ...change,
            },
          }))
      );
    return () => subscription.unsubscribe();
  }, [change$]);

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
        change$.next({ [name]: value }))(event),
    []
  );

  const handleSubmit = useCallback(
    (event) =>
      event.preventDefault() ||
      console.log((activeElement = document.activeElement)) ||
      (({
        target,
        // target: { name },
        nativeEvent: {
          submitter: { value: action },
        },
      }) =>
        Boolean(console.log(["handleSubmit"], { action })) ||
        target.focus() ||
        mutate$.next(submit(action, data)))(event),
    [data]
  );

  return [
    data,
    () => ({
      key: data.view,
      data,
      handleChange,
      handleSubmit,
    }),
    {
      change$,
      mutate$,
    },
  ];
}

export default function Section() {
  const [mutate] = useMutation(SIGNIN_MUTATION);
  const [data, handleForm, { change$ }] = useForm(
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
      console.log({ action, flow, view, form }) ||
      Object.assign(
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
      )
  );

  const [checkUsername] = useMutation(CHECK_USERNAME_QUERY);
  const checkUsername$ = useMemo(() => new Subject(), []);
  useEffect(() => {
    const subscription = checkUsername$
      .pipe(
        delay(500),
        mergeMap((variables) => from(checkUsername({ variables }))),
        delay(500)
      )
      .subscribe(
        (checkUsername$) =>
          Boolean(console.log({ checkUsername$ })) ||
          change$.next({
            validUsername: checkUsername$.data.checkUsername.valid,
          })
        //  || setData(update(mutate.data))
      );
    return () => subscription.unsubscribe();
  }, [checkUsername$]);

  useEffect(() => {
    const subscription = change$
      .pipe(
        debounceTime(500)
        // tap((b) => console.log(['change'], {b}))
      )
      .subscribe(
        (change) =>
          Boolean(console.log({ change })) ||
          (change.username &&
            checkUsername$.next({
              username: change.username,
            }))
      );
    return () => subscription.unsubscribe();
  }, [change$]);

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
                  {data.form.validUsername !== null && (
                    <div>{data.form.validUsername ? "Valid" : "Invalid"}</div>
                  )}
                  <Errors />
                </Field>
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
                  <Errors />
                </Field>
                <Button value={Action.Next}>Next</Button>
                <Button value={Action.Back}>Back</Button>
              </Fieldset>
            </Form>
          ),
          [View.Step3]: () => (
            <Form {...handleForm()}>
              <Fieldset>
                <Legend>Step3</Legend>
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
