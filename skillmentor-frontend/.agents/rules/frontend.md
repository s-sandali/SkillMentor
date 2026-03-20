# Frontend Architecture Rules

Whenever generating new frontend code for the SkillMentor application, you MUST adhere to the following architectural patterns and rules.

## 1. Folder Placement
- **Pages**: Full-page container components mapping to routes MUST go in `src/pages/`.
- **Components**: Generic, reusable presentational components MUST go in `src/components/`.
- **UI Primitives**: Native UI building blocks (e.g., buttons, dialogs) MUST go in `src/components/ui/` (using ShadCN UI).
- **API/Utils**: All API integrations, external system calls, and helper functions MUST go in `src/lib/`.

## 2. Component Design & Naming
- **Naming**: Use `PascalCase.tsx` format for React components and pages. Use lowercase/kebab-case for ShadCN UI elements and utility files (e.g., `button.tsx`).
- **Separation of Concerns**: Data fetching should happen on the Page container level or through specific data-hooks. Presentational components should accept standard props and avoid side-effects.
- **Typing**: Use strict TypeScript. Export shared entities and interfaces from `src/types.ts`.

## 3. Routing
- **Registration**: Routes must be registered in `src/App.tsx` directly inside the `@react-router` structure.
- **Protection**: Use Clerk's `<SignedIn>` and `<SignedOut>` wrappers for protected routes instead of custom higher-order components.

## 4. Styling Conventions
- **System**: Use purely utility-based styling with Tailwind CSS (v4). Do NOT create separate `.css` files per component.
- **Dynamic Classes**: Combine conditional classes cleanly using the `cn()` utility from `src/lib/utils.ts`.
- **Component Library**: Reuse existing ShadCN elements (`Button`, `Card`, `Dialog`) instead of building custom DOM equivalents. Use `lucide-react` for icons.

## 5. State Management
- **Auth State**: Read auth state explicitly and exclusively via `@clerk/clerk-react` hooks (`useAuth`, `useUser`).
- **Local State**: Rely on standard React `useState` and `useEffect`. Do NOT introduce global state libraries like Redux or Zustand unless explicitly requested.

## 6. API Integrations
- **Centralization**: Define all external API requests in `src/lib/api.ts`.
- **Mechanism**: Use the native `fetch` API. Do not use Axios or React Query.
- **Auth Tokens**: For authenticated requests, fetch securely via `getToken({ template: "skillmentor-auth" })` inside the component and pass the token string to the API method.
- **Lifecycle**: Handle fetching primarily inside `useEffect`. Handle loading and error states cleanly with fallback UIs before rendering content.

## 7. Accessibility Considerations
- ShadCN / Radix UI dialogs, popovers, and primitives must be used to ensure ARIA compliance.
- Fallback UIs must be rendered for empty data results (e.g. "No courses enrolled yet").
- Images must possess meaningful `alt` text.

## Enforcement
Before writing any code, confirm your plan adheres to the above architectural rules, ensuring that new implementations match the existing patterns entirely.
