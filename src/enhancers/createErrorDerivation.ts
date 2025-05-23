/** @format */

import { validateSync } from "class-validator";
import { atomEnhancer } from "jotai-composer";
import { piped } from "remeda";
import { FormErrors, TouchedState } from "./types";

export const createErrorDerivation = <T extends object>(
  ValidatorC: new () => Object,
) => {
  const errorsEnhancer = atomEnhancer<
    { values: Partial<T>; touched: TouchedState<T> },
    never,
    { errors: FormErrors<T> }
  >((get, { last }) => {
    console.log("last", last.values);
    const validator = new ValidatorC();
    const { values } = last || {};
    const tovalidate = Object.assign(validator, values);
    const validationErrors = validateSync(tovalidate, {
      skipMissingProperties: true,
    });
    const errors = validationErrors.reduce((acc, err) => {
      acc[err.property as keyof T] = Object.values(err.constraints || {}).join(
        ", ",
      );

      return acc;
    }, {} as FormErrors<T>);
    console.log("errors", errors);
    return { errors };
  });
  const touchedErrorsEnhancer = atomEnhancer<
    { errors: FormErrors<T>; touched: TouchedState<T> },
    never,
    { errorsTouched: FormErrors<T> }
  >((_get, { last }): { errorsTouched: FormErrors<T> } => {
    const { errors, touched } = last || {};
    const errorsTouched = Object.entries(errors).reduce((acc, [key, value]) => {
      if (value && touched?.[key as keyof T]) {
        acc[key as keyof T] = value as string;
      }
      return acc;
    }, {} as FormErrors<T>);
    return { errorsTouched };
  });
  return piped(errorsEnhancer, touchedErrorsEnhancer);
};
