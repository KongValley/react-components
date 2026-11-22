import { ALL_NAV_ITEMS } from '../docs/nav';
import type { ComponentDoc } from '../docs/types';
import { ApiTable } from './ApiTable';
import { DemoBlock } from './DemoBlock';

export function ComponentDocPage({ doc }: { doc: ComponentDoc }) {
  const index = ALL_NAV_ITEMS.findIndex((item) => item.key === doc.key);
  const previous = index > 0 ? ALL_NAV_ITEMS[index - 1] : undefined;
  const next = index >= 0 && index < ALL_NAV_ITEMS.length - 1 ? ALL_NAV_ITEMS[index + 1] : undefined;

  return (
    <article className="doc-page">
      <header className="doc-page__header">
        <div className="doc-page__eyebrow">{doc.english}</div>
        <h1>{doc.name}</h1>
        <p className="doc-page__lead">{doc.description}</p>
        {doc.whenToUse ? (
          <div className="doc-page__tip">
            <strong>何时使用</strong>
            <span>{doc.whenToUse}</span>
          </div>
        ) : null}
      </header>

      <section className="doc-page__demos">
        {doc.demos.map((demo) => (
          <DemoBlock
            key={demo.title}
            title={demo.title}
            description={demo.description}
            code={demo.code}
          >
            {demo.element}
          </DemoBlock>
        ))}
      </section>

      <section className="doc-page__api">
        <h2>API</h2>
        <ApiTable rows={doc.api} />
      </section>

      <nav className="doc-page__pager" aria-label="相邻组件">
        {previous ? (
          <a href={`#/components/${previous.key}`} className="doc-page__pager-link">
            <span>← 上一个</span>
            <strong>{previous.name}</strong>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a
            href={`#/components/${next.key}`}
            className="doc-page__pager-link doc-page__pager-link--next"
          >
            <span>下一个 →</span>
            <strong>{next.name}</strong>
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
