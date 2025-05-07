# Jotai Compose Form API Documentation

A TypeScript library for building form state management with Jotai using a composable atom approach.

## Installation

```bash
npm install jotai-compose-form
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

#### Returns:

A `FormAtom<T>` that can be used with `useFormAtom` hook.

#### Example:

```typescript
import { atom } from "jotai";
import { createFormAtom } from "jotai-compose-form";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

// Define validator class
class UserFormValidator {
  @IsNotEmpty({ message: "Name is required" })
  name: string = "";

  @IsEmail({}, { message: "Invalid email format" })
  email: string = "";

  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string = "";
}

// Create submission handler atom
const handleSubmitAtom = atom(async (values: Partial<UserFormValidator>) => {
  // Submit values to API
  console.log("Submitting:", values);
  // You could make an API call here
});

// Create form atom
const userFormAtom = createFormAtom({
  initialValues: { name: "", email: "", password: "" },
  ValidatorC: UserFormValidator,
  handleSubmitAtom,
});
```

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

#### Parameters:

- `formAtom`: The form atom created with `createFormAtom`

#### Returns:

An object containing:

- `formData`: The current form state
- `actions`: Event handlers for form events
- `register`: Function to generate props for form inputs

#### Example:

```tsx
import { useFormAtom } from "jotai-compose-form";

function UserForm() {
  const { formData, actions, register } = useFormAtom(userFormAtom);

  return (
    <form onSubmit={actions.onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} />
        {formData.errorsTouched.name && (
          <p className="error">{formData.errorsTouched.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {formData.errorsTouched.email && (
          <p className="error">{formData.errorsTouched.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} />
        {formData.errorsTouched.password && (
          <p className="error">{formData.errorsTouched.password}</p>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

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
import { enhancers, pipe } from "jotai-compose-form";
import { atom } from "jotai";

// Create custom form state
const customFormAtom = pipe(
  enhancers.createValues(initialValues)(),
  enhancers.createTouchedDecorator(initialTouched),
  enhancers.createErrorDerivation(MyValidator),
  enhancers.createHandleSubmit({ handleSubmitAtom }),
);
```

## Types

### FormAction

Enum for action types:

```typescript
enum FormAction {
  onChange = "onChange",
  onBlur = "onBlur",
  onSubmit = "onSubmit",
}
```

### TouchedState

Type for tracking which fields have been touched:

```typescript
type TouchedState<T extends object> = Partial<
  Record<keyof Partial<T>, boolean>
>;
```

### FormErrors

Type for validation errors:

```typescript
type FormErrors<T extends object> = Partial<{
  [key in keyof T]?: string;
}>;
```

### FormUpdate

Type for form update payloads:

```typescript
type FormUpdate<T> = Partial<T> | React.ChangeEvent<HTMLInputElement>;
```
