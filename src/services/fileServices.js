import { API_URL } from "../utils/network/config";

export async function fileServices(type) {
    const res = await fetch(API_URL + `/${type}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((json) => {
            json.status = "success";
            return json;
        })
        .catch((error) => {
            console.log('network error', error);
            return error;
        });
    return res;
}

// export async function deleteFile(url, path) {

// }