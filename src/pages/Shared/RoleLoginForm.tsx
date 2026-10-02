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
  validateLogin,
  type LoginInput,
} from "./authValidation";

interface RoleLoginFormProps {
  brandRole: string;
  title: string;
  subtitle: string;
  links: AuthLink[];
  isLoading: boolean;
  onLogin: (credentials: LoginInput) => Promise<void>;
}

/** Email + password login, shared by merchant and driver. The role-specific
 *  page supplies the mutation, redirect and links. */
const RoleLoginForm = ({
  brandRole,
  title,
  subtitle,
  links,
  isLoading,
  onLogin,
}: RoleLoginFormProps) => {
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validateLogin(form);
    if (problem) return setError(problem);
    setError(null);
    try {
      await onLogin({ email: form.email.trim(), password: form.password });
    } catch (err) {
      setError(apiErrorMessage(err, "Login failed. Check your credentials."));
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
          id='email'
          label='Email'
          type='email'
          autoComplete='username'
          placeholder='you@example.com'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          id='password'
          label='Password'
          type='password'
          autoComplete='current-password'
          placeholder='Enter your password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <ErrorBanner message={error} />}
        <SubmitButton loading={isLoading} idle='Login' busy='Logging in...' />
      </form>
    </AuthLayout>
  );
};

export default RoleLoginForm;
