import { bool } from 'prop-types';

export interface ICreateAbilitiesPromptProps {
 show: boolean;
 title: {};
 showOk?: boolean;
 showCancel?: boolean;
 confirmBtnText?: JSX.Element;
 handleAbility: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>  void;
 handleDescription: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>  void;
 onConfirm?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
 onCancel?: () => void;
 disabled?: boolean;
 createAbilityPopup?: () => void;
 buttonStatus?: boolean;
}