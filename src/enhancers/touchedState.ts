/** @format */

import { atom } from "jotai";
import { atomEnhancer, DispatcherAction } from "jotai-composer";
import { FormAction, TouchedState } from "./types";

export const createTouchedDecorator = <T extends object>(
  initialTouched?: TouchedState<T>,
) => {
  const touchedAtom = atom<TouchedState<T>>(initialTouched || {});

  return atomEnhancer(
    // Read function
    (get) => {
      const touched = get(touchedAtom);
      return { touched };
    },

    // Write function
    (
      get,
      set,
      update: DispatcherAction<
        FormAction,
        { target: HTMLInputElement | HTMLTextAreaElement }
      >,
    ) => {
      if (update.type === FormAction.onBlur && update.payload) {
        const target = update.payload.target;
        const { name } = target;
        const lastTouchedState = get(touchedAtom);
        const newLastTouchedState = {
          ...lastTouchedState,
          [name]: true,
        };
        set(touchedAtom, newLastTouchedState);
      }
      return { shouldAbortNextSetter: false };
    },
  );
};
