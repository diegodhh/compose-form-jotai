/** @format */

import { atom } from "jotai";
import { atomEnhancer, DispatcherAction } from "jotai-composer";
import { FormAction, FormErrors } from "./types";
export const createHandleSubmit = <T extends object>({
  handleSubmit,
}: {
  handleSubmit: (payload: Partial<T>) => Promise<unknown | void>;
}) => {
  const atomPromise = atom<Promise<unknown> | unknown>(null);
  const hasSubmittedAtom = atom(false);
  const isPromiseResolveAtom = atom(true);
  const CheckIfPromiseIsResolve = atom(null, async (get, set, payload) => {
    const result = get(atomPromise);
    if (result instanceof Promise) {
      try {
        set(isPromiseResolveAtom, false);
        await result;
        set(isPromiseResolveAtom, true);
      } finally {
        set(isPromiseResolveAtom, true);
      }
    } else {
      set(isPromiseResolveAtom, true);
    }
  });
  return atomEnhancer<
    { values: Partial<T>; errors: FormErrors<T>; errorsTouched: FormErrors<T> },
    DispatcherAction<FormAction.onSubmit, React.FormEvent<HTMLFormElement>>,
    {
      isSubmiting: boolean;
      hasSubmitted: boolean;
      errorsTouched: FormErrors<T>;
    }
  >(
    // Read function
    (get, { last }) => {
      const hasSubmitted = get(hasSubmittedAtom);
      const isSubmiting = !get(isPromiseResolveAtom);
      const errorsTouched = hasSubmitted
        ? {
            errorsTouched: last.errors,
            errorsTouchedBackUp: last.errorsTouched,
          }
        : {
            errorsTouched: last.errorsTouched,
          };
      return { isSubmiting, hasSubmitted, ...errorsTouched };
    },
    (
      get,
      set,
      update: DispatcherAction<
        FormAction.onSubmit,
        React.FormEvent<HTMLFormElement>
      >,
      { last },
    ) => {
      if (update.type === FormAction.onSubmit) {
        set(hasSubmittedAtom, true);
        const { values, errors } = last;
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
          set(atomPromise, handleSubmit(values));
          set(CheckIfPromiseIsResolve, undefined);
        }
      }
      return { shouldAbortNextSetter: false };
    },
  );
};
