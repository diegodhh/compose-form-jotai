/** @format */

import { atom } from "jotai";
import { atomEnhancer, DispatcherAction } from "jotai-composer";
import { FormAction, FormUpdate } from "./types";

export const createValues = <T extends object>(initialValues: Partial<T>) => {
  const valuesAtom = atom<Partial<T>>(initialValues || {});

  return atomEnhancer(
    // Read function
    (get) => {
      const values = get(valuesAtom);
      return { values };
    },

    (
      get,
      set,
      update: DispatcherAction<FormAction.onChange, FormUpdate<T>>,
    ) => {
      if (update.type === FormAction.onChange && update.payload) {
        if ("target" in update.payload) {
          const target = update.payload.target as HTMLInputElement;
          const { name, value } = target;
          set(valuesAtom, {
            ...get(valuesAtom),
            [name]: value,
          });
        } else {
          set(valuesAtom, {
            ...get(valuesAtom),
            ...(update.payload as Partial<T>),
          });
        }
      }
      return { shouldAbortNextSetter: false };
    },
  );
};
