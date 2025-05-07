/** @format */

import { validateSync } from "class-validator";
import { atomEnhancer } from "jotai-composer";
import { FormErrors, TouchedState } from "./types";

export const createErrorDerivation = <T extends object>(
  ValidatorC: new () => Object,
) => {
  return atomEnhancer(
    // Read function
    (
      get,
      { last }: { last: { values: Partial<T>; touched: TouchedState<T> } },
    ) => {
      const validator = new ValidatorC();
      const { values, touched } = last || {};
      const tovalidate = Object.assign(validator, values);
      const validationErrors = validateSync(tovalidate, {
        skipMissingProperties: true,
      });
      const errors = validationErrors.reduce((acc, err) => {
        acc[err.property as keyof T] = Object.values(
          err.constraints || {},
        ).join(", ");

        return acc;
      }, {} as FormErrors<T>);

      const errorsTouched = Object.entries(errors).reduce(
        (acc, [key, value]) => {
          if (value && touched?.[key as keyof T]) {
            acc[key as keyof T] = value as string;
          }
          return acc;
        },
        {} as FormErrors<T>,
      );
      return { errors, errorsTouched };
    },
    // No write function needed since this is just derived state
  );
};
