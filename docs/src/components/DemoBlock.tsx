import { useState, type ReactNode } from 'react';
import { Icon } from '@lib';
import { CodeBlock } from './CodeBlock';

export interface DemoBlockProps {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
}

export function DemoBlock({ title, description, code, children }: DemoBlockProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="demo-block">
      <div className="demo-block__head">
        <div className="demo-block__heading">
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <button
          type="button"
          className="demo-block__toggle"
          aria-expanded={showCode}
          onClick={() => setShowCode((previous) => !previous)}
        >
          <Icon name={showCode ? 'chevron-up' : 'chevron-down'} size={13} />
          {showCode ? '收起代码' : '查看代码'}
        </button>
      </div>
      <div className="demo-block__canvas">{children}</div>
      {showCode ? <CodeBlock code={code} /> : null}
    </section>
  );
}
