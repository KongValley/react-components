import { isValidElement, useSyncExternalStore, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Icon } from '../../icons';
import type { IconName } from '../../icons';
import { canUseDOM, prefersReducedMotion } from '../../utils/dom';
import { cx } from '../../utils/cx';

export type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading';

export interface MessageConfig {
  content: ReactNode;
  type?: MessageType;
  /** Seconds before auto-dismissal. 0 keeps the message until destroyed. */
  duration?: number;
  key?: string | number;
  closable?: boolean;
  icon?: ReactNode;
  onClose?: () => void;
}

export interface MessageApi {
  open: (config: MessageConfig | ReactNode) => () => void;
  info: (content: ReactNode, duration?: number) => () => void;
  success: (content: ReactNode, duration?: number) => () => void;
  warning: (content: ReactNode, duration?: number) => () => void;
  error: (content: ReactNode, duration?: number) => () => void;
  loading: (content: ReactNode, duration?: number) => () => void;
  destroy: (key?: string | number) => void;
}

interface MessageItem extends MessageConfig {
  id: number;
  type: MessageType;
  duration: number;
  leaving: boolean;
}

const DEFAULT_DURATION = 3;
const REMOVE_DELAY = 180;

const ICONS: Record<MessageType, IconName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  loading: 'loading',
};

let items: MessageItem[] = [];
let seed = 0;
let host: HTMLElement | null = null;
let root: Root | null = null;
let teardownTimer: number | undefined;
const timers = new Map<number, number>();
const listeners = new Set<() => void>();

function emit() {
  for (const listener of Array.from(listeners)) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): MessageItem[] {
  return items;
}

function clearTimer(id: number) {
  const timer = timers.get(id);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    timers.delete(id);
  }
}

function scheduleDismiss(id: number, duration: number) {
  clearTimer(id);
  if (duration <= 0) return;
  const timer = window.setTimeout(() => removeItem(id, true), duration * 1000);
  timers.set(id, timer);
}

function scheduleTeardown() {
  window.clearTimeout(teardownTimer);
  teardownTimer = window.setTimeout(() => {
    if (items.length > 0 || !root) return;
    root.unmount();
    root = null;
    host?.remove();
    host = null;
  }, 400);
}

function removeItem(id: number, notifyClose: boolean) {
  const target = items.find((item) => item.id === id);
  if (!target || target.leaving) return;

  clearTimer(id);
  items = items.map((item) =>
    item.id === id ? { ...item, leaving: true } : item,
  );
  emit();

  window.setTimeout(() => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    items = items.filter((item) => item.id !== id);
    emit();
    if (notifyClose) current.onClose?.();
    if (items.length === 0) scheduleTeardown();
  }, prefersReducedMotion() ? 0 : REMOVE_DELAY);
}

function MessageItemView({ item }: { item: MessageItem }) {
  return (
    <div
      className={cx(
        'rcui-message',
        `rcui-message--${item.type}`,
        item.leaving && 'rcui-message--leaving',
      )}
      role="status"
    >
      <span className="rcui-message__icon">
        {item.icon ?? <Icon name={ICONS[item.type]} spin={item.type === 'loading'} size={16} />}
      </span>
      <span className="rcui-message__content">{item.content}</span>
      {item.closable ? (
        <button
          type="button"
          className="rcui-message__close"
          aria-label="Dismiss notification"
          onClick={() => removeItem(item.id, true)}
        >
          <Icon name="close" size={12} />
        </button>
      ) : null}
    </div>
  );
}

function MessageHost() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return (
    <div
      className="rcui-message-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {list.map((item) => (
        <MessageItemView key={item.id} item={item} />
      ))}
    </div>
  );
}

function ensureHost() {
  if (!canUseDOM) return false;
  window.clearTimeout(teardownTimer);
  if (!host) {
    host = document.createElement('div');
    host.className = 'rcui-message-host';
    document.body.appendChild(host);
    root = createRoot(host);
    root.render(<MessageHost />);
  }
  return true;
}

function normalize(input: MessageConfig | ReactNode): MessageConfig {
  if (
    typeof input === 'object' &&
    input !== null &&
    !isValidElement(input) &&
    'content' in (input as MessageConfig)
  ) {
    return input as MessageConfig;
  }
  return { content: input as ReactNode };
}

function open(input: MessageConfig | ReactNode): () => void {
  if (!ensureHost()) return () => {};

  const config = normalize(input);
  const type = config.type ?? 'info';
  const duration = config.duration ?? (type === 'loading' ? 0 : DEFAULT_DURATION);

  if (config.key !== undefined) {
    const existing = items.find((item) => item.key === config.key);
    if (existing) {
      clearTimer(existing.id);
      items = items.map((item) =>
        item.id === existing.id
          ? { ...item, ...config, type, duration, leaving: false }
          : item,
      );
      emit();
      scheduleDismiss(existing.id, duration);
      return () => removeItem(existing.id, true);
    }
  }

  seed += 1;
  const item: MessageItem = {
    ...config,
    id: seed,
    type,
    duration,
    leaving: false,
  };
  items = [...items, item];
  emit();
  scheduleDismiss(item.id, duration);
  return () => removeItem(item.id, true);
}

export const message: MessageApi = {
  open,
  info: (content, duration) => open({ content, type: 'info', duration }),
  success: (content, duration) => open({ content, type: 'success', duration }),
  warning: (content, duration) => open({ content, type: 'warning', duration }),
  error: (content, duration) => open({ content, type: 'error', duration }),
  loading: (content, duration) => open({ content, type: 'loading', duration }),
  destroy(key) {
    if (key === undefined) {
      for (const item of items) removeItem(item.id, true);
    } else {
      for (const item of items) {
        if (item.key === key) removeItem(item.id, true);
      }
    }
  },
};
