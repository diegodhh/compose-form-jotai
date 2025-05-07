/** @format */
export enum FormAction {
  onChange = "onChange",
  onBlur = "onBlur",
  onSubmit = "onSubmit",
}

export enum PublicFormAction {
  onChange = FormAction.onChange,
  onBlur = FormAction.onBlur,
  onSubmit = FormAction.onSubmit,
}

export type FormUpdate<T> = Partial<T> | React.ChangeEvent<HTMLInputElement>;

export type TouchedState<T extends object> = Partial<
  Record<keyof Partial<T>, boolean>
>;

export type FormErrors<T extends object> = Partial<{
  [key in keyof T]?: string;
}>;
