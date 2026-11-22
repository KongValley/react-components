import { useState } from 'react';
import { Swiper } from '@lib';
import { MobileFrame } from '../../components/MobileFrame';

const SLIDES = [
  {
    title: '组件库 0.2',
    text: '新增移动端组件与更顺滑的手势交互',
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  },
  {
    title: '暗色模式',
    text: '所有组件基于 CSS 变量自动切换主题',
    background: 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)',
  },
  {
    title: '零运行时',
    text: '只依赖 React，产物轻量且可 tree-shaking',
    background: 'linear-gradient(135deg, #b45309 0%, #ef4444 100%)',
  },
];

export default function SwiperBasic() {
  const [index, setIndex] = useState(0);

  return (
    <MobileFrame>
      <div className="docs-mobile-pad">
        <Swiper
          index={index}
          onChange={setIndex}
          height={220}
          loop
          autoplay
          interval={2800}
          aria-label="组件库亮点"
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.title}
              className="docs-mobile-slide"
              style={{ background: slide.background }}
            >
              <strong>{slide.title}</strong>
              <span>{slide.text}</span>
            </div>
          ))}
        </Swiper>
        <p className="docs-mobile-caption">
          当前第 {index + 1} 张，共 {SLIDES.length} 张。可左右拖动、点击指示点或使用方向键切换；
          自动播放会在系统开启减少动态效果时暂停。
        </p>
      </div>
    </MobileFrame>
  );
}
