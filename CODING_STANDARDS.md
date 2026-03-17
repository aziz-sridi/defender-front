# DEFENDR.GG — Frontend Coding Standards

> **Last updated:** February 2026
> **Applies to:** All frontend code in `defendr-front-new`

---

## 1. Architecture: Components + Tailwind

This project uses **two styling systems that work together**:

| System                                        | Role                                    | Examples                        |
| --------------------------------------------- | --------------------------------------- | ------------------------------- |
| **Project Components** (`src/components/ui/`) | Design tokens — what things look like   | `<Button>`, `<Input>`, `<Typo>` |
| **Tailwind CSS**                              | Layout engine — how things are arranged | `flex`, `gap-4`, `px-5`, `grid` |

They are NOT competing. Components are **built on top of** Tailwind. Use the right one for the right job.

---

## 2. When to Use What

### ✅ USE PROJECT COMPONENTS for:

#### Buttons → `<Button />`

```tsx
import Button from '@/components/ui/Button'

// ✅ Correct
<Button variant="contained-red" label="Submit" type="submit" />
<Button variant="outlined-red" label="Cancel" />
<Button variant="contained-dark" label="Save" disabled={isPending} />

// ❌ Wrong — there's a Button component for this
<button className="bg-defendrRed text-white rounded-xl px-4 py-3">Submit</button>
```

**Available variants:** `contained-red`, `contained-blue`, `contained-black`, `contained-green`, `contained-dark`, `contained-all-white`, `outlined-red`, `outlined-yellow`, `outlined-grey`, `text`, `text-red`, `black`, `contained-gray`

**Available sizes:** `xxxs`, `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`

---

#### Text → `<Typo />`

```tsx
import Typo from '@/components/ui/Typo'

// ✅ Correct
<Typo as="h1" fontVariant="h3" color="white" fontFamily="poppins">Page Title</Typo>
<Typo as="p" fontVariant="p4" color="grey">Description text</Typo>
<Typo as="label" fontVariant="p5b" color="white">Form Label</Typo>
<Typo as="span" fontVariant="p6" color="customRed600">Error message</Typo>

// ❌ Wrong — use Typo for consistent font sizes
<h1 className="text-4xl font-bold text-white">Page Title</h1>
<p className="text-sm text-gray-400">Description</p>
```

**Font variants (sizes):**
| Variant | Size | Weight |
|---------|------|--------|
| `h1` | 45px | semibold |
| `h2` | 42px | semibold |
| `h3` | 36px | semibold |
| `h4` | 28px | semibold |
| `h5` | 24px | semibold |
| `p1` / `p1b` | 22px | normal / bold |
| `p2` / `p2b` | 20px | normal / bold |
| `p3` / `p3b` | 18px | normal / bold |
| `p4` / `p4b` | 16px | normal / bold |
| `p5` / `p5b` | 14px | normal / bold |
| `p6` | 10px | normal |

**Colors:** `white`, `red`, `black`, `grey`, `ghostGrey`, `darkGrey`, `customRed600`, `yellow`, `custom868484`

---

#### Inputs → `<Input />`

```tsx
import Input from '@/components/ui/Inputs'

// ✅ Correct — plain text input
<Input
  size="s"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={setEmail}
  backgroundColor="#252525"
  borderColor="rgba(255,255,255,0.08)"
/>

// ✅ Correct — password input (eye toggle is built-in)
<Input
  size="s"
  type="password"
  placeholder="••••••••"
  value={password}
  onChange={setPassword}
  backgroundColor="#252525"
/>

// ✅ Correct — input with search icon
<Input
  size="xs"
  icon={<Search />}
  iconOrientation="left"
  placeholder="Search..."
  value={query}
  onChange={setQuery}
/>

// ❌ Wrong — hardcoding password toggle manually
<input type={show ? 'text' : 'password'} />
<button onClick={() => setShow(!show)}><Eye /></button>
```

**Available sizes:** `xxs` (35px), `xs` (40px), `s` (45px), `m` (50px), `l` (55px), `xl` (60px), `xxl` (65px)

**Password:** Just pass `type="password"` — the eye toggle is automatic.

---

### ✅ USE RAW TAILWIND for:

#### Layout

```tsx
// ✅ Correct — layout is Tailwind's job
<div className="flex items-center justify-between gap-4 px-5 py-3">
<div className="grid grid-cols-2 gap-6">
<section className="max-w-sm mx-auto">
```

#### Custom/One-off Components

```tsx
// ✅ Correct — navbar, drawer, card layouts are custom
<nav className="w-full flex justify-between items-center bg-[#161616] px-4 py-3">
<div className="fixed inset-y-0 right-0 w-[85%] bg-[#181818] shadow-2xl">
```

#### Responsive Design

```tsx
// ✅ Correct — breakpoints are Tailwind's strength
<div className="hidden xl:flex">       {/* desktop only */}
<div className="xl:hidden">            {/* mobile only */}
<h1 className="text-2xl lg:text-4xl">  {/* responsive text */}
```

---

## 3. Rules — NEVER Do This

### ❌ Rule 1: Never mix Tailwind color classes with inline color styles

```tsx
// ❌ BROKEN — Tailwind border-white/10 fights inline borderColor
<div className="border border-white/10" style={{ borderColor: '#ef4444' }}>

// ✅ CORRECT — use ONE system for colors
// Option A: Tailwind only
<div className="border border-red-500">
// Option B: Inline only
<div style={{ border: '1px solid #ef4444' }}>
```

### ❌ Rule 2: Never use raw `<button>` when `<Button>` handles it

```tsx
// ❌ Wrong
<button className="bg-defendrRed text-white rounded-xl py-3 px-6">Submit</button>

// ✅ Correct
<Button variant="contained-red" label="Submit" type="submit" />
```

### ❌ Rule 3: Never hardcode font sizes when `<Typo>` exists

```tsx
// ❌ Wrong
<p className="text-[14px] font-bold text-white font-poppins">Label</p>

// ✅ Correct
<Typo as="p" fontVariant="p5b" color="white" fontFamily="poppins">Label</Typo>
```

### ❌ Rule 4: Never re-implement password toggle manually

```tsx
// ❌ Wrong — duplicating logic that exists in Input
const [showPassword, setShowPassword] = useState(false)
<input type={showPassword ? 'text' : 'password'} />
<button onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye /> : <EyeSlash />}</button>

// ✅ Correct — Input handles it internally
<Input type="password" value={password} onChange={setPassword} />
```

---

## 4. Icons

All icons live in `src/components/ui/Icons/`. They are custom SVG components using `stroke="currentColor"` — they inherit the parent's text color.

```tsx
import Home from '@/components/ui/Icons/Home'
import TrophyMini from '@/components/ui/Icons/TrophyMini'

// Icons inherit color from parent
;<span className="text-gray-400 hover:text-white">
  <Home /> {/* turns gray, then white on hover */}
</span>
```

---

## 5. Color Tokens

Always use the project's CSS variables for brand colors:

| Token       | Value     | Tailwind Class                     |
| ----------- | --------- | ---------------------------------- |
| DEFENDR Red | `#d62555` | `bg-defendrRed`, `text-defendrRed` |
| Background  | `#161616` | `bg-defendrBg`                     |
| Black       | `#0e0e0e` | `bg-defendrBlack`                  |
| Light Black | `#212529` | `bg-defendrLightBlack`             |
| Grey        | `#343a40` | `bg-defendrGrey`                   |
| Light Grey  | `#8692aa` | `text-defendrLightGrey`            |
| Ghost Grey  | `#b0b8c9` | `text-defendrGhostGrey`            |
| White       | `#fafafa` | `text-defendrWhite`                |
| Green       | `#45a245` | `bg-defendrGreen`                  |

For custom/dark UI surfaces, use hex values directly:

- Card backgrounds: `bg-[#1e1e1e]` or `bg-[#252525]`
- Subtle borders: `border-white/[0.08]`
- Dropdown backgrounds: `bg-[#181818]`

---

## 6. File Structure

```
src/components/
├── ui/                     ← Reusable design system atoms
│   ├── Button/             ← <Button variant="..." />
│   ├── Inputs/             ← <Input type="..." />
│   ├── Typo/               ← <Typo fontVariant="..." />
│   ├── Icons/              ← SVG icon components
│   └── ...                 ← Other atoms (Tag, Tabs, etc.)
│
├── home/                   ← Page-specific components
│   ├── header/             ← Logged-out navbar
│   ├── Navbar/             ← Logged-in navbar
│   ├── DropHeader/         ← Mobile drawer (logged-out)
│   ├── Footer/             ← Footer
│   └── loginSignupForms/   ← Auth forms
│
├── tournament/             ← Tournament page components
├── organizations/          ← Organization page components
└── user/                   ← User profile components
```

---

## 7. Quick Reference — Choosing the Right Approach

| I need to...                   | Use                                       |
| ------------------------------ | ----------------------------------------- |
| Add a button                   | `<Button variant="..." />`                |
| Show text with consistent size | `<Typo fontVariant="..." />`              |
| Create a form field            | `<Input size="..." />`                    |
| Build a layout                 | Tailwind (`flex`, `grid`, `gap`)          |
| Make a navbar/drawer/card      | Tailwind (custom component)               |
| Add an icon                    | `import X from '@/components/ui/Icons/X'` |
| Set brand colors               | Tailwind tokens (`bg-defendrRed`)         |
| Add responsive behavior        | Tailwind breakpoints (`xl:hidden`)        |
