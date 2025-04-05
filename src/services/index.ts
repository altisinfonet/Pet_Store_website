import axios from "axios";

const options = { withCredentials: true };

const _get = (url: string) => {
    return axios.get(url, options)
}

const _put = (url: string, data?: any) => {
    return axios.put(url, data ? data : null, options);
}

const _post = (url: string, data: any, optionsM?: any) => {
    return axios.post(url, data, {
        ...options,
        ...optionsM
    });
}

const _delete = (url: string, optionsM?: any) => {
    return axios.delete(url, {
        ...options,
        ...optionsM
    });
}

export {
    _get,
    _put,
    _post,
    _delete
}