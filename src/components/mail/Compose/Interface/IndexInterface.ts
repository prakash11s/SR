export interface IComposeMailProps {
 onMailSend: (p1: {}) => void,
 onClose: () => void,
 user: {
   avatar: string;
   email: string;
   name: string;
 },
 open: boolean;
}

export interface IComposeMailState {
 to: string,
 cc: string,
 bcc: string,
 subject: string,
 message: string,
}