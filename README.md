<!-- @format -->

# Compose Form jotai

> _Compose fully-typed **form enhancers** into a single Jotai atom._ [See example project](https://github.com/diegodhh/compose-form-jotai-example)

# compose-form-jotai

A TypeScript library for building form state management with Jotai using a composable atom approach.

## About compose-form-jotai

`compose-form-jotai` is a form management library built on top of [Jotai](https://jotai.org/) that lets you create type-safe, modular form state through composition.

Key features:

- **Type-safe**: Form values, errors, and actions are fully typed
- **Validation Support**: Built-in integration with class-validator
- **React Integration**: Easy to use with React components
- **Composable**: Built using enhancers that can be composed together

## Installation

```bash
npm install compose-form-jotai class-validator jotai-composer remeda
# or
yarn add compose-form-jotai class-validator jotai-composer remeda
```

## Usage Guide

### 1. Define your form data structure

```tsx
// Define the form data structure
interface UserFormData {
  name: string;
  email: string;
  age: number;
}

// Create the initial form state
const initialFormData: UserFormData = {
  name: "",
  email: "",
  age: 0,
};
```

### 2. Create a validator class

Use class-validator decorators to define validation rules:

```tsx
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

class UserFormValidator {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(2)
  age!: number;
}
```

### 3. Create a form atom

```tsx
import { createFormAtom } from "compose-form-jotai";
import { atom } from "jotai";

const userFormAtom = createFormAtom<UserFormData>({
  handleSubmit: async (data) => {
    console.log("Form submitted with data:", data);
    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // You could perform validation or send data to a server here
  },
  initialValues: initialFormData,
  ValidatorC: UserFormValidator,
});
```

### 4. Use the form atom in your components

```tsx
import { useFormAtom } from "compose-form-jotai";

function UserForm() {
  const { actions, register, formData } = useFormAtom(userFormAtom);

  return (
    <form onSubmit={actions.onSubmit}>
      <FormInput {...register("name")} id="name" type="text" label="Name:" />

      <FormInput
        id="email"
        type="email"
        label="Email:"
        {...register("email")}
      />

      <FormInput id="age" type="number" label="Age:" {...register("age")} />

      <button type="submit">
        {formData.isSubmiting ? "Loading..." : "Submit"}
      </button>

      {formData.hasSubmitted &&
        !formData.isSubmiting &&
        Object.keys(formData.errors || {}).length === 0 && (
          <div className="submission-status">
            <p>Form has been submitted successfully!</p>
          </div>
        )}
    </form>
  );
}
```

## Core Concepts

### FormAtom

A `FormAtom` is a Jotai atom that contains the complete form state and is created through the `createFormAtom` function. It manages:

- Form values
- Touched state
- Validation errors
- Form submission

### Enhancers

The library uses a composition pattern where each feature is implemented as an enhancer. Enhancers are composed together to create the complete form state management.

## API Reference

### `createFormAtom<T>`

Creates a composable form atom that manages the complete form state.

```typescript
function createFormAtom<T extends object>({
  initialValues,
  ValidatorC,
  initialTouched,
  handleSubmitAtom,
}: {
  initialTouched?: TouchedState<T>;
  initialValues?: Partial<T>;
  ValidatorC: new () => Object;
  handleSubmitAtom: Atom<(payload: Partial<T>) => Promise<unknown | void>>;
}): FormAtom<T>;
```

#### Parameters:

- `initialValues` (optional): Initial values for form fields
- `ValidatorC`: Class constructor for validation using class-validator decorators
- `initialTouched` (optional): Initial touched state for form fields
- `handleSubmitAtom`: Jotai atom containing the submit handler function

### `useFormAtom<T>`

A React hook that provides access to form state and methods for a `FormAtom`.

```typescript
function useFormAtom<T extends { [key: string]: unknown }>(
  formAtom: FormAtom<T>,
): {
  formData: {
    values: Partial<T>;
    touched: TouchedState<T>;
    errors: FormErrors<T>;
    errorsTouched: FormErrors<T>;
    isSubmiting?: boolean;
    hasSubmitted?: boolean;
  };
  actions: {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (
      event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  };
  register: (name: keyof T) => {
    name: keyof T;
    value: any;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (
      event?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    error: boolean;
    helperText: string | undefined;
  };
};
```

#### Returns:

An object containing:

- `formData`: The current form state, including values, errors, and submission state
- `actions`: Event handlers for form events
- `register`: Function to generate props for form inputs

## Form State

### Values

Form values are stored in the `values` property of the form state:

```typescript
// Inside your component using useFormAtom
const { formData } = useFormAtom(myFormAtom);
const currentValues = formData.values;
```

### Validation Errors

Validation errors are stored in two ways:

- `errors`: All validation errors
- `errorsTouched`: Only errors for fields that have been touched

```typescript
// Show error only if field has been touched
{formData.errorsTouched.fieldName && <p>{formData.errorsTouched.fieldName}</p>}
```

### Touched State

The `touched` property tracks which fields have been interacted with:

```typescript
// Check if a field has been touched
const isFieldTouched = formData.touched.fieldName;
```

## Advanced Usage

### Individual Enhancers

The library exports individual enhancers that can be used for custom form state management:

- `createValues`: Manages form values
- `createTouchedDecorator`: Manages touched state
- `createErrorDerivation`: Manages validation errors
- `createHandleSubmit`: Manages form submission

```typescript
import { enhancers, pipe } from "compose-form-jotai";
import { atom } from "jotai";

// Create custom form state
const customFormAtom = pipe(
  enhancers.createValues(initialValues)(),
  enhancers.createTouchedDecorator(initialTouched),
  enhancers.createErrorDerivation(MyValidator),
  enhancers.createHandleSubmit({ handleSubmitAtom }),
);
```

## License

MIT © [Diego Herrero](https://github.com/diegodhh)
