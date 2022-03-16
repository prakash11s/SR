
export interface ICreateEmployeePromptProps {
 getEmployeeRoles: () => void;
 show: boolean;
 handleFirstName: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 handleLastName: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 handleEmail: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 handlePhone: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 handleRole: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 handleCountryCode: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => void;
 role: [];
 countryCodes: [];
 roles: IRolesObj[];
 message: JSX.Element;
 title: JSX.Element;
 showOk: any;
 showCancel: any;
 confirmBtnText: JSX.Element;
 onConfirm: () => void;
 onCancel: () => void; 
 disabled: boolean;
}

export interface IRoleType {
 id: number;
 name: string;  
}

interface IRolesObj {
abilities: IAbilities;
created_at: string;
delete_protection: boolean;
description: string;
id: string;
level: number;
name: string;
scope: null;
updated_at: string;
}

interface IAbilities{
created_at: string;
delete_protection: number;
entity_id: null;
entity_type: string;
id: string;
name: string;
only_owned: number;
options: [];
scope: null
title: string;
updated_at: string;
}
