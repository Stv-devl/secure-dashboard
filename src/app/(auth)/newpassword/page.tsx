'use client';

import React from 'react';
import Loading from '../../../componants/loading/Loading';
import Button from '../../../componants/buttons/Button';
import { iconsMap } from '../../../constante/iconsMap';
import InputWithIcon from '../../../componants/form/InputWithIcon';
import useNewPassword from '@/hooks/auth/useNewPassword';

/**
 * PswBackup page component that handles user authentication
 * @component
 * @returns {JSX.Element} The rendered PswBackup page component with form inputs and authentication options
 */

const NewPassword = () => {
  const { handleSubmit, handleChange, formData, newPasswordErrors, isLoading } =
    useNewPassword();
  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <h1 className="text-2xl font-bold text-blue-900">New password</h1>
        <p>Write your new password</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[20px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-1 relative">
            <InputWithIcon
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              handleChange={handleChange}
              value={formData.password}
              error={newPasswordErrors.password}
              autoComplete={'current-password'}
              IconComponent={iconsMap.IconPassword}
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <InputWithIcon
              name="repeat"
              label="Repeat password"
              placeholder="Repeat your password"
              type="passw   rd"
              handleChange={handleChange}
              value={formData.repeat}
              error={newPasswordErrors.repeat}
              autoComplete={'current-password'}
              IconComponent={iconsMap.IconPassword}
            />
          </div>
        </div>
        {isLoading && <Loading />}
        <div className="h-[46px] w-full ">
          <Button
            label={'Change password'}
            color={'filled'}
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default NewPassword;
