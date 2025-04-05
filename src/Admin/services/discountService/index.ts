import { _get, _put, _post } from "..";


const createDiscount = (url: string, data: any) => {
    return _post(url, data);
}