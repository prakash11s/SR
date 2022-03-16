export interface IAbilitiesOverviewProps {
 createAbilityPopUpTrue: () => void;
 setAbility: (e: string) => void;
 checkSubmitButtonStatus: () => void;
 setDescription: (e: string) => void;
 createAbilityPopUpFalse: () => void;
 successValueFalse: () => void;
 warningValueFalse: () => void;
 triggerSubmitForm: () => void;
 alertPopUpValueFalse: () => void;
 match: match<MatchParams>;
 alertPopUpValue: boolean;
 message: string;
 warningValue: boolean;
 successValue: boolean;
 createAbilityPopup: boolean;
 buttonStatus: boolean;
}

interface MatchParams {
 name: string;
}

export interface match<P> {
params: P;
isExact: boolean;
path: string;
url: string;
}