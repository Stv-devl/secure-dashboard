'use client';

import React from 'react';
import { iconsMap } from '../../constante/iconsMap';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="flex h-screen w-full flex-col sm:mt-10 sm:rounded-lg">
        <div className="mt-5 flex w-full flex-col items-center gap-[51px] sm:mt-10">
          <iconsMap.IconLogo />
          <div className="flex flex-col items-start gap-10 sm:rounded-lg bg-white p-6 w-full sm:w-[476px] sm:p-10 sm:shadow-md">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
