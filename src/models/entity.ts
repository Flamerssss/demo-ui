import Blueprint from './blueprint';

export default interface Entity {
    id: string;
    title: string;
    icon: string;
    // identifier: string;
    property: any;
    team: string;
    blueprint: Blueprint;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: any;
}
