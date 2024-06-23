export default interface Blueprint {
    id: string; 
    title: string;
    icon: string;
    identifier: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: any;
  }
  