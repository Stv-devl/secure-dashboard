import { UseFormRegisterReturn } from 'react-hook-form';

export interface ButtonComponent {
  label: string;
  onClick?: () => void;
  color: 'empty' | 'filled';
  IconComponent?: React.ComponentType<{ fill?: string }>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  iconColor?: string;
}

export interface InputWithIconProps {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  IconComponent: React.ComponentType<{ fill?: string }>;
  error: string;
  registration: UseFormRegisterReturn<string>;
}
