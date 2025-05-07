/** @format */

import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { FormAction } from "../enhancers/types";
import { FormAtom } from "../types";

export const useFormAtom = <T extends object>(formAtom: FormAtom<T>) => {
  const [formData, dispatch] = useAtom(formAtom);

  const actionTypes = Object.values([
    FormAction.onSubmit,
    FormAction.onChange,
    FormAction.onBlur,
  ]);
  const actions = useMemo(
    () => ({
      [FormAction.onSubmit]: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch({
          type: FormAction.onSubmit,
          payload: event,
        });
      },
      [FormAction.onChange]: (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
          type: FormAction.onChange,
          payload: event,
        });
      },
      [FormAction.onBlur]: (
        event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        dispatch({
          type: FormAction.onBlur,
          payload: event,
        });
      },
    }),
    [actionTypes, dispatch],
  );

  const register = useCallback(
    (name: keyof T) => {
      return {
        name,
        value: formData?.values?.[name as keyof T] || "",
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: FormAction.onChange,
            payload: event,
          });
        },
        onBlur: (
          arg:
            | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
            | undefined,
        ) => {
          dispatch({
            type: FormAction.onBlur,
            payload: arg,
          });
        },
        error: !!formData.errorsTouched?.[name],
        helperText: formData.errorsTouched?.[name],
      };
    },
    [dispatch, formData.errorsTouched, formData?.values],
  );
  return {
    formData,
    actions,
    register,
  };
};
