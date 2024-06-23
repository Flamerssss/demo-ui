import Blueprint from './blueprint';

export default interface Action {
    id: string;
    blueprint: Blueprint;
    title: string;
    icon: string;
    identifier: string;
    description: string;
    actionType: string;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: any;
}
