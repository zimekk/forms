import React, { createContext, useContext, useMemo } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";

const FormContext = createContext({});

export function Form({
  data,
  handleChange,
  handleSubmit,
  ...props
}: {
  children: any;
}) {
  return (
    <FormContext.Provider value={{ ...data, handleChange }}>
      <form
        tabIndex={0}
        onSubmit={handleSubmit}
        {...props}
        className={cx(styles.Form)}
        // , data[Step.Step2].errors && styles.invalid
      />
    </FormContext.Provider>
  );
}

export function Fieldset({ ...props }) {
  return <fieldset {...props} />;
}

export function Legend({ ...props }) {
  return <legend {...props} />;
}

const FieldContext = createContext({});

export function Field({ name, ...props }: { children: any; name: string }) {
  const { errors } = useContext(FormContext);

  return (
    <FieldContext.Provider
      value={{
        name,
        errors: useMemo(
          () => (errors || []).filter(({ path }) => path.join(".") === name),
          [errors]
        ),
      }}
    >
      <div {...props} />
    </FieldContext.Provider>
  );
}

export function Label({ ...props }) {
  const { name } = useContext(FieldContext);
  return (
    <div>
      <label htmlFor={name} {...props} />
    </div>
  );
}

export function Input({ ...props }) {
  const { name } = useContext(FieldContext);
  const { form, handleChange } = useContext(FormContext);
  return (
    <div>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

export function Errors({ ...props }) {
  const { errors } = useContext(FieldContext);

  return errors ? (
    <ul className={styles.Errors}>
      {errors.map(({ message }, key) => (
        <li key={key}>{message}</li>
      ))}
    </ul>
  ) : null;
}

export function Button({ ...props }: { children: any; value: string }) {
  const { busy } = useContext(FormContext);
  return (
    <div>
      <button type="submit" name="action" disabled={busy} {...props} />
    </div>
  );
}
