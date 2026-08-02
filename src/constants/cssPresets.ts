/**
 * Preset CSS themes for the "Custom app style" textarea.
 *
 * Adding a new preset: append an object to the array below.
 * Fields:
 *   id     — unique identifier, used as React key
 *   label  — short chip label shown in the UI (keep it compact)
 *   css    — the complete CSS to insert into the textarea
 */

export interface CssPreset {
  id: string;
  label: string;
  css: string;
}

export const CSS_PRESETS: CssPreset[] = [
  {
    id: "tyrian",
    label: "Tyrian Purple (#66023C)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #d6006e !important; --text-secondary: #d6006e !important; --text-tertiary: #d6006e !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #d6006e !important;
}
* { color: #d6006e !important; text-shadow: 0 0 2px rgba(214,0,110,0.6), 0 0 6px rgba(214,0,110,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(214,0,110,0.35) !important; box-shadow: 0 0 12px rgba(214,0,110,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #d6006e !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(214,0,110,0.12) !important; border: 1px solid #d6006e !important; box-shadow: 0 0 14px rgba(214,0,110,0.6) !important; }
input, textarea, select { background: #000 !important; color: #d6006e !important; border: 1px solid rgba(214,0,110,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(214,0,110,0.4); box-shadow: 0 0 6px rgba(214,0,110,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #d6006e !important; }
[role="switch"] { background: #000 !important; border: 1px solid #d6006e !important; }
[role="switch"][aria-checked="true"] { background: #4d0027 !important; box-shadow: 0 0 8px rgba(214,0,110,0.6) !important; }
[role="switch"] > * { background: #d6006e !important; box-shadow: 0 0 6px rgba(214,0,110,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #4d0027 !important; color: #d6006e !important; box-shadow: inset 0 0 8px rgba(214,0,110,0.4) !important; border-left: 3px solid #d6006e !important;
}`,
  },
  {
    id: "yinmn",
    label: "YInMn Blue (#2E5090)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #4d7ac7 !important; --text-secondary: #4d7ac7 !important; --text-tertiary: #4d7ac7 !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #4d7ac7 !important;
}
* { color: #4d7ac7 !important; text-shadow: 0 0 2px rgba(77,122,199,0.6), 0 0 6px rgba(77,122,199,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(77,122,199,0.35) !important; box-shadow: 0 0 12px rgba(77,122,199,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #4d7ac7 !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(77,122,199,0.12) !important; border: 1px solid #4d7ac7 !important; box-shadow: 0 0 14px rgba(77,122,199,0.6) !important; }
input, textarea, select { background: #000 !important; color: #4d7ac7 !important; border: 1px solid rgba(77,122,199,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(77,122,199,0.4); box-shadow: 0 0 6px rgba(77,122,199,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #4d7ac7 !important; }
[role="switch"] { background: #000 !important; border: 1px solid #4d7ac7 !important; }
[role="switch"][aria-checked="true"] { background: #14203d !important; box-shadow: 0 0 8px rgba(77,122,199,0.6) !important; }
[role="switch"] > * { background: #4d7ac7 !important; box-shadow: 0 0 6px rgba(77,122,199,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #14203d !important; color: #4d7ac7 !important; box-shadow: inset 0 0 8px rgba(77,122,199,0.4) !important; border-left: 3px solid #4d7ac7 !important;
}`,
  },
  {
    id: "ultramarine",
    label: "Ultramarine (#120A8F)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #3c2fd6 !important; --text-secondary: #3c2fd6 !important; --text-tertiary: #3c2fd6 !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #3c2fd6 !important;
}
* { color: #3c2fd6 !important; text-shadow: 0 0 2px rgba(60,47,214,0.6), 0 0 6px rgba(60,47,214,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(60,47,214,0.35) !important; box-shadow: 0 0 12px rgba(60,47,214,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #3c2fd6 !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(60,47,214,0.12) !important; border: 1px solid #3c2fd6 !important; box-shadow: 0 0 14px rgba(60,47,214,0.6) !important; }
input, textarea, select { background: #000 !important; color: #3c2fd6 !important; border: 1px solid rgba(60,47,214,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(60,47,214,0.4); box-shadow: 0 0 6px rgba(60,47,214,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #3c2fd6 !important; }
[role="switch"] { background: #000 !important; border: 1px solid #3c2fd6 !important; }
[role="switch"][aria-checked="true"] { background: #150f3d !important; box-shadow: 0 0 8px rgba(60,47,214,0.6) !important; }
[role="switch"] > * { background: #3c2fd6 !important; box-shadow: 0 0 6px rgba(60,47,214,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #150f3d !important; color: #3c2fd6 !important; box-shadow: inset 0 0 8px rgba(60,47,214,0.4) !important; border-left: 3px solid #3c2fd6 !important;
}`,
  },
  {
    id: "vantablack",
    label: "Vantablack accent (#e0e0e0)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #e8e8e8 !important; --text-secondary: #e8e8e8 !important; --text-tertiary: #e8e8e8 !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #e8e8e8 !important;
}
* { color: #e8e8e8 !important; text-shadow: 0 0 2px rgba(232,232,232,0.5), 0 0 6px rgba(232,232,232,0.2); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(232,232,232,0.25) !important; box-shadow: 0 0 12px rgba(232,232,232,0.1) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #e8e8e8 !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(232,232,232,0.1) !important; border: 1px solid #e8e8e8 !important; box-shadow: 0 0 14px rgba(232,232,232,0.5) !important; }
input, textarea, select { background: #000 !important; color: #e8e8e8 !important; border: 1px solid rgba(232,232,232,0.3) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(232,232,232,0.3); box-shadow: 0 0 6px rgba(232,232,232,0.5); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #e8e8e8 !important; }
[role="switch"] { background: #000 !important; border: 1px solid #e8e8e8 !important; }
[role="switch"][aria-checked="true"] { background: #2b2b2b !important; box-shadow: 0 0 8px rgba(232,232,232,0.5) !important; }
[role="switch"] > * { background: #e8e8e8 !important; box-shadow: 0 0 6px rgba(232,232,232,0.7) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #2b2b2b !important; color: #e8e8e8 !important; box-shadow: inset 0 0 8px rgba(232,232,232,0.3) !important; border-left: 3px solid #e8e8e8 !important;
}`,
  },
  {
    id: "mummybrown",
    label: "Mummy Brown (#7C5A3D)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #a67c52 !important; --text-secondary: #a67c52 !important; --text-tertiary: #a67c52 !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #a67c52 !important;
}
* { color: #a67c52 !important; text-shadow: 0 0 2px rgba(166,124,82,0.6), 0 0 6px rgba(166,124,82,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(166,124,82,0.35) !important; box-shadow: 0 0 12px rgba(166,124,82,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #a67c52 !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(166,124,82,0.12) !important; border: 1px solid #a67c52 !important; box-shadow: 0 0 14px rgba(166,124,82,0.6) !important; }
input, textarea, select { background: #000 !important; color: #a67c52 !important; border: 1px solid rgba(166,124,82,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(166,124,82,0.4); box-shadow: 0 0 6px rgba(166,124,82,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #a67c52 !important; }
[role="switch"] { background: #000 !important; border: 1px solid #a67c52 !important; }
[role="switch"][aria-checked="true"] { background: #33260f !important; box-shadow: 0 0 8px rgba(166,124,82,0.6) !important; }
[role="switch"] > * { background: #a67c52 !important; box-shadow: 0 0 6px rgba(166,124,82,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #33260f !important; color: #a67c52 !important; box-shadow: inset 0 0 8px rgba(166,124,82,0.4) !important; border-left: 3px solid #a67c52 !important;
}`,
  },
  {
    id: "dragonsblood",
    label: "Dragon's Blood (#8A0303)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #c40404 !important; --text-secondary: #c40404 !important; --text-tertiary: #c40404 !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #c40404 !important;
}
* { color: #c40404 !important; text-shadow: 0 0 2px rgba(196,4,4,0.6), 0 0 6px rgba(196,4,4,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(196,4,4,0.35) !important; box-shadow: 0 0 12px rgba(196,4,4,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #c40404 !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(196,4,4,0.12) !important; border: 1px solid #c40404 !important; box-shadow: 0 0 14px rgba(196,4,4,0.6) !important; }
input, textarea, select { background: #000 !important; color: #c40404 !important; border: 1px solid rgba(196,4,4,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(196,4,4,0.4); box-shadow: 0 0 6px rgba(196,4,4,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #c40404 !important; }
[role="switch"] { background: #000 !important; border: 1px solid #c40404 !important; }
[role="switch"][aria-checked="true"] { background: #3d0101 !important; box-shadow: 0 0 8px rgba(196,4,4,0.6) !important; }
[role="switch"] > * { background: #c40404 !important; box-shadow: 0 0 6px rgba(196,4,4,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #3d0101 !important; color: #c40404 !important; box-shadow: inset 0 0 8px rgba(196,4,4,0.4) !important; border-left: 3px solid #c40404 !important;
}`,
  },
  {
    id: "cochineal",
    label: "Cochineal Carmine (#960018)",
    css: `:root {
  --surface-0: #000000 !important; --surface-1: #000000 !important;
  --surface-2: #000000 !important; --surface-3: #000000 !important;
  --text-primary: #e0334f !important; --text-secondary: #e0334f !important; --text-tertiary: #e0334f !important;
}
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side,
.manager, .header, .book-list-header, .book-list-container-parent,
.book-list-container, .book-list-item-box, .sidebar {
  background-color: #000000 !important; color: #e0334f !important;
}
* { color: #e0334f !important; text-shadow: 0 0 2px rgba(224,51,79,0.6), 0 0 6px rgba(224,51,79,0.3); }
.menu, .dropdown-content, .modal-box, .toast, .alert, .collapse-title, .collapse-content, .drawer-side > * {
  background-color: #000 !important; border: 1px solid rgba(224,51,79,0.35) !important; box-shadow: 0 0 12px rgba(224,51,79,0.15) !important;
}
.btn, button { background: transparent !important; border: 1px solid transparent !important; color: #e0334f !important; }
.btn:hover, button:hover, .btn:focus, button:focus { background: rgba(224,51,79,0.12) !important; border: 1px solid #e0334f !important; box-shadow: 0 0 14px rgba(224,51,79,0.6) !important; }
input, textarea, select { background: #000 !important; color: #e0334f !important; border: 1px solid rgba(224,51,79,0.4) !important; }
::-webkit-scrollbar { background: #000; width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(224,51,79,0.4); box-shadow: 0 0 6px rgba(224,51,79,0.6); }
img { text-shadow: none !important; filter: none !important; }
input[type="checkbox"] { accent-color: #e0334f !important; }
[role="switch"] { background: #000 !important; border: 1px solid #e0334f !important; }
[role="switch"][aria-checked="true"] { background: #3d0d15 !important; box-shadow: 0 0 8px rgba(224,51,79,0.6) !important; }
[role="switch"] > * { background: #e0334f !important; box-shadow: 0 0 6px rgba(224,51,79,0.8) !important; }
[aria-selected="true"], .menu li.active, .menu li > *.active {
  background: #3d0d15 !important; color: #e0334f !important; box-shadow: inset 0 0 8px rgba(224,51,79,0.4) !important; border-left: 3px solid #e0334f !important;
}`,
  },
  {
    id: "hanpurple",
    label: "Han Purple (#5218FA)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#7c4dff !important; --text-secondary:#7c4dff !important; --text-tertiary:#7c4dff !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#7c4dff !important; }
* { color:#7c4dff !important; text-shadow:0 0 2px rgba(124,77,255,.6),0 0 6px rgba(124,77,255,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(124,77,255,.35) !important; box-shadow:0 0 12px rgba(124,77,255,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#7c4dff !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(124,77,255,.12) !important; border:1px solid #7c4dff !important; box-shadow:0 0 14px rgba(124,77,255,.6) !important; }
input,textarea,select { background:#000 !important; color:#7c4dff !important; border:1px solid rgba(124,77,255,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(124,77,255,.4);box-shadow:0 0 6px rgba(124,77,255,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#7c4dff !important;}
[role="switch"]{background:#000 !important;border:1px solid #7c4dff !important;}
[role="switch"][aria-checked="true"]{background:#1f1140 !important;box-shadow:0 0 8px rgba(124,77,255,.6) !important;}
[role="switch"]>*{background:#7c4dff !important;box-shadow:0 0 6px rgba(124,77,255,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#1f1140 !important;color:#7c4dff !important;box-shadow:inset 0 0 8px rgba(124,77,255,.4) !important;border-left:3px solid #7c4dff !important;}`,
  },
  {
    id: "bakermiller",
    label: "Baker-Miller Pink (#FF91AF)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#ff8fab !important; --text-secondary:#ff8fab !important; --text-tertiary:#ff8fab !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#ff8fab !important; }
* { color:#ff8fab !important; text-shadow:0 0 2px rgba(255,143,171,.6),0 0 6px rgba(255,143,171,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(255,143,171,.35) !important; box-shadow:0 0 12px rgba(255,143,171,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#ff8fab !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(255,143,171,.12) !important; border:1px solid #ff8fab !important; box-shadow:0 0 14px rgba(255,143,171,.6) !important; }
input,textarea,select { background:#000 !important; color:#ff8fab !important; border:1px solid rgba(255,143,171,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(255,143,171,.4);box-shadow:0 0 6px rgba(255,143,171,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#ff8fab !important;}
[role="switch"]{background:#000 !important;border:1px solid #ff8fab !important;}
[role="switch"][aria-checked="true"]{background:#4d1f2b !important;box-shadow:0 0 8px rgba(255,143,171,.6) !important;}
[role="switch"]>*{background:#ff8fab !important;box-shadow:0 0 6px rgba(255,143,171,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#4d1f2b !important;color:#ff8fab !important;box-shadow:inset 0 0 8px rgba(255,143,171,.4) !important;border-left:3px solid #ff8fab !important;}`,
  },
  {
    id: "zincsulfide",
    label: "Zinc Sulfide Fluorescent (#CCFF00)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#ccff00 !important; --text-secondary:#ccff00 !important; --text-tertiary:#ccff00 !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#ccff00 !important; }
* { color:#ccff00 !important; text-shadow:0 0 2px rgba(204,255,0,.6),0 0 6px rgba(204,255,0,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(204,255,0,.35) !important; box-shadow:0 0 12px rgba(204,255,0,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#ccff00 !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(204,255,0,.12) !important; border:1px solid #ccff00 !important; box-shadow:0 0 14px rgba(204,255,0,.6) !important; }
input,textarea,select { background:#000 !important; color:#ccff00 !important; border:1px solid rgba(204,255,0,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(204,255,0,.4);box-shadow:0 0 6px rgba(204,255,0,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#ccff00 !important;}
[role="switch"]{background:#000 !important;border:1px solid #ccff00 !important;}
[role="switch"][aria-checked="true"]{background:#333d00 !important;box-shadow:0 0 8px rgba(204,255,0,.6) !important;}
[role="switch"]>*{background:#ccff00 !important;box-shadow:0 0 6px rgba(204,255,0,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#333d00 !important;color:#ccff00 !important;box-shadow:inset 0 0 8px rgba(204,255,0,.4) !important;border-left:3px solid #ccff00 !important;}`,
  },
  {
    id: "perkinmauve",
    label: "Perkin's Mauve (#8B6F9E)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#b18fc9 !important; --text-secondary:#b18fc9 !important; --text-tertiary:#b18fc9 !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#b18fc9 !important; }
* { color:#b18fc9 !important; text-shadow:0 0 2px rgba(177,143,201,.6),0 0 6px rgba(177,143,201,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(177,143,201,.35) !important; box-shadow:0 0 12px rgba(177,143,201,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#b18fc9 !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(177,143,201,.12) !important; border:1px solid #b18fc9 !important; box-shadow:0 0 14px rgba(177,143,201,.6) !important; }
input,textarea,select { background:#000 !important; color:#b18fc9 !important; border:1px solid rgba(177,143,201,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(177,143,201,.4);box-shadow:0 0 6px rgba(177,143,201,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#b18fc9 !important;}
[role="switch"]{background:#000 !important;border:1px solid #b18fc9 !important;}
[role="switch"][aria-checked="true"]{background:#2e2438 !important;box-shadow:0 0 8px rgba(177,143,201,.6) !important;}
[role="switch"]>*{background:#b18fc9 !important;box-shadow:0 0 6px rgba(177,143,201,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#2e2438 !important;color:#b18fc9 !important;box-shadow:inset 0 0 8px rgba(177,143,201,.4) !important;border-left:3px solid #b18fc9 !important;}`,
  },
  {
    id: "egyptianblue",
    label: "Egyptian Blue (#1034A6)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#2e5ce0 !important; --text-secondary:#2e5ce0 !important; --text-tertiary:#2e5ce0 !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#2e5ce0 !important; }
* { color:#2e5ce0 !important; text-shadow:0 0 2px rgba(46,92,224,.6),0 0 6px rgba(46,92,224,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(46,92,224,.35) !important; box-shadow:0 0 12px rgba(46,92,224,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#2e5ce0 !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(46,92,224,.12) !important; border:1px solid #2e5ce0 !important; box-shadow:0 0 14px rgba(46,92,224,.6) !important; }
input,textarea,select { background:#000 !important; color:#2e5ce0 !important; border:1px solid rgba(46,92,224,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(46,92,224,.4);box-shadow:0 0 6px rgba(46,92,224,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#2e5ce0 !important;}
[role="switch"]{background:#000 !important;border:1px solid #2e5ce0 !important;}
[role="switch"][aria-checked="true"]{background:#0d1a40 !important;box-shadow:0 0 8px rgba(46,92,224,.6) !important;}
[role="switch"]>*{background:#2e5ce0 !important;box-shadow:0 0 6px rgba(46,92,224,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#0d1a40 !important;color:#2e5ce0 !important;box-shadow:inset 0 0 8px rgba(46,92,224,.4) !important;border-left:3px solid #2e5ce0 !important;}`,
  },
  {
    id: "scheelesgreen",
    label: "Scheele's Green (#3EA055)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#4fc46a !important; --text-secondary:#4fc46a !important; --text-tertiary:#4fc46a !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#4fc46a !important; }
* { color:#4fc46a !important; text-shadow:0 0 2px rgba(79,196,106,.6),0 0 6px rgba(79,196,106,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(79,196,106,.35) !important; box-shadow:0 0 12px rgba(79,196,106,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#4fc46a !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(79,196,106,.12) !important; border:1px solid #4fc46a !important; box-shadow:0 0 14px rgba(79,196,106,.6) !important; }
input,textarea,select { background:#000 !important; color:#4fc46a !important; border:1px solid rgba(79,196,106,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(79,196,106,.4);box-shadow:0 0 6px rgba(79,196,106,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#4fc46a !important;}
[role="switch"]{background:#000 !important;border:1px solid #4fc46a !important;}
[role="switch"][aria-checked="true"]{background:#123d1b !important;box-shadow:0 0 8px rgba(79,196,106,.6) !important;}
[role="switch"]>*{background:#4fc46a !important;box-shadow:0 0 6px rgba(79,196,106,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#123d1b !important;color:#4fc46a !important;box-shadow:inset 0 0 8px rgba(79,196,106,.4) !important;border-left:3px solid #4fc46a !important;}`,
  },
  {
    id: "indianyellow",
    label: "Indian Yellow (#E3A857)",
    css: `:root { --surface-0:#000 !important; --surface-1:#000 !important; --surface-2:#000 !important; --surface-3:#000 !important;
--text-primary:#f0b94e !important; --text-secondary:#f0b94e !important; --text-tertiary:#f0b94e !important; }
html, body, #root, #__next, .drawer, .drawer-content, .drawer-side, .manager, .header, .book-list-header,
.book-list-container-parent, .book-list-container, .book-list-item-box, .sidebar { background-color:#000 !important; color:#f0b94e !important; }
* { color:#f0b94e !important; text-shadow:0 0 2px rgba(240,185,78,.6),0 0 6px rgba(240,185,78,.3); }
.menu,.dropdown-content,.modal-box,.toast,.alert,.collapse-title,.collapse-content,.drawer-side>* { background-color:#000 !important; border:1px solid rgba(240,185,78,.35) !important; box-shadow:0 0 12px rgba(240,185,78,.15) !important; }
.btn,button { background:transparent !important; border:1px solid transparent !important; color:#f0b94e !important; }
.btn:hover,button:hover,.btn:focus,button:focus { background:rgba(240,185,78,.12) !important; border:1px solid #f0b94e !important; box-shadow:0 0 14px rgba(240,185,78,.6) !important; }
input,textarea,select { background:#000 !important; color:#f0b94e !important; border:1px solid rgba(240,185,78,.4) !important; }
::-webkit-scrollbar{background:#000;width:8px;} ::-webkit-scrollbar-thumb{background:rgba(240,185,78,.4);box-shadow:0 0 6px rgba(240,185,78,.6);}
img{text-shadow:none !important;filter:none !important;}
input[type="checkbox"]{accent-color:#f0b94e !important;}
[role="switch"]{background:#000 !important;border:1px solid #f0b94e !important;}
[role="switch"][aria-checked="true"]{background:#402f14 !important;box-shadow:0 0 8px rgba(240,185,78,.6) !important;}
[role="switch"]>*{background:#f0b94e !important;box-shadow:0 0 6px rgba(240,185,78,.8) !important;}
[aria-selected="true"],.menu li.active,.menu li>*.active{background:#402f14 !important;color:#f0b94e !important;box-shadow:inset 0 0 8px rgba(240,185,78,.4) !important;border-left:3px solid #f0b94e !important;}`,
  },
];
