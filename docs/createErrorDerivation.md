# createErrorDerivation

The `createErrorDerivation` function is an enhancer that adds validation error handling to a form atom. It integrates with the [class-validator](https://github.com/typestack/class-validator) library to provide robust validation for form inputs.

## API

```typescript
function createErrorDerivation<T extends object>(
  ValidatorC: new () => Object,
): AtomEnhancer;
```

### Parameters

- `ValidatorC`: A class constructor for a validator class decorated with class-validator decorators.

### Returns

Returns an atom enhancer that adds error handling to the form state.

## State Added

The enhancer adds the following properties to the form state:

- `errors`: An object containing all validation errors for the form
- `errorsTouched`: An object containing only validation errors for fields that have been touched

Both are of type `FormErrors<T>` which maps field names to error messages.

## How It Works

1. The enhancer creates a new instance of the validator class
2. It applies the current form values to this instance
3. It runs validation using `validateSync` from class-validator
4. It converts validation errors into a simple object with field names as keys and error messages as values
5. It creates a filtered version showing only errors for touched fields

## Example

```typescript
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { atom } from "jotai";
import { atomEnhancer } from "jotai-composer";
import { createErrorDerivation } from "jotai-compose-form";

// Define validator class with class-validator decorators
class UserValidator {
  @IsNotEmpty({ message: "Name is required" })
  name: string = "";

  @IsEmail({}, { message: "Invalid email format" })
  email: string = "";

  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string = "";
}

// Create a base atom with values and touched state
const baseAtom = atomEnhancer(() => ({
  values: { name: "", email: "test", password: "123" },
  touched: { name: true, email: false, password: true },
}))();

// Add error validation
const formWithValidation =
  createErrorDerivation<UserValidator>(UserValidator)(baseAtom);

// The atom now includes:
// {
//   values: { name: "", email: "test", password: "123" },
//   touched: { name: true, email: false, password: true },
//   errors: {
//     name: "Name is required",
//     email: "Invalid email format",
//     password: "Password must be at least 6 characters"
//   },
//   errorsTouched: {
//     name: "Name is required",
//     password: "Password must be at least 6 characters"
//   }
// }
```

## Implementation Details

The enhancer uses the `atomEnhancer` function from jotai-composer and defines only a read function, as it's a pure derivation with no write behavior.

```typescript
// Simplified implementation
export const createErrorDerivation = <T extends object>(
  ValidatorC: new () => Object,
) => {
  return atomEnhancer(
    // Read function
    (get, { last }) => {
      const validator = new ValidatorC();
      const { values, touched } = last || {};

      // Merge values into validator instance
      Object.assign(validator, values);

      // Run validation
      const validationErrors = validateSync(validator, {
        skipMissingProperties: true,
      });

      // Convert to simple errors object
      const errors = validationErrors.reduce((acc, err) => {
        acc[err.property] = Object.values(err.constraints || {}).join(", ");
        return acc;
      }, {});

      // Filter to show only errors for touched fields
      const errorsTouched = Object.entries(errors).reduce(
        (acc, [key, value]) => {
          if (value && touched?.[key]) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      return { errors, errorsTouched };
    },
    // No write function needed
  );
};
```

## Usage in Form Components

In a React component, you would typically use this with the `useFormAtom` hook:

```tsx
function LoginForm() {
  const { formData, register } = useFormAtom(loginFormAtom);

  return (
    <form>
      <div>
        <input {...register("email")} />
        {formData.errorsTouched.email && (
          <div className="error">{formData.errorsTouched.email}</div>
        )}
      </div>
      {/* Other fields */}
    </form>
  );
}
```

## Testing

When testing components that use validation, you'll want to verify:

1. That validation runs properly and errors are captured
2. That errors are only displayed for touched fields
3. That errors are cleared when valid values are entered

Here's an example test for the enhancer:

```typescript
import { createStore } from "jotai";
import { atom } from "jotai";
import { describe, expect, it } from "vitest";
import { createErrorDerivation } from "./createErrorDerivation";
import { IsNotEmpty, IsEmail } from "class-validator";
import { atomEnhancer } from "jotai-composer";

describe("createErrorDerivation", () => {
  class UserValidator {
    @IsNotEmpty({ message: "Name is required" })
    name: string = "";

    @IsEmail({}, { message: "Invalid email format" })
    email: string = "";
  }

  it("should validate form values", () => {
    const baseAtom = atomEnhancer(() => ({
      values: { name: "", email: "invalid" },
      touched: { name: true, email: true },
    }))();

    const enhancedAtom =
      createErrorDerivation<UserValidator>(UserValidator)(baseAtom);
    const store = createStore();
    const state = store.get(enhancedAtom);

    expect(state.errors).toHaveProperty("name", "Name is required");
    expect(state.errors).toHaveProperty("email", "Invalid email format");
    expect(state.errorsTouched).toHaveProperty("name");
    expect(state.errorsTouched).toHaveProperty("email");
  });
});
```
