import { lazy, type LazyExoticComponent } from "react";
import type { Store, UUID } from "./types";
import { store as defaultStore } from "./store";

export type ModalController<ArgProps extends object = Record<string, never>> = [
  keyof ArgProps,
] extends [never]
  ? { readonly open: () => UUID; readonly close: (id?: UUID) => void }
  : {
      readonly open: (props: ArgProps) => UUID;
      readonly close: (id?: UUID) => void;
    };

type CreateModalOptions<ArgProps extends object> = (
  | { lazy: () => Promise<{ default: React.ComponentType<ArgProps> }> }
  | { component: React.ComponentType<ArgProps> }
) & {
  onOpen?: (props: Record<string, unknown>) => void;
  onClose?: (props: Record<string, unknown>) => void;
  store?: Store;
};

export const createModal = <ArgProps extends object = Record<string, never>>(
  options: CreateModalOptions<ArgProps>,
): ModalController<ArgProps> => {
  const store = options.store ?? defaultStore;
  type ComponentType = React.ComponentType<ArgProps>;
  const Component: ComponentType | LazyExoticComponent<ComponentType> =
    "lazy" in options ? lazy(options.lazy) : options.component;

  let lastOpenedId: UUID | undefined;
  const openModal = (
    ...args: [keyof ArgProps] extends [never] ? [] : [props: ArgProps]
  ) => {
    const resolvedProps = (args.length > 0 ? args[0] : {}) as ArgProps;
    lastOpenedId = store.append({
      component: Component as React.ComponentType<Record<string, unknown>>,
      props: resolvedProps as Record<string, unknown>,
      callbacks: {
        onOpen: options.onOpen,
        onClose: options.onClose,
      },
    });
    return lastOpenedId;
  };

  const closeModal = (id?: UUID) => {
    if (id === undefined) {
      if (lastOpenedId === undefined) {
        console.warn("No modal is currently open.");
        return;
      }
      store.remove(lastOpenedId);
      return;
    }
    store.remove(id);
  };

  return Object.freeze({
    open: openModal,
    close: closeModal,
  }) as ModalController<ArgProps>;
};
