import {
  Children,
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
} from 'react';
import { useControllableState } from '../../hooks/useControllableState';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cx } from '../../utils/cx';

export interface SwiperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: ReactNode;
  index?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  /** Advances automatically every `interval` milliseconds. */
  autoplay?: boolean;
  interval?: number;
  /** Slide transition duration in milliseconds. */
  duration?: number;
  /** Enables infinite wrapping with cloned edge slides. */
  loop?: boolean;
  showIndicators?: boolean;
  allowTouchMove?: boolean;
  height?: number | string;
}

interface GestureState {
  pointerId: number;
  startX: number;
  startY: number;
  horizontal: boolean;
}

/** Touch-friendly carousel with looping, autoplay and pointer dragging. */
export const Swiper = forwardRef<HTMLDivElement, SwiperProps>(function Swiper(
  {
    children,
    index,
    defaultIndex = 0,
    onChange,
    autoplay = false,
    interval = 3000,
    duration = 300,
    loop = false,
    showIndicators = true,
    allowTouchMove = true,
    height = 180,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const loopEnabled = loop && count > 1;
  const offset = loopEnabled ? 1 : 0;
  const reducedMotion = useReducedMotion();

  const [value, setValue] = useControllableState({
    value: index,
    defaultValue: defaultIndex,
    onChange,
  });
  const safeValue = count > 0 ? Math.min(Math.max(value, 0), count - 1) : 0;

  const [position, setPosition] = useState(safeValue + offset);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<GestureState | null>(null);
  const dragOffsetRef = useRef(0);
  const pendingWrapRef = useRef<number | null>(null);
  const wrapTimerRef = useRef<number | undefined>(undefined);
  const suppressClickRef = useRef(false);
  const lastValueRef = useRef(safeValue);

  useEffect(() => {
    if (lastValueRef.current === safeValue) return;
    lastValueRef.current = safeValue;
    setPosition(safeValue + offset);
  }, [safeValue, offset]);

  useEffect(() => {
    if (count === 0) return;
    setPosition((previous) =>
      Math.max(0, Math.min(count - 1 + offset, previous)),
    );
  }, [count, offset]);

  const finishWrap = () => {
    window.clearTimeout(wrapTimerRef.current);
    wrapTimerRef.current = undefined;
    const pending = pendingWrapRef.current;
    if (pending === null) return;

    pendingWrapRef.current = null;
    setNoTransition(true);
    setPosition(pending + offset);
    lastValueRef.current = pending;
    setValue(pending);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setNoTransition(false));
    });
  };

  const scheduleWrapFinish = () => {
    window.clearTimeout(wrapTimerRef.current);
    // transitionend is the happy path; this fallback also covers interrupted
    // transitions and environments that throttle transition events.
    wrapTimerRef.current = window.setTimeout(
      finishWrap,
      reducedMotion ? 40 : Math.max(80, duration + 80),
    );
  };

  const goTo = (target: number) => {
    if (count < 2 || pendingWrapRef.current !== null) return;

    if (loopEnabled) {
      if (target < 0) {
        pendingWrapRef.current = count - 1;
        setPosition(0);
        scheduleWrapFinish();
        return;
      }
      if (target > count - 1) {
        pendingWrapRef.current = 0;
        setPosition(count + 1);
        scheduleWrapFinish();
        return;
      }
    }

    const nextIndex = Math.max(0, Math.min(count - 1, target));
    if (nextIndex !== safeValue) setValue(nextIndex);
    setPosition(nextIndex + offset);
  };

  const goNext = () => goTo(safeValue + 1);
  const goPrev = () => goTo(safeValue - 1);

  useEffect(() => {
    if (!autoplay || reducedMotion || count < 2 || dragging) return;
    const timer = window.setInterval(() => {
      if (pendingWrapRef.current !== null) return;
      if (safeValue >= count - 1 && !loopEnabled) return;
      goNext();
    }, Math.max(500, interval));
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, reducedMotion, count, dragging, interval, safeValue, loopEnabled]);

  const handleTransitionEnd = (event: ReactTransitionEvent<HTMLDivElement>) => {
    if (event.target !== trackRef.current || event.propertyName !== 'transform') return;
    if (pendingWrapRef.current === null) return;
    finishWrap();
  };

  useEffect(() => () => window.clearTimeout(wrapTimerRef.current), []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!allowTouchMove || count < 2 || event.button !== 0) return;
    if (pendingWrapRef.current !== null) return;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      horizontal: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;

    if (!gesture.horizontal) {
      if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy)) return;
      gesture.horizontal = true;
      setDragging(true);
      suppressClickRef.current = true;
    }

    let next = dx;
    if (!loopEnabled) {
      if (position === 0 && dx > 0) next = dx * 0.28;
      else if (position === count - 1 && dx < 0) next = dx * 0.28;
    }
    dragOffsetRef.current = next;
    setDragOffset(next);
  };

  const endGesture = (navigate: boolean) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (!gesture) return;

    const dx = dragOffsetRef.current;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setDragging(false);

    if (navigate && gesture.horizontal) {
      const threshold = Math.max(
        36,
        (viewportRef.current?.clientWidth ?? 0) * 0.15,
      );
      if (dx <= -threshold) goNext();
      else if (dx >= threshold) goPrev();
    }

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endGesture(true);
  };

  const handlePointerCancel = () => {
    endGesture(false);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  const trackSlides = loopEnabled
    ? [slides[count - 1], ...slides, slides[0]]
    : slides;
  const transitionDuration = dragging || noTransition ? 0 : Math.max(0, duration);

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('rcui-swiper', className)}
      style={{ height, ...style }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel ?? 'Carousel'}
    >
      <div
        ref={viewportRef}
        className="rcui-swiper__viewport"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={trackRef}
          className="rcui-swiper__track"
          style={{
            transform: `translate3d(calc(${-position * 100}% + ${dragOffset}px), 0, 0)`,
            transition:
              transitionDuration > 0
                ? `transform ${transitionDuration}ms var(--rcui-ease-out)`
                : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackSlides.map((slide, trackIndex) => {
            const clone = loopEnabled && (trackIndex === 0 || trackIndex === count + 1);
            const realIndex = loopEnabled
              ? (trackIndex - 1 + count) % count
              : trackIndex;
            return (
              <div
                key={`slide-${trackIndex}`}
                className={cx('rcui-swiper__slide', clone && 'rcui-swiper__slide--clone')}
                role="group"
                aria-roledescription="slide"
                aria-label={`${realIndex + 1} of ${count}`}
                aria-hidden={clone || undefined}
              >
                {slide}
              </div>
            );
          })}
        </div>
      </div>
      {showIndicators && count > 1 ? (
        <div className="rcui-swiper__indicators">
          {slides.map((_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
              type="button"
              className={cx(
                'rcui-swiper__indicator',
                dotIndex === safeValue && 'rcui-swiper__indicator--active',
              )}
              aria-label={`Go to slide ${dotIndex + 1}`}
              aria-current={dotIndex === safeValue ? 'true' : undefined}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});
