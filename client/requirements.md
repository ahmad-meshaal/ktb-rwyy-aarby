## Packages
@tiptap/react | Rich text editor for writing chapters
@tiptap/starter-kit | Base extensions for Tiptap
@tiptap/extension-placeholder | Placeholder text for editor
framer-motion | Smooth animations for page transitions and UI elements
lucide-react | Beautiful icons
react-hook-form | Form handling
zod | Schema validation
@hookform/resolvers | Zod resolver for react-hook-form
clsx | Class name utility
tailwind-merge | Tailwind class merging
dnd-kit-sortable | Drag and drop for chapter reordering (optional, but requested)
@dnd-kit/core | Core DnD
@dnd-kit/sortable | Sortable DnD
html2pdf.js | For exporting novel to PDF

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  serif: ["Amiri", "serif"],
  sans: ["Noto Sans Arabic", "sans-serif"],
}
RTL Direction: Ensure 'dir="rtl"' is set on the html or body tag in index.html or via useEffect in App.
