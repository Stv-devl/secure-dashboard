'use client';

import React from 'react';
import Loading from '../../../componants/loading/Loading';
import Button from '../../../componants/buttons/Button';
import { iconsMap } from '../../../constante/iconsMap';
import InputWithIcon from '../../../componants/form/InputWithIcon';
import usePswBackup from '@/hooks/auth/usePswBackup';

/**
 * PswBackup page component that handles user authentication
 * @component
 * @returns {JSX.Element} The rendered PswBackup page component with form inputs and authentication options
 */

const PswBackup = () => {
  const { userEmail, emailErrors, isLoading, handleChange, handleSubmit } =
    usePswBackup();

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <h1 className="text-2xl font-bold">Recover password</h1>
        <p>Enter your email to recover your password</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[20px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-1">
            <InputWithIcon
              name="email"
              label="Email address"
              placeholder="Write your email"
              type="text"
              handleChange={handleChange}
              value={userEmail}
              error={emailErrors}
              autoComplete={'email'}
              IconComponent={iconsMap.IconEmail}
            />
          </div>

          {isLoading && <Loading />}
          <div className="mt-4 h-[46px] w-full">
            <Button
              label={'Get a link to reset password'}
              color={'filled'}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default PswBackup;
