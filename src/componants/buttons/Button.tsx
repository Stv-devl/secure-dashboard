import clsx from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { ButtonComponent } from '../../type/componantsType';

/**
 * Reusable button component with various style options
 * @param {Object} props - Component properties
 * @param {string} props.label - Text to display on the button
 * @param {Function} props.onClick - Callback function triggered when the button is clicked
 * @param {string} props.color - Button color ('empty' for a button with border, otherwise filled)
 * @param {React.ComponentType} props.IconComponent - Optional icon component to display
 * @param {boolean} props.disabled - Indicates if the button is disabled
 * @param {string} props.type - HTML button type ('button', 'submit', 'reset')
 * @param {string} props.iconColor - Color of the icon if present
 * @returns {JSX.Element} The rendered button component
 */

const Button: React.FC<ButtonComponent> = ({
  label,
  onClick,
  color,
  IconComponent,
  disabled,
  type,
  iconColor,
}: ButtonComponent): React.ReactElement => {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled || false}
      className={twMerge(
        clsx(
          color === 'empty'
            ? 'border border-blue-900 bg-white text-blue-900 hover:bg-blue-100'
            : 'bg-blue-700 text-white hover:bg-blue-900',
          'flex items-center justify-center gap-1 lg:gap-2 duration-500 ease-in-out font-semibold rounded-lg w-full h-full px-3 cursor-pointer'
        )
      )}
    >
      {IconComponent && <IconComponent fill={iconColor} />}
      {label}
    </button>
  );
};

export default Button;
