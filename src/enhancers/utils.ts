/** @format */

import { DispatcherAction } from "jotai-composer";
import { FormAction } from "./types";

export const dispatchToHandlers = <T extends FormAction, K>({
  actions,
  dispatch,
}: {
  actions: T[];
  dispatch: (update: DispatcherAction<FormAction, K>) => void;
}) => {
  return actions.reduce(
    (acc, action) => {
      acc[action] = (update: K) => {
        dispatch({ type: action as T, payload: update });
      };
      return acc;
    },
    {} as Record<T, (update: K) => void>,
  );
};
