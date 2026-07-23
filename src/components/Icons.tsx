import type { SVGProps } from 'react'

function createIcon(paths: string[], viewBox = '0 0 24 24') {
  return ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

export const DashboardIcon = createIcon([
  'M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z',
  'M9 21V12h6v9',
])

export const ProjectsIcon = createIcon([
  'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z',
  'M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z',
])

export const SkillsIcon = createIcon([
  'M12 3v13M5 10l7-7 7 7M5 21h14',
])

export const ContactsIcon = createIcon([
  'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  'M9 7a4 4 0 100-8 4 4 0 000 8z',
  'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
])

export const UserIcon = createIcon([
  'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2',
  'M12 7a4 4 0 100-8 4 4 0 000 8z',
])

export const MessagesIcon = createIcon([
  'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
])

export const BellIcon = createIcon([
  'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
])

export const SearchIcon = createIcon([
  'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
])

export const SunIcon = createIcon([
  'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  'M12 17a5 5 0 100-10 5 5 0 000 10z',
])

export const MoonIcon = createIcon([
  'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
])

export const MenuIcon = createIcon([
  'M3 12h18M3 6h18M3 18h18',
])

export const CloseIcon = createIcon([
  'M18 6L6 18M6 6l12 12',
])

export const LogoutIcon = createIcon([
  'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
])

export const ChevronLeftIcon = createIcon([
  'M15 18l-6-6 6-6',
])

export const ChevronRightIcon = createIcon([
  'M9 18l6-6-6-6',
])

export const MoreVerticalIcon = createIcon([
  'M12 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 5.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 14.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
])

export const PlusIcon = createIcon([
  'M12 5v14M5 12h14',
])

export const MailIcon = createIcon([
  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
  'M22 6l-10 7L2 6',
])

export const GlobeIcon = createIcon([
  'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z',
  'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
])

export const TrashIcon = createIcon([
  'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
  'M10 11v6M14 11v6',
])

export const EditIcon = createIcon([
  'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7',
  'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
])

export const EyeIcon = createIcon([
  'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
  'M12 9a3 3 0 100 6 3 3 0 000-6z',
])

export const SendIcon = createIcon([
  'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
])

export const CheckIcon = createIcon([
  'M20 6L9 17l-5-5',
])

export const SettingsIcon = createIcon([
  'M12 15a3 3 0 100-6 3 3 0 000 6z',
  'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
])

export const CalendarIcon = createIcon([
  'M3 10h18M8 3v2M16 3v2M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z',
  'M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01',
])

export const MapPinIcon = createIcon([
  'M12 22s8-4 8-10c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 6 8 10 8 10z',
  'M12 14a4 4 0 100-8 4 4 0 000 8z',
])

export const BriefcaseIcon = createIcon([
  'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2',
  'M6 7h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z',
  'M8 7v3M16 7v3',
])

export const FolderIcon = createIcon([
  'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
])
