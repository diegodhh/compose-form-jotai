import { createFormAtom } from "./formAtomFactory";

/** @format */
export type FormAtom<T extends object> = ReturnType<typeof createFormAtom<T>>;
