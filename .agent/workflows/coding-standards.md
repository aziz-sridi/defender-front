---
description: Coding standards enforcement — rules for writing frontend code in this project
---

# DEFENDR Frontend Coding Rules

Before writing ANY frontend code in this project, follow these rules:

## 1. Check CODING_STANDARDS.md

Read `CODING_STANDARDS.md` in the project root for the full reference.

## 2. Component Usage Rules

### Buttons

- **ALWAYS** use `<Button>` from `@/components/ui/Button` for any clickable action
- **NEVER** write raw `<button className="bg-defendrRed ...">` when `<Button variant="contained-red">` exists
- Exception: icon-only buttons (close, toggle) that don't match any Button variant

### Typography

- **ALWAYS** use `<Typo>` from `@/components/ui/Typo` for visible text (headings, labels, paragraphs, errors)
- **NEVER** write raw `<p className="text-[14px] font-bold">` when `<Typo fontVariant="p5b">` covers it
- Exception: inline text inside custom components (nav items, drawer links)

### Inputs

- **ALWAYS** use `<Input>` from `@/components/ui/Inputs` for form fields
- **NEVER** manually implement password show/hide toggle — `<Input type="password">` handles it automatically
- **NEVER** mix Tailwind border classes with inline `borderColor` style on the same element

## 3. Tailwind Usage Rules

- **USE** Tailwind for: layout (`flex`, `grid`, `gap`), spacing (`px`, `py`, `mt`), responsive (`xl:hidden`), positioning (`relative`, `absolute`)
- **USE** Tailwind for: custom one-off UI (navbars, drawers, cards, modals)
- **NEVER** use Tailwind for font-size when `<Typo>` exists
- **NEVER** use Tailwind for button styling when `<Button>` exists

## 4. Color Rules

- Brand colors: use Tailwind tokens (`bg-defendrRed`, `text-defendrWhite`)
- Dynamic colors from props: use inline styles ONLY (never mix with Tailwind color classes)
- Custom surfaces: use hex directly (`bg-[#1e1e1e]`, `bg-[#252525]`)

## 5. Anti-Pattern Checklist

Before submitting code, verify:

- [ ] No raw `<button>` where `<Button>` would work
- [ ] No raw `<input>` where `<Input>` would work
- [ ] No hardcoded font sizes where `<Typo>` covers it
- [ ] No manual password toggle (use `<Input type="password">`)
- [ ] No Tailwind color class + inline color style on the same element
- [ ] All brand colors use project tokens, not hardcoded hex
