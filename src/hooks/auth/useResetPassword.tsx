import { postResetPassword } from '@/service/auth/postResetPassword';
import { newPasswordSchema } from '@/shema/changePasswordShema';
import { resetPasswordSchema } from '@/shema/resetPasswordShema';
import { FormDataNewPassword, PasswordErrorsProps } from '@/types/hookType';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import * as Yup from 'yup';

const useResetPassword = () => {
  const [formData, setFormData] = useState<FormDataNewPassword>({
    password: '',
    repeat: '',
  });

  const [newPasswordErrors, setNewPasswordErrors] =
    useState<PasswordErrorsProps>({
      password: '',
      repeat: '',
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setNewPasswordErrors({ password: '', repeat: '' });
  };

  /**
   * Handles validation and other errors during the signup process
   * @param {unknown} error - The error to handle
   */
  const handleError = (error: unknown) => {
    if (error instanceof Yup.ValidationError) {
      const fieldErrors = error.inner.reduce((acc, err) => {
        if (err.path) acc[err.path as keyof FormDataNewPassword] = err.message;
        return acc;
      }, {} as FormDataNewPassword);
      setNewPasswordErrors(fieldErrors);
    } else {
      console.error('change password error:', error);
      setNewPasswordErrors((prev) => ({
        ...prev,
        general: 'An error occur during change password',
      }));
    }
  };

  /**
   * Handles the form submission for user signup
   * @param {FormEvent<HTMLFormElement>} e - The form submission event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await newPasswordSchema.validate(formData, { abortEarly: false });

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');

      if (!token || !email) {
        setNewPasswordErrors((prev) => ({
          ...prev,
          general: 'Lien invalide ou incomplet',
        }));
        setIsLoading(false);
        return;
      }

      const parsed = resetPasswordSchema.safeParse({
        email,
        token,
        password: formData.password,
      });

      if (!parsed.success) {
        setNewPasswordErrors((prev) => ({
          ...prev,
          general: parsed.error.issues[0]?.message || 'Invalid data',
        }));
        setIsLoading(false);
        return;
      }

      const result = await postResetPassword(parsed.data);

      if (!result?.ok) {
        setNewPasswordErrors((prev) => ({
          ...prev,
          general: result?.error || 'An error occurred',
        }));
      } else {
        router.push('/login');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { formData, newPasswordErrors, isLoading, handleChange, handleSubmit };
};

export default useResetPassword;
