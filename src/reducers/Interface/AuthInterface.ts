export interface IAuth {
  token:string,
  authUser:{
    avatar: string | null,
    first_name: string,
    last_name: string
   },
   isWebsocketConnected: number
  initURL: string
}
