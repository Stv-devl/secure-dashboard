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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  placeholder: string;
  error: string;
  autoComplete: string;
  IconComponent: React.ComponentType<{ fill?: string }>;
}
