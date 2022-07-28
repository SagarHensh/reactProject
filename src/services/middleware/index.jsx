import axios from "axios";
import { APIURL } from "../apiConfig/admin";
import { APP_CONFIG } from "../apiConfig";
import { CryptoDecoder, Encoder } from "../auth";


export function ApiCall(uriName, payload) {
    return new Promise(async function (resolved, reject) {
        try {
            if (APIURL.APP_LAST_URI[uriName].isAuth == true) {
                const authToken = localStorage.getItem("AuthToken");
                const token = CryptoDecoder.CryptoDecode(authToken);
                axios.interceptors.request.use(
                    config => {
                        if (config.headers.authorization === undefined) {
                            config.headers.authorization = `Bearer ` + token;
                        }
                        return config;
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
            const encodeData = Encoder.encode(payload);
            if (APIURL.APP_LAST_URI[uriName].method == "POST") {
                axios.post(APP_CONFIG.BASE_URL + APIURL.APP_LAST_URI[uriName].path, {
                    payload: encodeData
                })
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            } else if (APIURL.APP_LAST_URI[uriName].method == "GET") {
                axios.get(APP_CONFIG.BASE_URL + APIURL.APP_LAST_URI[uriName].path)
                    .then(res => {
                        let response = res.data;
                        resolved(response);
                    })
                    .catch(error => {
                        // handle error
                        reject(error);
                    })
            }
        } catch (e) {
            reject(e);
        }
    })
}