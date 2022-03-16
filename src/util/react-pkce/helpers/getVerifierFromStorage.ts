import getEncodedVerifierKey from './getEncodedVerifierKey'
export const getVerifierFromStorage = ({ clientId }:any) => {
  const key = getEncodedVerifierKey(clientId);
  const value = localStorage.getItem(key);
  return value;
}
