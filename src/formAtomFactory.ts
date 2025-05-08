/** @format */

import { piped } from "remeda";
import { createErrorDerivation } from "./enhancers/createErrorDerivation";
import { createHandleSubmit } from "./enhancers/createHandleSubmit";
import { createValues } from "./enhancers/formValues";
import { createTouchedDecorator } from "./enhancers/touchedState";
import { TouchedState } from "./enhancers/types";

export const createFormAtom = <T extends object>({
  initialValues,
  ValidatorC,
  initialTouched,
  handleSubmit,
}: {
  initialTouched?: TouchedState<T>;
  initialValues?: Partial<T>;
  ValidatorC: new () => Object;
  handleSubmit: (payload: Partial<T>) => Promise<unknown | void>;
}) => {
  const run = piped(
    createValues<T>(initialValues || {}),
    createTouchedDecorator<T>(initialTouched),
    createErrorDerivation<T>(ValidatorC),
    createHandleSubmit<T>({ handleSubmit }),
  );
  return run(undefined);
};
