# commerceClient.md

Frontend architecture reference for a **quick-commerce app** (Customer · Merchant · Admin · Driver),
derived from a post-mortem of the `honda_site/client` route system.

Part 1 documents how the Honda client actually works and where it breaks down.
Part 2 is the design the quick-commerce client should start from instead.

---

# Part 1 — How the Honda client's route system works

## 1.1 The shape

```
main.tsx
  Provider(store) → PersistGate → BrowserRouter → LanguageProvider → <App/>

App.tsx
  <Routes>
    immediateRoutes.map(createImmediateRoute)      // eager, no wrapper
    publicRoutes.map(createPublicRoute)            // lazy + <Header/>
    bareRoutes.map(createBareRoute)                // lazy, no chrome
    adminAuthRoutes.map(createAuthRoute)           // login pages
    adminRoutes.map(createAdminRoute)              // + 7 more role blocks
    ...
    createImmediateRoute("*", NotFoundPage)
  </Routes>
```

Three layers, cleanly separated — this part is genuinely good:

| Layer           | File                                   | Job                                                                                                                                                       |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Declaration** | `config/MainRouteConfigs/*.routes.tsx` | Flat `{ path, component }[]` arrays, one file per role. Components are `lazy()` except Home + 404.                                                        |
| **Composition** | `config/routeHelpers.tsx`              | ~13 `createXRoute()` factories. Each wraps a component in `<Suspense>` → `<RoleRouteWrapper>` → `<ProtectedRoute requiredRole>` + the role's `<Header/>`. |
| **Enforcement** | `config/ProtectedRoute.tsx`            | Reads `state.auth` + `state.customerAuth` from Redux, resolves a role, switches on `requiredRole`, renders children or `<Navigate/>`.                     |

**Scale today:** 753 lines of route config, 144 routes, 8 role namespaces
(`/admin`, `/manager`, `/service-admin`, `/part-admin`, `/staff`, `/developer`, `/customer`, public).

## 1.2 The one genuinely hard-won rule

Two auth systems run at once and **both can be authenticated simultaneously** — during customer
onboarding a Branch-Admin is logged in via JWT while the customer they just created is logged in
via Firebase. `ProtectedRoute` resolves `userType` admin-first:

```ts
const userType =
  authState?.isAuthenticated && authState?.user      ? "admin"
  : customerAuthState?.isAuthenticated && ...        ? "customer"
  : null;
```

Check customer first and the Branch-Admin gets silently downgraded mid-flow. **Keep this rule.**
Any multi-actor app (a Merchant impersonating a Customer, an Admin viewing a Driver's app) hits
the same trap.

---

## 1.3 The missing parts

### ❌ 1. A whole second authorization engine that nothing calls

`config/routeutils.ts` (390 lines) exports `ROUTES`, `canAccessRoute()`, `getDefaultRoute()`,
`safeNavigate()`. **Grep for callers across `src/`: zero.** It is entirely dead code.

That would merely be waste, except it _disagrees_ with the live engine:

| Question                                  | `routeutils.canAccessRoute` | `ProtectedRoute` (the real one)                                                |
| ----------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| Super-Admin opens `/manager/dashboard`?   | ✅ allowed                  | ❌ redirected — `requiredRole:'branch-admin'` → `hasRole("Branch-Admin")` only |
| Super-Admin opens `/staff/dashboard`?     | ✅ allowed                  | ❌ redirected                                                                  |
| Super-Admin opens `/developer/dashboard`? | ✅ allowed                  | ❌ redirected                                                                  |

Anyone who reads `routeutils.ts` to answer "who can see what?" gets the wrong answer.
There is also a latent bug in it: `isServiceAdminRoute = path.startsWith("/service")` — which
also swallows `/service-admin/*` and any future `/services` public page.

### ❌ 2. The same restricted-path list, copy-pasted, under opposite names

```
ProtectedRoute.tsx : BRANCH_ADMIN_ONLY_CUSTOMER_PATHS    = [8 paths]
routeutils.ts      : BRANCH_ADMIN_ALLOWED_CUSTOMER_PATHS = [same 8 paths]
```

Identical arrays, one named for what it _blocks_, one for what it _permits_. Add a 9th onboarding
step and you must remember both.

### ❌ 3. `requiredRole` grows combinatorially

```ts
type RequiredRole =
  | "admin"
  | "customer"
  | "admin-or-customer"
  | "super-admin-only"
  | "branch-admin"
  | "service-admin"
  | "part-admin"
  | "developer"
  | "staff"
  | "branch-admin-or-super-admin"
  | "service-admin-or-super-admin"
  | "part-admin-or-super-admin";
```

Every new "these two roles share this page" requirement adds a **string literal, a `case:` block,
a `ROLE_LOGIN_PATHS` entry, a wrapper component, and a `createXRoute` factory**. The union already
encodes `-or-super-admin` three times. It should be `allow: Role[]`.

### ❌ 4. No `<Outlet>` — the route tree is completely flat

Not one `<Outlet/>` in the codebase. Consequences:

- The role `<Header/>` is re-created inside every route element, so it **unmounts and remounts on
  every navigation** — header state (open menu, unread badge, search box) resets each time.
- No shared layout, so no persistent sidebar, no nested tab routes, no per-section error boundary.
- Every route pays the full `<Suspense>` → wrapper → guard chain independently.

A nested layout route would collapse `createAdminRoute` + `createBranchManagerRoute` +
`createServiceAdminRoute` + ... into one `<Route element={<RoleLayout/>}>`.

### ❌ 5. `ErrorBoundary` exists and is never mounted

`config/errorBoundary.tsx` is a complete, working boundary. Grep for usage: it is imported
**nowhere**. The only live boundary in the app is a bespoke one inside `BikeCard.tsx`.

So today: a render error, or — more likely — **a lazy chunk that 404s after a redeploy** (very
common on Vercel: the user has an old `index.html` pointing at hashed chunks that no longer exist)
throws past `<Suspense>`, past `<Routes>`, and white-screens the entire app.

### ❌ 6. Deep links are written but never restored

`ProtectedRoute` carefully does:

```ts
<Navigate to={loginPath} state={{ from: location.pathname }} replace />
```

No login component reads `location.state.from`. `LoginSuperAdmin.tsx` hardcodes
`navigate("/admin/dashboard")`. So a Driver who taps a push notification for order `#8814`, gets
bounced to login, signs in — and lands on the dashboard, not the order.

### ❌ 7. Login routes are unguarded in the other direction

`createAuthRoute` applies no wrapper at all. An already-authenticated Admin who hits `/admin/login`
(back button, bookmark, stale tab) gets the login form and can re-authenticate into a different
session on top of the current one. There is no `<PublicOnlyRoute>`.

### ❌ 8. Role strings are stringly-typed in five places

`ProtectedRoute.AdminRole` · `ProtectedRoute.ROLE_DASHBOARDS` · `routeutils.UserRole` ·
`routeHelpers.ROLE_HEADER` · `routeHelpers.RouteType` · `usePageTitle.PAGE_TITLES`.

Evidence of the drift: **`Developer`** is a full first-class role in the frontend
(`/developer/*`, `DeveloperHeader`, dashboard mapping) but appears nowhere in the documented
backend `ROLES` set. Nobody can tell from the code whether that is intentional.

### ❌ 9. Route metadata is a parallel, hand-maintained map

`usePageTitle` keeps a `Record<path, title>` covering maybe a third of the 144 routes; the rest get
no title. Nav labels, icons, and breadcrumbs are hand-written inside each `Header` component. The
route array knows the path; nothing else does.

### ❌ 10. Authorization is route-shaped only

There is no notion of a _capability_. You cannot express "this Branch-Admin may issue refunds but
not edit price", and a button's visibility has no relationship to what the server will actually
permit. Every screen re-derives permission from `user.role === "..."` inline.

### ❌ 11. Missing, smaller but real

- **No scroll restoration** — `App.tsx` does `window.scrollTo(0,0)` on every pathname change, which
  also destroys the position when going _back_ to a list.
- **No `<Suspense>` boundary above `<Routes>`**, so nothing catches a failed lazy import.
- **No route-level data loading** — every screen fetches in `useEffect`/RTK Query on mount, so each
  navigation shows a spinner even for data already in cache.
- **`PersistGate loading={null}`** renders nothing during IndexedDB rehydration → a blank frame
  before the guard can even read `auth`.
- **No analytics/telemetry hook** on navigation.

---

# Part 2 — The quick-commerce client

Four roles, four genuinely different apps sharing one codebase:

| Role         | Device reality                                   | Session                     | Defining constraint                                        |
| ------------ | ------------------------------------------------ | --------------------------- | ---------------------------------------------------------- |
| **Customer** | Mobile web / PWA, flaky 4G                       | Phone OTP, long-lived       | Speed to first add-to-cart; live order tracking            |
| **Merchant** | Tablet/desktop in a dark store, always-on        | Staff login, shift-scoped   | Never miss an incoming order; loud, interruptive UI        |
| **Driver**   | Mobile, one-handed, outdoors, glare, low battery | Phone OTP + shift state     | Huge tap targets; works offline; GPS + background location |
| **Admin**    | Desktop, dense dashboards                        | Email + password, short TTL | Cross-tenant data; audit trail; destructive actions        |

## 2.1 Route architecture — fix the 11 gaps

### One role registry, one source of truth

```ts
// src/auth/roles.ts
export const ROLES = ["customer", "merchant", "driver", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const CAPABILITIES = [
  "order:place",
  "order:cancel",
  "order:refund",
  "catalog:read",
  "catalog:write",
  "inventory:write",
  "delivery:accept",
  "delivery:complete",
  "store:manage",
  "user:manage",
  "payout:approve",
] as const;
export type Capability = (typeof CAPABILITIES)[number];

export const ROLE_CONFIG: Record<
  Role,
  {
    prefix: `/${string}`;
    loginPath: string;
    home: string;
    layout: React.ComponentType;
    defaultCapabilities: Capability[];
  }
> = {
  /* ... */
};
```

Everything else — guards, headers, redirects, titles, nav — derives from this. Adding a role is
**one entry plus one layout**, not six files.

### Capabilities, not role strings

The server returns the capability set with the session; the client only ever _mirrors_ it:

```tsx
const can = useCan();
{
  can("order:refund") && <RefundButton />;
}
```

Rule: **the UI never decides permission, it only reflects it.** A hidden button is a UX nicety;
the server is the authority. This also kills the `"x-or-super-admin"` union explosion — a shared
page declares `capability="order:refund"` and any role that has it gets in.

### Nested routes with `<Outlet>` — layouts mount once

```tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path='/' element={<Storefront />} />
    <Route path='/c/:categorySlug' element={<Category />} />
    <Route path='/p/:productSlug' element={<Product />} />
  </Route>

  <Route element={<PublicOnlyRoute />}>
    {" "}
    {/* gap #7 */}
    <Route path='/login' element={<CustomerLogin />} />
    <Route path='/merchant/login' element={<MerchantLogin />} />
  </Route>

  <Route element={<RequireAuth role='driver' />}>
    <Route element={<DriverLayout />}>
      {" "}
      {/* mounts ONCE */}
      <Route path='/driver' element={<ShiftHome />} />
      <Route path='/driver/order/:orderId' element={<ActiveDelivery />} />
    </Route>
  </Route>
</Routes>
```

The Driver's live-location socket, the Merchant's incoming-order sound, the Customer's cart drawer
all live in the layout and survive navigation. In the Honda client they could not.

### Deep-link restore, closing gap #6

```tsx
// RequireAuth
if (!authed)
  return <Navigate to={loginPath} state={{ from: location }} replace />;

// in every login screen
const from = (location.state as { from?: Location })?.from?.pathname;
navigate(from ?? ROLE_CONFIG[role].home, { replace: true });
```

Non-negotiable for a delivery app: **every push notification is a deep link.**
"Order #8814 is out for delivery" must survive a login bounce.

### Error boundaries per section — and mount them

```tsx
<RootErrorBoundary>
  {" "}
  {/* catches everything */}
  <Suspense fallback={<AppSkeleton />}>
    <Routes>… each layout wraps its Outlet in its own boundary …</Routes>
  </Suspense>
</RootErrorBoundary>
```

Handle the chunk-404-after-deploy case explicitly — if the error message matches
`/Failed to fetch dynamically imported module|ChunkLoadError/`, force one `location.reload()`.
This is the single most common white-screen in a Vite + Vercel app and Honda has no guard for it.

### Route metadata co-located with the route

```ts
{ path: "/driver/order/:orderId",
  component: ActiveDelivery,
  meta: { title: "Delivery", capability: "delivery:accept",
          nav: false, keepAlive: true, offline: "required" } }
```

One array feeds the router, the page title, the nav, breadcrumbs, and analytics. No parallel
`PAGE_TITLES` map that covers a third of the routes.

---

## 2.2 Frontend design-system checklist for quick commerce

Ordered by how expensive each is to retrofit.

### A. Tokens before components

Do not write a single component before the token layer exists. Honda's `lib/ui-tokens.ts` is the
right idea introduced _after_ the fact — which is why ad-hoc class strings still exist alongside it.

```
color      → semantic only: bg/fg/muted/border/primary/destructive/success/warning
              + domain: --status-placed / -packed / -picked / -transit / -delivered / -cancelled
spacing    → 4px base, 4-6 steps, nothing else
radius     → sm / md / lg / full
elevation  → 3 levels max
typography → 6 sizes, 3 weights; one display face, one text face
motion     → fast 120ms / base 200ms / slow 320ms + prefers-reduced-motion
z-index    → named scale (sticky cart 40, drawer 50, modal 60, toast 70) — never raw numbers
```

**Critical for quick commerce:** the order-status colors are a _domain_ token set, used identically
in the Customer tracker, the Merchant queue, the Driver task list, and the Admin dashboard. If they
live as inline Tailwind classes in four places, the four screens will disagree within a month.

### B. Dark mode + outdoor legibility from day one

Retrofitting dark mode is the single most expensive design-system mistake. Beyond that: the Driver
app is used **outdoors in direct sunlight**. Test the Driver surfaces at max brightness on real
glass. Minimum contrast 4.5:1 for text, **7:1 for anything the Driver must read while moving**.

### C. Mobile-first, thumb-first

- Base viewport 360×640. Design there, scale up.
- Touch targets ≥ 44×44pt; Driver actions ≥ 56pt.
- Primary actions in the **bottom third** — top-anchored CTAs are unreachable one-handed.
- Respect `env(safe-area-inset-bottom)` for the sticky cart and the Driver's slide-to-complete bar.
- Use `100dvh`, never `100vh` (mobile browser chrome).
- Destructive Driver actions ("Mark delivered", "Cancel") = **slide-to-confirm**, not a tap — the
  phone is in a pocket half the time.

### D. State-complete components

Every component ships with all seven states before it is "done":
`default · hover · focus-visible · active · disabled · loading · error` — plus, for lists:
`empty · partial · offline`.

The state everyone forgets in commerce is **stale**: the price/stock you're showing was fetched
40 seconds ago and may be wrong. Have a visual treatment for it.

### E. Skeletons, not spinners

Quick commerce lives or dies on perceived speed. A spinner says "nothing is happening"; a skeleton
that matches the final layout says "it's coming" and prevents layout shift (CLS). Budget:
**LCP < 2.5s on 4G mid-range Android**, not on your laptop.

### F. Optimistic UI with a defined rollback

Add-to-cart, quantity ±, Driver "picked up" must be **instant**. That means every mutation needs a
declared failure path:

```
optimistic apply → server confirms  → settle silently
                 → server rejects   → revert + toast + (if stock) reconcile the cart line
```

Decide the rollback story per mutation _before_ building it. RTK Query
`onQueryStarted` + `updateQueryData` is the right primitive.

### G. Real-time is a first-class layer, not a feature

Order status, Driver location, and stock counts all push. Build one socket/SSE abstraction that:

- lives in the **layout** (so it survives navigation — see the `<Outlet>` point),
- reconnects with backoff and resubscribes,
- writes into the RTK Query cache so components stay dumb,
- degrades to polling when the socket is dead.

### H. Offline & PWA — for Driver, non-negotiable

Basements, lifts, dead zones. Minimum:

- Precached app shell + installable PWA (Honda already does this in `src/sw.ts`).
- The **active delivery** route cached with its data; readable with zero network.
- A **mutation outbox**: "delivered" queued locally, flushed on reconnect, idempotency-keyed so a
  double-flush cannot double-complete an order.
- Persistent, honest offline banner. Never a silent failure.

### I. Money, time, and distance are formatted in exactly one place

`formatCurrency` (minor units — **never floats for money**), `formatEta`, `formatDistance`,
`formatAddress`. Multi-currency, multi-locale, and the RTL question decided on day one.
ETAs are the product's core promise — one formatter, one rounding rule, everywhere.

### J. Density modes

The same `<OrderCard>` renders in a Customer's history (comfortable), a Merchant's live queue
(compact, 20 on screen), and an Admin table (dense). Build it with a `density` prop, not three
components that drift apart.

### K. Notification / interruption design

Four roles, four urgency models:

- Merchant: **loud** — sound + persistent visual until acknowledged. A missed order is lost revenue.
- Driver: assignment offers with a visible countdown.
- Customer: status changes, quiet.
- Admin: digests, never interruptive.

Define a severity ladder (`info / success / warning / critical`) and map each surface to it.
One toast system, one inbox, one badge count.

### L. Accessibility as a build gate

Keyboard-reachable everything (the Merchant tablet gets a bluetooth keyboard), focus trapped in
modals and returned on close, `aria-live` for order-status changes, forms with real `<label>`s and
errors tied by `aria-describedby`, respect `prefers-reduced-motion`. Run axe in CI — it costs
nothing and catches most of it.

### M. Testing — the gap Honda never closed

The Honda repo has **no test runner in either package.** For the quick-commerce client, before the
codebase passes ~50 components:

```
Vitest + Testing Library     → components, guards, formatters, cart reducer
MSW                          → API contract, incl. failure & offline paths
Playwright                   → the 4 critical journeys, one per role
Storybook + chromatic        → visual regression on the token layer
axe                          → a11y gate in CI
```

Test the **guards** specifically. `RequireAuth` is the one piece of code where a bug is a security
incident, and in the Honda client it is untested and duplicated.

### N. Observability

Error tracking with source maps, Web Vitals by role (the Driver's device is not your laptop), a
navigation analytics hook fed from route `meta`, and a feature-flag client so a bad Merchant screen
can be switched off without a deploy.

---

## 2.3 Proposed structure

```
src/
  app/
    App.tsx                 # <Routes> only — no toast config, no side effects
    providers.tsx           # store · router · query · theme · i18n · realtime
    router/
      routes.customer.ts    # { path, component, meta } — meta drives title/nav/analytics
      routes.merchant.ts
      routes.driver.ts
      routes.admin.ts
      guards.tsx            # RequireAuth · RequireCapability · PublicOnlyRoute
  auth/
    roles.ts                # ROLES · CAPABILITIES · ROLE_CONFIG  ← single source of truth
    session.ts              # token lifecycle, refresh, multi-actor precedence
    useCan.ts
  design-system/
    tokens/                 # color · space · type · motion · z · status
    primitives/             # Button Input Sheet Dialog Toast Skeleton …
    patterns/               # OrderCard StatusPill PriceBlock AddressBlock EtaBadge
  features/
    cart/ catalog/ orders/ delivery/ inventory/ payouts/
  layouts/
    PublicLayout · CustomerLayout · MerchantLayout · DriverLayout · AdminLayout
  realtime/                 # socket client + RTK Query cache bridge
  offline/                  # outbox, sync, service worker registration
  lib/                      # formatters, api client, error mapping
```

Two rules that would have prevented most of Part 1:

1. **`auth/roles.ts` is the only file that knows role names.** If a role string appears anywhere
   else as a literal, that's the bug.
2. **A guard is enforced in exactly one component.** No second "helper" module that _describes_
   access without enforcing it — that is how `routeutils.ts` became 390 lines of confidently wrong
   documentation.

---

## 2.4 Things to carry over from Honda unchanged

- **Admin-session-wins precedence** when two actors are authenticated at once (§1.2). You will hit
  this with Merchant-impersonates-Customer and Admin-views-Driver.
- **`baseQueryWithAuthGuard`'s discipline**: log out on _proven_ session death (expired `exp`, or an
  explicit server `code: "SESSION_INVALID"`) — **never on any 401**. An authorization-shaped 401
  must not destroy a valid session. Match a machine-readable `code`, never a message string.
- **Lazy-load everything except the first paint.** Storefront eager; all four role apps lazy. A
  Customer must never download the Admin bundle.
- **One service worker** doing both PWA precaching and background push.
- **Persisted store with an explicit whitelist.** Persist `auth`, `cart`, `ui`. Never persist the
  API cache — stale prices and stale stock are worse than a loading state.
