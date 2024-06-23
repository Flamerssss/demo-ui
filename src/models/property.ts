import Action from './action';
import Blueprint from './blueprint';

export default interface Property {
  id: string;
  blueprint: Blueprint;
  action: Action;
  title: string;
  icon: string;
  description: string;
  required: boolean;
  type: string;
  schema: any;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
