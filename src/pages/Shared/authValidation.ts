export interface LoginInput {
  email: string;
  password: string;
}

export interface SignUpInput extends LoginInput {
  name: string;
  phoneNumber: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors the backend's rules (name/email/password required, 6+ char
 *  password) so the obvious mistakes are caught before a round trip.
 *  Returns the first problem found, or null when the input is valid. */
export const validateLogin = ({ email, password }: LoginInput) => {
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address";
  if (!password) return "Enter your password";
  return null;
};

export const validateSignUp = (input: SignUpInput & { confirm: string }) => {
  if (input.name.trim().length < 2) return "Enter your full name";
  if (!EMAIL_RE.test(input.email.trim())) return "Enter a valid email address";
  if (input.phoneNumber && !/^[6-9]\d{9}$/.test(input.phoneNumber)) {
    return "Enter a valid 10-digit mobile number";
  }
  if (input.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (input.password !== input.confirm) return "Passwords do not match";
  return null;
};

/** Pulls the backend's `{ message }` out of an RTK Query error. */
export const apiErrorMessage = (err: unknown, fallback: string) =>
  (err as { data?: { message?: string } })?.data?.message || fallback;
