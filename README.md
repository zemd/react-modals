# React Modals

> A lightweight React modal management library

[![npm version](https://img.shields.io/npm/v/@zemd/react-modals?color=%230000ff&labelColor=%23000)](https://www.npmjs.com/package/@zemd/react-modals)

This library gives you a simple way to manage modals in React. You define your modal components, register them with `createModal`, and open/close them from anywhere in your app — no context providers, no prop drilling. It uses `useSyncExternalStore` under the hood and works well with React 19 and Next.js.

Check out working examples in the [examples](./examples) folder, including a [Next.js 16 demo](./examples/next16).

## Features

- Simple `createModal` API — define once, use anywhere
- Built-in support for lazy-loaded modals via `React.lazy`
- Works with `useSyncExternalStore` — no extra providers needed
- Full TypeScript support with typed modal props
- SSR-friendly (renders nothing on the server)
- Lifecycle callbacks (`onOpen`, `onClose`)
- You can implement your own store for advanced use cases
- Minimal bundle size, **zero dependencies**

## Installation

```bash
npm install @zemd/react-modals
pnpm add @zemd/react-modals
yarn add @zemd/react-modals
```

## Quick Start

### 1. Add `ModalRoot` to your layout

Place `<ModalRoot />` somewhere near the root of your app. It renders active modals into a portal.

```tsx
import { ModalRoot } from "@zemd/react-modals";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ModalRoot />
      </body>
    </html>
  );
}
```

### 2. Create a modal component

Write a regular React component. Use `useModalContext` to get a `close` function.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useModalContext } from "@zemd/react-modals";

type Props = {
  title: string;
  message: string;
};

export const AlertModal: React.FC<Props> = ({ title, message }) => {
  const { close } = useModalContext();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} onCancel={close}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={close}>OK</button>
    </dialog>
  );
};
```

### 3. Register and use

```tsx
import { createModal } from "@zemd/react-modals";
import { AlertModal } from "./AlertModal";

const alertModal = createModal({
  component: AlertModal,
});

// Open from anywhere — no hooks, no context
alertModal.open({ title: "Hello!", message: "This is a modal." });

// Close the last opened instance
alertModal.close();
```

### Lazy loading

You can lazy-load modal components to keep your initial bundle small:

```tsx
import { createModal } from "@zemd/react-modals";

const confirmModal = createModal({
  lazy: () => import("./ConfirmModal").then((m) => ({ default: m.ConfirmModal })),
});

confirmModal.open({ message: "Are you sure?" });
```

## API Reference

### `createModal(options)`

Creates a modal controller with `open` and `close` methods.

**Options:**

- `component` — the React component to render as a modal
- `lazy` — a function returning a dynamic import (alternative to `component`)
- `onOpen` — callback fired when the modal opens
- `onClose` — callback fired when the modal closes
- `store` — custom store instance (optional)

**Returns:** `{ open, close }`

- `open(props?)` — opens the modal, returns a unique ID
- `close(id?)` — closes a specific modal by ID, or the last opened one

### `<ModalRoot />`

Renders all active modals into a portal. Place it once in your layout.

**Props:**

- `container` — custom DOM element or function returning one (defaults to `document.body`)
- `store` — custom store instance (optional)

### `useModalContext()`

A hook available inside modal components. Returns `{ entry, close }`.

- `entry` — the current modal entry (id, component, props)
- `close()` — closes this modal

### `useModals(options?)`

A hook that returns the current list of active modal entries. Uses `useSyncExternalStore`.

### `createStore(options?)`

Creates a standalone modal store. Useful when you need multiple independent modal stacks.

**Options:**

- `maxStackSize` — maximum number of modals allowed in the stack (default: `100`)

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## 💙 💛 Donate

[![Support Ukraine](https://img.shields.io/static/v1?color=blue&label=UNITED24&message=support+Ukraine)](https://u24.gov.ua/)
