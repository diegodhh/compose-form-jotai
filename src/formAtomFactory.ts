/** @format */

import { Atom } from "jotai";
import { pipe } from "remeda";
import { createErrorDerivation } from "./enhancers/createErrorDerivation";
import { createHandleSubmit } from "./enhancers/createHandleSubmit";
import { createValues } from "./enhancers/formValues";
import { createTouchedDecorator } from "./enhancers/touchedState";
import { TouchedState } from "./enhancers/types";

export const createFormAtom = <T extends object>({
  initialValues,
  ValidatorC,
  initialTouched,
  handleSubmitAtom,
}: {
  initialTouched?: TouchedState<T>;
  initialValues?: Partial<T>;
  ValidatorC: new () => Object;
  handleSubmitAtom: Atom<(payload: Partial<T>) => Promise<unknown | void>>;
}) => {
  const valuesAtom = createValues<T>(initialValues || {});
  return pipe(
    valuesAtom(),
    createTouchedDecorator<T>(initialTouched),
    createErrorDerivation<T>(ValidatorC),
    createHandleSubmit({ handleSubmitAtom }),
  );
};
