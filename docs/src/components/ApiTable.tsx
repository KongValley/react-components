import type { ApiRow } from '../docs/types';

export function ApiTable({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>属性</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop}>
              <td>
                <code className="api-table__prop">{row.prop}</code>
              </td>
              <td>
                <code className="api-table__type">{row.type}</code>
              </td>
              <td>{row.defaultValue ? <code>{row.defaultValue}</code> : '—'}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
