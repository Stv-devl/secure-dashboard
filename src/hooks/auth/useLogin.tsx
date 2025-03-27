import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import * as Yup from 'yup';
import { loginSchema } from '../../shema/loginShema';
import { FormDataLogin, UseLoginReturn } from '../../type/hookType';

/**
 * UseLogin hook that handles the login process
 * @returns {UseLoginReturn} The UseLoginReturn object
 */
const useLogin = (): UseLoginReturn => {
  const [formData, setFormData] = useState<FormDataLogin>({
    email: '',
    password: '',
  });

  const [loginErrors, setLoginErrors] = useState<FormDataLogin>({
    email: '',
    password: '',
    general: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles input changes in the login form
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLoginErrors({ email: '', password: '', general: '' });
  };

  /**
   * Handles errors during the login process
   * @param {unknown} error - The error that occurred
   */
  const handleError = (error: unknown) => {
    if (error instanceof Yup.ValidationError) {
      const fieldErrors = error.inner.reduce((acc, err) => {
        if (err.path) acc[err.path as keyof FormDataLogin] = err.message;
        return acc;
      }, {} as FormDataLogin);
      setLoginErrors(fieldErrors);
    } else {
      console.error('Login failed:', error);
      setLoginErrors((prev) => ({ ...prev, general: 'Failed to log in' }));
    }
  };

  /**
   * Handles the form submission for login
   * @param {FormEvent} e - The form event
   * @returns {Promise<void>} A promise that resolves when the login process is complete
   */
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginSchema.validate(formData, { abortEarly: false });

      const result = await signIn('credentials', {
        redirect: true,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/home',
      });

      if (result?.error) {
        setLoginErrors((prev) => ({
          ...prev,
          general: result.error || 'Failed to log in',
        }));
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  /**
   * Handles Google sign-in
   * @returns {Promise<void>} A promise that resolves when the Google sign-in process is complete
   */
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await signIn('google', {
        redirect: true,
        callbackUrl: '/home',
      });
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    handleChange,
    handleGoogleSignIn,
    formData,
    loginErrors,
    isLoading,
  };
};

export default useLogin;
