'use client';

import Link from 'next/link';
import React from 'react';
import Loading from '../../../componants/loading/Loading';
import Button from '../../../componants/buttons/Button';
import { iconsMap } from '../../../constante/iconsMap';
import useLogin from '../../../hooks/auth/useLogin';
import InputWithIcon from '../../../componants/form/InputWithIcon';

/**
 * Login page component that handles user authentication
 * @component
 * @returns {JSX.Element} The rendered login page component with form inputs and authentication options
 */

const Login = () => {
  const {
    handleSubmit,
    handleChange,
    handleGoogleSignIn,
    formData,
    loginErrors,
    isLoading,
  } = useLogin();

  return (
    <>
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-2xl font-bold text-blue-900">Login</h1>
        <p>Add your details below to get back into the app</p>
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
              value={formData.email}
              error={loginErrors.email}
              autoComplete={'email'}
              IconComponent={iconsMap.IconEmail}
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <InputWithIcon
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              handleChange={handleChange}
              value={formData.password}
              error={loginErrors.password}
              autoComplete={'current-password'}
              IconComponent={iconsMap.IconPassword}
            />
            <p className="text-sm cursor-pointer absolute top-0.5 right-0 font-semibold text-blue-800 transition-all duration-300 hover:text-blue-500">
              Forget your password?
            </p>
          </div>
        </div>
        {loginErrors.general && (
          <p className="text-red-500">{loginErrors.general}</p>
        )}
        {isLoading && <Loading />}
        <div className="h-[46px] w-full ">
          <Button
            label={'Login'}
            color={'filled'}
            type="submit"
            disabled={isLoading}
          />
        </div>
        <div className="h-[46px] w-full">
          <Button
            label={'Login with Google'}
            onClick={handleGoogleSignIn}
            color={'empty'}
            IconComponent={iconsMap.IconGoogle}
            disabled={isLoading}
          />
        </div>
        <p className="px-[5%] sm:px-[10%] ">
          Don&apos;t have an account?{' '}
          <Link href="/signup">
            <span className="font-semibold text-blue-800 transition-all duration-300 hover:text-blue-500">
              Create account
            </span>
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
