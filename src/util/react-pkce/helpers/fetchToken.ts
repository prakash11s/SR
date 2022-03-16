import axios from '../../Api'

export const fetchToken = ({ clientId, code, verifier, tokenEndpoint, redirectUri }:any) => {
  const payload = {
    client_id: clientId,
    code,
    grant_type: 'authorization_code',
    code_verifier: verifier,
    redirect_uri: redirectUri
  };

  return axios.post(tokenEndpoint, payload)
      .then(r => {
        return r.data;
      })
    .then((token:any) => {
      const { expires_in } = token;
      if (expires_in && Number.isFinite(expires_in)) {
        const slackSeconds = 10;
        // add 'expires_at', with the given slack
        token.expires_at = new Date(new Date().getTime() + expires_in * 1000 - (slackSeconds * 1000));
      }
      return token
    })
    .catch(err => {
      console.error('ERR (fetch)', err);
      throw err;
    });
}
