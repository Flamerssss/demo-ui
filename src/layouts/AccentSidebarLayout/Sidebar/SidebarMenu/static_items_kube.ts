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

const kubeMenuItems: StaticMenuItems[] = [
  {
    heading: 'Cluster',
    items: [
      {
        name: 'Overview',
        link: '/kubernetes',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Nodes',
        link: '/kubernetes/nodes',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'System Components',
        link: '/kubernetes/system-components',
        icon: DesignServicesTwoToneIcon
      },
    ]
  },
  {
    heading: null,
    items: [
      {
        name: 'Namespaces',
        link: '/kubernetes/namespaces',
        icon: DesignServicesTwoToneIcon
      },
    ]
  },
  {
    heading: 'Workloads',
    items: [
      {
        name: 'Pods',
        link: '/kubernetes/pods',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Deployments',
        link: '/kubernetes/deployments',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Daemon Sets',
        link: '/kubernetes/daemon-sets',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Stateful Sets',
        link: '/kubernetes/stateful-sets',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Replica Sets',
        link: '/kubernetes/replica-sets',
        icon: DesignServicesTwoToneIcon
      },
    ]
  },
  {
    heading: 'Config',
    items: [
      {
        name: 'Config Maps',
        link: '/kubernetes/config-maps',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Secrets',
        link: '/kubernetes/secrets',
        icon: DesignServicesTwoToneIcon
      }
    ]
  },
  {
    heading: 'Network',
    items: [
      {
        name: 'Services',
        link: '/kubernetes/services',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Endpoints',
        link: '/kubernetes/endpoints',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Ingresses',
        link: '/kubernetes/ingresses',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Ingress Classes',
        link: '/kubernetes/ingress-classes',
        icon: DesignServicesTwoToneIcon
      }
    ]
  },
  {
    heading: 'Storage',
    items: [
      {
        name: 'Persistent Volume Claims',
        link: '/kubernetes/pvc',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Persistent Volume',
        link: '/kubernetes/pv',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Storage Classes',
        link: '/kubernetes/sc',
        icon: DesignServicesTwoToneIcon
      },
    ]
  },
  {
    heading: 'Access Control',
    items: [
      {
        name: 'Service Accounts',
        link: '/kubernetes/service-accounts',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Cluster Roles',
        link: '/kubernetes/cluster-roles',
        icon: DesignServicesTwoToneIcon
      },
      {
        name: 'Roles',
        link: '/kubernetes/roles',
        icon: DesignServicesTwoToneIcon
      },
    ]
  },
];
export default kubeMenuItems;
