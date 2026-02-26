---
trigger: always_on
---

---

## description: Project structure and import conventions based on bulletproof-react. Follow these rules when creating new files, features, or components.

# Project Structure Rules

## Directory Layout

```
src/
├── features/          ← Feature modules (domain logic)
│   └── <feature>/
│       ├── index.ts           ← barrel export
│       ├── containers/        ← page-level content
│       │   ├── index.ts
│       │   └── <container>/
│       ├── components/        ← presentational UI
│       │   └── <component>/
│       ├── hooks/             ← custom hooks
│       │   └── index.ts
│       └── types/
├── components/        ← Shared UI components
│   └── ui/            ← Shared UI (shadcn)
├── configs/           ← Configuration, constants, and enums
├── hooks/             ← Shared custom hooks
├── lib/               ← Shared utilities and helper functions
└── types/             ← Shared global types
app/
├── api/               ← Next.js API routes
└── <route>/page.tsx   ← Thin wrappers (composition only)
```

## Rules

### 1. Feature modules are self-contained

Each feature folder (`src/features/<name>/`) owns its own `containers/`, `components/`, `hooks/`, and `types/`. Only add subfolders that the feature actually needs.

### 2. Barrel Exports (`index.ts`)

**Every folder** must have an `index.ts` barrel file that exports its contents. This means:

- Feature root (`features/<name>/index.ts`)
- Component/Container root (`containers/index.ts`, `components/index.ts`, `hooks/index.ts`)
- Individual item folders (`components/<name>/index.ts`)

This ensures clean imports everywhere.

### 3. Pages are thin composition layers

`page.tsx` files should be thin wrappers that **only** import a container from a feature module and render it. No business logic, no hooks, no styling in `page.tsx`.

### 4. Import conventions

| From → To         | Convention                                                 | Example                                                          |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Shared → anywhere | `@/lib/...`, `@/configs/...`, `@/types/...`, `@/hooks/...` | `import { formatVND } from "@/lib/prices"`                       |
| Feature internal  | Relative `./` or `../`                                     | `import { PriceEditRow } from "../../components/price-edit-row"` |
| Page → Feature    | `@/features/<feature>`                                     | `import { PriceBoardPage } from "@/features/price-board"`        |
| Feature → Feature | ❌ **Forbidden**                                           | Compose at page/container level instead                          |
| Shared UI         | `@/components/ui/...`                                      | `import { Button } from "@/components/ui/button"`                |

### 5. Unidirectional flow

```
shared (lib/, components/) → features/ → pages
```

Shared code must NOT import from features or pages. Features must NOT import from other features.

### 6. File naming

- All files/folders: **kebab-case**
- Hooks: prefix with `use-` (`use-clock.ts`)
- Components: named export matching PascalCase with `.component.tsx` suffix (`export function PriceEditRow`)
- Containers: named export matching PascalCase with `.container.tsx` suffix (`export function PriceBoardPage`)

### 7. Component/Container folder convention

Components and containers with styles **must** be wrapped in a folder:

```
<name>/
├── <name>.component.tsx   ← (or .container.tsx)
├── styles.module.css      ← scoped styles
└── index.ts               ← re-export
```

### 8. Styling conventions

- **No inline `style={{}}` props** — only exception: truly dynamic values (e.g. computed `animationDelay`)
- Use **Tailwind classes** for layout, spacing, typography
- Use **CSS Modules** (`styles.module.css`) for custom styles (gradients, shadows, borders, specific responsive changes)
- Shared global styles (animations, tokens) stay in `globals.css` -> **No component-specific styles in globals.css**

### 9. Adding a new feature

1. Create `src/features/<feature-name>/`
2. Add `containers/`, `components/`, `hooks/`, `index.ts` as needed
3. Follow the folder convention (Rule 7) for styled components/containers
4. Implement all feature logic inside the feature module
5. Export the main container(s) via the feature's root `index.ts`
6. Wrap the container in a thin `app/<route>/page.tsx` file
