import { useState } from "react";

type Return<T> = {
  values: T;
  onChange: (key: string) => (value: unknown) => void;
};

const useForm = <T>(form: T): Return<T> => {
  const [values, setValues] = useState(form);

  const onChange = (key: string) => (value: unknown) => {
    setValues((val) => ({ ...val, [key]: value }));
  };

  return { values, onChange };
};

export default useForm;
