export interface IMailDetailProps {
 mail: IMailObj, 
 onStartSelect: (data: IMailObj) => void, 
 onImportantSelect: (mail: IMailObj) => void, 
 width: number;
}

interface IMailObj {  
   subject: string;
   starred: string;
   important: string;
   from: {
     personal: string;
     mail: string;
   }[];
   to: {
     mail: string;
   }[];
   date: string;
   contents: {
     html: {
       content: string;
     };
   };
   attachments: {
     preview: string | undefined,
     fileName: string,
     size: number
   }[];  
}

export interface IMailDetailState {
 anchorEl: HTMLElement|undefined,
 open: boolean,
 showDetail: boolean
}