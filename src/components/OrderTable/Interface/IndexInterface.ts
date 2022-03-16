export interface IOrderTableProps {
 dataList: IdataListObject[],
 deleteOrder: (id: number) => void,
 openSearchServiceModal: any,
 handleRequestClose: (orderId: number) => void,
 menuState: boolean|undefined,
 className: string|undefined,
}

export interface IdataListObject {
address: {
 street: string, 
 street_number: string, 
 city: string, 
 zip_code: string, 
 country: string
}
deliveryDate: string|null,
email: string,
image: string|null,
name: string,
orderDate: string|null,
orderId: number,
phone: string,
status: {
 id: number, 
 name: string
},
id?: number,
locked: {
    id: number,
    name: string,
    avatar: string
}
}

export interface IOrderTableState {
    toggleClass: boolean|undefined
}