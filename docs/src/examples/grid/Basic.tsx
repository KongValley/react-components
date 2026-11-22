import type { CSSProperties } from 'react';
import { Col, Row } from '@lib';

const box: CSSProperties = {
  padding: '12px 8px',
  border: '1px solid var(--rc-color-primary-border)',
  borderRadius: 6,
  background: 'var(--rc-color-primary-bg)',
  color: 'var(--rc-color-primary)',
  fontSize: 13,
  textAlign: 'center',
};

export default function GridBasic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Row gutter={12}>
        <Col span={24}>
          <div style={box}>24 栅格</div>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <div style={box}>6</div>
        </Col>
        <Col span={6}>
          <div style={box}>6</div>
        </Col>
        <Col span={6}>
          <div style={box}>6</div>
        </Col>
        <Col span={6}>
          <div style={box}>6</div>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <div style={box}>8</div>
        </Col>
        <Col span={8} offset={8}>
          <div style={box}>8 offset 8</div>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12}>
          <div style={box}>12</div>
        </Col>
        <Col span={12}>
          <div style={box}>12</div>
        </Col>
      </Row>
    </div>
  );
}
