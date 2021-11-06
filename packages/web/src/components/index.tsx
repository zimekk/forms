import React, { createContext, useContext } from "react";
import cx from "classnames";
import styles from "./styles.module.scss";

const FormContext = createContext({});

export function Form({ ...props }: { name: string }) {
  return (
    <FormContext.Provider value={{ name }}>
      <form
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

export function Field({ name, ...props }: { name: string }) {
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
  return (
    <div>
      <input name={name} {...props} />
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

export function Button({ ...props }: { value: string }) {
  return (
    <div>
      <button type="submit" name="action" {...props} />
    </div>
  );
}
