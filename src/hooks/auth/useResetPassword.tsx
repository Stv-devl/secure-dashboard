import { postResetPassword } from '@/service/auth/postResetPassword';
import { postChangePassword } from '@/service/auth/postSendEmail';
import { newPasswordSchema } from '@/shema/changePasswordShema';
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

      const result = await postResetPassword(formData.password);
      console.log('Change password successful', result);

      if (result?.ok) {
        router.push('/login');
      } else {
        console.error('Change password failed:', result?.error);
        setNewPasswordErrors((prev) => ({
          ...prev,
          general: 'Change password process encountered an error',
        }));
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
