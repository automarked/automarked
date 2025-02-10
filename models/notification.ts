export interface Notification {
    _id: string;        // ID único da notificação
    avatar: string;
    profileId: string
    name: string;
    action: string;
    detail?: string;
    time: string;
    unread?: boolean;
    type: string
}