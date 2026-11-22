import { useState } from 'react';
import { SearchBar } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

export default function SearchBarBasic() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState('输入关键词后按回车搜索');

  return (
    <MobileFrame>
      <div className="docs-mobile-stack">
        <SearchBar
          value={value}
          onChange={setValue}
          onSearch={(keyword) =>
            setResult(keyword ? `正在搜索「${keyword}」` : '请输入搜索关键词')
          }
          onCancel={() => setResult('已取消搜索')}
          cancelText="取消"
          placeholder="搜索组件、文档或示例"
        />
        <p className="docs-mobile-caption">{result}</p>
        <p className="docs-mobile-caption">
          聚焦时高亮输入框，输入内容后出现清空按钮；取消会清空并失焦。
        </p>
      </div>
    </MobileFrame>
  );
}
