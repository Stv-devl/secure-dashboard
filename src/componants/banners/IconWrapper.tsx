import React from 'react';
import { iconsMap } from '../../constante/iconsMap';

const IconWrapper = () => {
  return (
    <div className="flex items-center gap-3">
      <iconsMap.IconLogo />
      <h2 className="font-color-theme text-xl font-semibold">DivBrainers</h2>
    </div>
  );
};

export default IconWrapper;
