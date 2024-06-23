export default interface InvocationMethod {
    id: string;
    actionId: string;
    icon: string;
    type: any;
    agent: boolean;
    synchronized: boolean;
    method: string;
    url: string;
    [key: string]: any;
}
