import axios from "axios";

let locale:string | null = localStorage.getItem('locale');
let servicepoint = localStorage.getItem('servicepoint');
let token: any = localStorage.getItem('token');
if (locale != null) {
    locale = JSON.parse(locale);
}
token = JSON.parse(token)['access_token']

/**
 * global api service
 */
const getUrl = (endpoint: string) => `${process.env.REACT_APP_API_ENDPOINT}/${endpoint}`;

const getConfigs = (config: Record<string, any>, additionalHeaders = {}) => ({
    headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
        ...servicepoint ? ({ 'on-behalf-of': servicepoint }) : {},
        'X-Country': locale ? locale['ISO'] : 'NL',
        'Authorization': `Bearer ${token}`,
        ...additionalHeaders
    },
    ...config
});

const request = async (
  method: "get" | "post" | "put",
  endpoint: string,
  params = {},
  payload = {},
  additionalHeaders = {}
) => {
    let request;
    if (method === "post" || method === "put") {
        request = axios[method](
          getUrl(endpoint),
          payload,
          getConfigs({ params }, additionalHeaders)
        );
    } else {
        request = axios.get(
          getUrl(endpoint),
          getConfigs({ params }, additionalHeaders)
        );
    }

    const { data } = await request;

    return data;
};

export const attachDepartment = (department: string) => (axios.defaults.headers.common["X-Department"] = department);

export const get = (endpoint: string, params = {}, headers = {}) => request("get", endpoint, params, {}, headers);

export const post = (endpoint: string, data = {}, params = {}, headers = {}) => request("post", endpoint, params, data, headers);

export const put = (endpoint: string, data = {}, params = {}) => request("put", endpoint, params, data);
