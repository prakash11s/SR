export interface INotificationComponentProps {
 show: boolean;
 message: string;
 url: string;
 id: number;
 setNotificationHide: () => void;
 setSnackbarShow: () => void;
}