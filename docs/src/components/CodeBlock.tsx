import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@lib';

const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b(?:import|from|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|new|type|interface|extends|async|await|true|false|null|undefined|typeof|as|of|in|void)\b|=>)/g;

function highlight(code: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of code.matchAll(TOKEN_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(code.slice(lastIndex, index));
    }
    const className = match[1]
      ? 'code-token--comment'
      : match[2]
        ? 'code-token--string'
        : 'code-token--keyword';
    parts.push(
      <span key={key++} className={className}>
        {match[0]}
      </span>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < code.length) parts.push(code.slice(lastIndex));
  return parts;
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    if (typeof document.execCommand === 'function') document.execCommand('copy');
    textarea.remove();
  }
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  maxHeight?: number;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'tsx',
  maxHeight = 440,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const tokens = useMemo(() => highlight(code.trim()), [code]);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = () => {
    void writeClipboard(code.trim());
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={['code-block', className].filter(Boolean).join(' ')}>
      <div className="code-block__bar">
        <span className="code-block__language">{language}</span>
        <button type="button" className="code-block__copy" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={13} />
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="code-block__pre" style={{ maxHeight }}>
        <code>{tokens}</code>
      </pre>
    </div>
  );
}
