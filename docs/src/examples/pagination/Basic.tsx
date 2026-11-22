import { useState } from 'react';
import { Pagination, Space } from '@lib';

export default function PaginationBasic() {
  const [current, setCurrent] = useState(1);

  return (
    <Space direction="vertical" size={18} style={{ width: '100%' }}>
      <Pagination
        current={current}
        total={200}
        pageSize={10}
        showSizeChanger
        showQuickJumper
        showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`}
        onChange={(page) => setCurrent(page)}
      />
      <Pagination total={85} simple />
      <Pagination total={50} pageSizeOptions={[5, 10, 20]} showSizeChanger />
    </Space>
  );
}
