import getEncodedVerifierKey from './getEncodedVerifierKey'
export const removeVerifierFromStorage = ({ clientId }:any) => {
  const key = getEncodedVerifierKey(clientId);
  localStorage.removeItem(key);
}
