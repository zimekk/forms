import React, { createContext, useContext } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";

const FormContext = createContext({});

export function Form({
  form,
  handleChange,
  handleSubmit,
  ...props
}: {
  children: any;
}) {
  return (
    <FormContext.Provider value={{ form, handleChange }}>
      <form
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
  return (
    <FieldContext.Provider value={{ name }}>
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

export function Errors({ ...props }: { name: string }) {
  return (
    <div>
      <span {...props} />
    </div>
  );
}

export function Button({ ...props }: { children: any; value: string }) {
  return (
    <div>
      <button type="submit" name="action" {...props} />
    </div>
  );
}
