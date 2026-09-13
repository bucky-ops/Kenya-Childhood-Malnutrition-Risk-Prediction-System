/**
 * Accessible icon wrapper.
 *
 * Lucide-react icons are decorative when paired with adjacent text. This
 * wrapper adds `aria-hidden="true"` and `focusable="false"` so screen readers
 * skip the icon and keyboard navigation doesn't focus it.
 *
 * Usage:
 *   <Icon><TrendingUp className="w-5 h-5" /></Icon>
 */
import { clsx } from 'clsx';

interface IconProps {
  children: React.ReactNode;
  className?: string;
  /** Override aria-hidden when the icon conveys meaning itself. */
  label?: string;
}

export default function Icon({ children, className, label }: IconProps) {
  return (
    <span
      className={clsx('inline-flex items-center justify-center', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {children}
    </span>
  );
}
