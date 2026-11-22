import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons';
import { cx } from '../../utils/cx';

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => void | Promise<unknown>;
  /** Controlled refreshing state. Without it the component manages its own. */
  refreshing?: boolean;
  disabled?: boolean;
  /** Pull distance required to trigger a refresh. */
  threshold?: number;
  maxDistance?: number;
  /** Minimum time the loading state stays visible, in milliseconds. */
  minimumSpinTime?: number;
  pullText?: ReactNode;
  releaseText?: ReactNode;
  loadingText?: ReactNode;
  children?: ReactNode;
}

const DEFAULT_THRESHOLD = 56;
const DEFAULT_MAX_DISTANCE = 96;
const RESISTANCE = 0.55;

function isAtScrollTop(node: HTMLElement | null): boolean {
  let element: HTMLElement | null = node;
  while (element) {
    const style = window.getComputedStyle(element);
    if (
      (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return element.scrollTop <= 0;
    }
    element = element.parentElement;
  }
  const scrollTop =
    window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  return scrollTop <= 0;
}

function findTouch(touches: TouchList, identifier: number): Touch | null {
  for (let index = 0; index < touches.length; index += 1) {
    if (touches[index].identifier === identifier) return touches[index];
  }
  return null;
}

/**
 * Wraps scrollable content and triggers a refresh when the user pulls down
 * while the nearest scroll container is already at the top.
 */
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  function PullToRefresh(
    {
      onRefresh,
      refreshing,
      disabled = false,
      threshold = DEFAULT_THRESHOLD,
      maxDistance = DEFAULT_MAX_DISTANCE,
      minimumSpinTime = 500,
      pullText = 'Pull to refresh',
      releaseText = 'Release to refresh',
      loadingText = 'Refreshing…',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [innerRefreshing, setInnerRefreshing] = useState(false);
    const effectiveRefreshing = refreshing ?? innerRefreshing;
    const refreshingRef = useRef(effectiveRefreshing);
    const [distance, setDistance] = useState(0);
    const distanceRef = useRef(0);
    const [dragging, setDragging] = useState(false);
    const draggingRef = useRef(false);
    const trackingRef = useRef(false);
    const pullingRef = useRef(false);
    const startYRef = useRef(0);
    const touchIdRef = useRef(0);

    const configRef = useRef({
      threshold,
      maxDistance,
      minimumSpinTime,
      onRefresh,
      refreshing,
    });
    configRef.current = {
      threshold,
      maxDistance,
      minimumSpinTime,
      onRefresh,
      refreshing,
    };

    const setPullDistance = (next: number) => {
      distanceRef.current = next;
      setDistance(next);
    };

    const resetPull = () => {
      trackingRef.current = false;
      pullingRef.current = false;
      draggingRef.current = false;
      setDragging(false);
      setPullDistance(0);
    };

    const runRefresh = async () => {
      const config = configRef.current;
      if (!config.onRefresh || refreshingRef.current) {
        resetPull();
        return;
      }

      refreshingRef.current = true;
      draggingRef.current = false;
      setDragging(false);
      setPullDistance(config.threshold);
      setInnerRefreshing(true);

      const startedAt = Date.now();
      try {
        await config.onRefresh();
      } catch {
        // A rejected refresh still ends the loading state.
      } finally {
        const remaining = config.minimumSpinTime - (Date.now() - startedAt);
        if (remaining > 0) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, remaining);
          });
        }
        setInnerRefreshing(false);
        refreshingRef.current = configRef.current.refreshing ?? false;
      }
    };
    const runRefreshRef = useRef(runRefresh);
    runRefreshRef.current = runRefresh;

    useEffect(() => {
      refreshingRef.current = effectiveRefreshing;
      if (effectiveRefreshing) {
        draggingRef.current = false;
        setDragging(false);
        setPullDistance(threshold);
      } else if (distanceRef.current > 0) {
        setPullDistance(0);
      }
      // `setPullDistance` only touches refs and state setters.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [effectiveRefreshing, threshold]);

    useEffect(() => {
      const node = rootRef.current;
      if (!node || disabled) return;

      const handleStart = (event: TouchEvent) => {
        if (refreshingRef.current || event.touches.length !== 1) return;
        if (!isAtScrollTop(node)) return;
        trackingRef.current = true;
        pullingRef.current = false;
        startYRef.current = event.touches[0].clientY;
        touchIdRef.current = event.touches[0].identifier;
      };

      const handleMove = (event: TouchEvent) => {
        if (!trackingRef.current) return;
        const touch =
          findTouch(event.touches, touchIdRef.current) ?? event.touches[0];
        if (!touch) return;
        const dy = touch.clientY - startYRef.current;

        if (dy <= 0) {
          if (pullingRef.current) resetPull();
          return;
        }
        if (!pullingRef.current && dy < 5) return;

        pullingRef.current = true;
        if (event.cancelable) event.preventDefault();
        if (!draggingRef.current) {
          draggingRef.current = true;
          setDragging(true);
        }
        setPullDistance(
          Math.min(configRef.current.maxDistance, dy * RESISTANCE),
        );
      };

      const handleEnd = () => {
        if (!trackingRef.current) return;
        const wasPulling = pullingRef.current;
        trackingRef.current = false;
        draggingRef.current = false;
        setDragging(false);
        pullingRef.current = false;

        if (!wasPulling) return;
        if (
          distanceRef.current >= configRef.current.threshold &&
          !refreshingRef.current
        ) {
          void runRefreshRef.current();
        } else {
          setPullDistance(0);
        }
      };

      const handleCancel = () => {
        if (!trackingRef.current && !pullingRef.current) return;
        resetPull();
      };

      node.addEventListener('touchstart', handleStart, { passive: true });
      node.addEventListener('touchmove', handleMove, { passive: false });
      node.addEventListener('touchend', handleEnd);
      node.addEventListener('touchcancel', handleCancel);
      return () => {
        node.removeEventListener('touchstart', handleStart);
        node.removeEventListener('touchmove', handleMove);
        node.removeEventListener('touchend', handleEnd);
        node.removeEventListener('touchcancel', handleCancel);
      };
      // Config values are read through refs so the listeners stay stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    useEffect(() => {
      if (!disabled) return;
      resetPull();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const ready = distance >= threshold && !effectiveRefreshing;
    const progress = Math.min(1, distance / Math.max(1, threshold));
    const statusText = effectiveRefreshing
      ? loadingText
      : ready
        ? releaseText
        : pullText;

    return (
      <div
        {...rest}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cx(
          'rc-pull-refresh',
          effectiveRefreshing && 'rc-pull-refresh--refreshing',
          disabled && 'rc-pull-refresh--disabled',
          className,
        )}
      >
        <div
          className="rc-pull-refresh__head"
          style={{
            height: distance,
            transition: dragging ? 'none' : undefined,
          }}
          role="status"
          aria-live="polite"
        >
          <div className="rc-pull-refresh__indicator">
            <span
              className="rc-pull-refresh__spinner"
              style={
                effectiveRefreshing
                  ? undefined
                  : { transform: `rotate(${progress * 180}deg)` }
              }
            >
              <Icon
                name={effectiveRefreshing ? 'loading' : 'arrow-down'}
                size={18}
                spin={effectiveRefreshing}
              />
            </span>
            <span className="rc-pull-refresh__text">{statusText}</span>
          </div>
        </div>
        <div
          className="rc-pull-refresh__content"
          style={{
            transform: `translate3d(0, ${distance}px, 0)`,
            transition: dragging ? 'none' : undefined,
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
