import { type FormEvent, useState } from "react";
import {
  AuthLayout,
  ErrorBanner,
  SubmitButton,
  TextField,
  type AuthLink,
} from "./AuthLayout";
import {
  apiErrorMessage,
  validateSignUp,
  type SignUpInput,
} from "./authValidation";

interface RoleSignUpFormProps {
  brandRole: string;
  title: string;
  subtitle: string;
  links: AuthLink[];
  isLoading: boolean;
  onSignUp: (input: SignUpInput) => Promise<void>;
}

/** Registration form shared by merchant and driver. */
const RoleSignUpForm = ({
  brandRole,
  title,
  subtitle,
  links,
  isLoading,
  onSignUp,
}: RoleSignUpFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validateSignUp(form);
    if (problem) return setError(problem);
    setError(null);
    try {
      await onSignUp({
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
    } catch (err) {
      setError(apiErrorMessage(err, "Sign up failed. Please try again."));
    }
  };

  return (
    <AuthLayout
      brandRole={brandRole}
      title={title}
      subtitle={subtitle}
      links={links}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <TextField
          id='name'
          label='Full name'
          autoComplete='name'
          value={form.name}
          onChange={set("name")}
        />
        <TextField
          id='email'
          label='Email'
          type='email'
          autoComplete='username'
          value={form.email}
          onChange={set("email")}
        />
        <TextField
          id='phoneNumber'
          label='Mobile number (optional)'
          inputMode='numeric'
          maxLength={10}
          placeholder='e.g. 9876543210'
          value={form.phoneNumber}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
            }))
          }
        />
        <TextField
          id='password'
          label='Password'
          type='password'
          autoComplete='new-password'
          value={form.password}
          onChange={set("password")}
        />
        <TextField
          id='confirm'
          label='Confirm password'
          type='password'
          autoComplete='new-password'
          value={form.confirm}
          onChange={set("confirm")}
        />
        {error && <ErrorBanner message={error} />}
        <SubmitButton
          loading={isLoading}
          idle='Create account'
          busy='Creating account...'
        />
      </form>
    </AuthLayout>
  );
};

export default RoleSignUpForm;
