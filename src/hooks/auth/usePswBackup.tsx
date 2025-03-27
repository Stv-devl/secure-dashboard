import { postChangePassword } from '@/service/auth/postChangePassword';
import { sendLinkSchema } from '@/shema/changePasswordShema';
import React, { FormEvent, useState } from 'react';
import * as Yup from 'yup';

const usePswBackup = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [emailErrors, setEmailErrors] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const result = await postChangePassword(userEmail);

      //redirect somewhere

      if (result?.error) {
        setEmailErrors(result.error || 'Failed to send email');
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  return { userEmail, emailErrors, isLoading, handleChange, handleSubmit };
};

export default usePswBackup;
