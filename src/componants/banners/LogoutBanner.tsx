import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { iconsMap } from '../../constante/iconsMap';

/**
 * Banner component that displays the navigation bar with login and register links
 * @returns The banner component
 */
const LogoutBanner = () => {
  const pathname = usePathname();

  return (
    <>
      <nav className="px-2 sm:px-10 mb-5 h-[70px] w-full bg-white py-0 shadow-sm">
        <div className="flex size-full items-center justify-between ">
          <iconsMap.IconLogo />

          <div className="flex sm:gap-2 font-semibold text-blue-900 ">
            <Link
              href="/login"
              className={twMerge(
                'flex items-center p-2 sm:p-4 hover:bg-blue-100 transition ease-in-out duration-700 rounded-lg',
                clsx({ 'bg-blue-100': pathname === '/login' })
              )}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={twMerge(
                'flex items-center p-4 hover:bg-blue-100 transition ease-in-out duration-700 rounded-lg',
                clsx({ 'bg-blue-100': pathname === '/signup' })
              )}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default LogoutBanner;
