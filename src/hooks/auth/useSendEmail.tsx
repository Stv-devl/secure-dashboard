import { postSendEmail } from '@/service/auth/postSendEmail';
import { sendLinkSchema } from '@/shema/changePasswordShema';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import * as Yup from 'yup';

const useSendEmail = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [emailErrors, setEmailErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  /**
   * Handles input changes in the login form
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
    setEmailErrors('');
  };

  /**
   * Handles errors during the backup password process
   * @param {unknown} error - The error that occurred
   */
  const handleError = (error: unknown) => {
    if (error instanceof Yup.ValidationError) {
      const errorMessage = error.inner[0]?.message;
      setEmailErrors(errorMessage);
    } else {
      console.error('Failed to send email:', error);
      setEmailErrors('Failed to send email');
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
      await sendLinkSchema.validate(
        { email: userEmail },
        { abortEarly: false }
      );

      const result = await postSendEmail(userEmail);

      if (result?.error) {
        setEmailErrors(result.error || 'Une erreur est survenue');
      } else {
        router.push('/login');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { userEmail, emailErrors, isLoading, handleChange, handleSubmit };
};

export default useSendEmail;
