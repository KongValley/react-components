import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger';

export interface CopyableConfig {
  /** Text copied to the clipboard. Defaults to string/number children. */
  text?: string;
  onCopy?: (text: string) => void;
  /** [copy, copied] accessible labels. */
  tooltips?: [string, string];
}

export interface TypographyBaseProps {
  type?: TypographyType;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  code?: boolean;
  mark?: boolean;
  disabled?: boolean;
  /** Single-line ellipsis by default; pass rows for multi-line clamping. */
  ellipsis?: boolean | { rows?: number };
  copyable?: boolean | CopyableConfig;
}

interface ContentProps extends TypographyBaseProps {
  children: ReactNode;
}

async function writeToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through to the legacy path (permissions, insecure context, ...)
    }
  }

  if (typeof document === 'undefined') return;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (typeof document.execCommand === 'function') {
      document.execCommand('copy');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function useCopy(onCopy?: (text: string) => void) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = (text: string) => {
    void writeToClipboard(text);
    setCopied(true);
    onCopy?.(text);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return { copied, copy };
}

const TYPE_CLASS: Record<TypographyType, string> = {
  secondary: 'rcui-typography--secondary',
  success: 'rcui-typography--success',
  warning: 'rcui-typography--warning',
  danger: 'rcui-typography--danger',
};

function TypographyContent({ children, copyable, ellipsis }: ContentProps) {
  const config: CopyableConfig | null =
    copyable === true ? {} : copyable ? copyable : null;
  const { copied, copy } = useCopy(config?.onCopy);

  const rows = typeof ellipsis === 'object' ? (ellipsis.rows ?? 1) : 1;
  const multiline = Boolean(ellipsis) && rows > 1;

  const content = (
    <span
      className={cx(
        'rcui-typography__content',
        ellipsis && 'rcui-typography__content--ellipsis',
        multiline && 'rcui-typography__content--multiline',
      )}
      style={multiline ? { WebkitLineClamp: rows } : undefined}
    >
      {children}
    </span>
  );

  if (!config) return content;

  const text = config.text ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : '');
  const tooltips = config.tooltips ?? ['Copy', 'Copied'];

  return (
    <>
      {content}
      <button
        type="button"
        className={cx('rcui-typography__copy', copied && 'is-copied')}
        title={copied ? tooltips[1] : tooltips[0]}
        aria-label={copied ? tooltips[1] : tooltips[0]}
        onClick={() => copy(text)}
      >
        <Icon name={copied ? 'check' : 'copy'} size={14} />
      </button>
    </>
  );
}

function splitProps<T extends TypographyBaseProps>(
  { type, strong, italic, underline, delete: deleted, code, mark, disabled, ellipsis, copyable, ...rest }: T,
) {
  return {
    rest,
    rootClass: cx(
      'rcui-typography',
      type && TYPE_CLASS[type],
      strong && 'rcui-typography--strong',
      italic && 'rcui-typography--italic',
      underline && 'rcui-typography--underline',
      deleted && 'rcui-typography--delete',
      code && 'rcui-typography--code',
      mark && 'rcui-typography--mark',
      disabled && 'rcui-typography--disabled',
      ellipsis && 'rcui-typography--ellipsis',
      copyable && 'rcui-typography--with-copy',
    ),
    contentProps: { copyable, ellipsis } as Pick<ContentProps, 'copyable' | 'ellipsis'>,
  };
}

export type TitleLevel = 1 | 2 | 3 | 4 | 5;

export interface TitleProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'type'>,
    TypographyBaseProps {
  level?: TitleLevel;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  { level = 1, className, children, ...props },
  ref,
) {
  const { rest, rootClass, contentProps } = splitProps(props);
  const Heading = `h${level}` as 'h1';
  return (
    <Heading
      ref={ref}
      className={cx(rootClass, 'rcui-title', `rcui-title--${level}`, className)}
      {...rest}
    >
      <TypographyContent {...contentProps}>{children}</TypographyContent>
    </Heading>
  );
});

export interface TextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'type'>,
    TypographyBaseProps {}

export const Text = forwardRef<HTMLSpanElement, TextProps>(function Text(
  { className, children, ...props },
  ref,
) {
  const { rest, rootClass, contentProps } = splitProps(props);
  return (
    <span ref={ref} className={cx(rootClass, 'rcui-text', className)} {...rest}>
      <TypographyContent {...contentProps}>{children}</TypographyContent>
    </span>
  );
});

export interface ParagraphProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'type'>,
    TypographyBaseProps {}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(function Paragraph(
  { className, children, ...props },
  ref,
) {
  const { rest, rootClass, contentProps } = splitProps(props);
  return (
    <p ref={ref} className={cx(rootClass, 'rcui-paragraph', className)} {...rest}>
      <TypographyContent {...contentProps}>{children}</TypographyContent>
    </p>
  );
});

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>,
    Omit<TypographyBaseProps, 'copyable'> {
  disabled?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, children, disabled, href, onClick, ...props },
  ref,
) {
  const { rest, rootClass } = splitProps(props);
  return (
    <a
      ref={ref}
      className={cx(rootClass, 'rcui-link', disabled && 'rcui-link--disabled', className)}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </a>
  );
});

export const Typography = { Title, Text, Paragraph, Link };
