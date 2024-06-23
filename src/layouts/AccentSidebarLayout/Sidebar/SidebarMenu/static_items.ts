import type { ReactNode } from 'react';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';

export interface StaticMenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: StaticMenuItem[];
  name: string;
}

export interface StaticMenuItems {
  items: StaticMenuItem[];
  heading: string;
}

const staticMenuItems: StaticMenuItems[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'Overview',
        link: '/',
        icon: DesignServicesTwoToneIcon
      },
    ]
  }
];
export default staticMenuItems;
