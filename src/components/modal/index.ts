import { Modal as ModalRoot } from './Modal';
import { confirm } from './confirm';

export type { ModalProps } from './Modal';
export type { ConfirmOptions, ConfirmInstance, ConfirmType } from './confirm';

export const Modal = Object.assign(ModalRoot, { confirm }) as typeof ModalRoot & {
  confirm: typeof confirm;
};
