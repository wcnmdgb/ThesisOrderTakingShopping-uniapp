
import store from "@/store/index";
import { jumpUserLogin } from "@/api/jumpApi";
import { debounce } from '@/utils/antishake';

export interface responDataInterface<T> {
    data: T,
    msg: string
    code: string
}

export interface Optioan {
    url: string,
    data: any | undefined,
    method: HttpMethod | undefined
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'HEAD';

export function myRequest<T>(Optioan: Optioan): Promise<responDataInterface<T>> {

    const token = uni.getStorageSync('token')

    const totas = {
        type: "error",
        message: ""
    }
    return new Promise<responDataInterface<T>>((resolve, reject) => {
        for (let key in Optioan.data) {
            if (Optioan.data[key] === undefined) {
                delete Optioan.data[key]
            }
        }
        uni.request({
            url: Optioan.url,
            data: Optioan.data,
            method: Optioan.method,
            header: {
                "Authorization": token
            },
            dataType: 'json',
            success(response) {


                let message = '';
                switch (response.statusCode) {
                    case 400:
                        totas.message = "请求错误(400)";
                        store.commit("setToast", totas)
                        break;
                    case 401:
                        totas.message = "未授权，请重新登录(401)";
                        debounce(() => {
                            store.commit("setToast", totas);
                            jumpUserLogin();
                        }, 400)
                        // 这里可以做清空storage并跳转到登录页的操作
                        break;
                    case 403:
                        totas.message = "拒绝访问(403)";
                        store.commit("setToast", totas)
                        break;
                    case 404:
                        totas.message = "请求出错(404)";
                        store.commit("setToast", totas)
                        break;
                    case 408:
                        totas.message = "请求超时(408)";
                        store.commit("setToast", totas)
                        break;
                    case 500:
                        totas.message = "服务器错误(500)";
                        store.commit("setToast", totas)
                        break;
                    case 501:
                        totas.message = "服务未实现(501)";
                        store.commit("setToast", totas)
                        break;
                    case 502:
                        totas.message = "网络错误(502)";
                        store.commit("setToast", totas)
                        break;
                    case 503:
                        totas.message = "服务不可用(503)";
                        store.commit("setToast", totas)
                        break;
                    case 504:
                        totas.message = "网络超时(504)";
                        store.commit("setToast", totas)
                        break;
                    case 505:
                        totas.message = "HTTP版本不受支持(505)";
                        store.commit("setToast", totas)
                        break;
                    case 200:
                        const data = <responDataInterface<T>>response.data

                        if (data.code =='000') {

                            resolve(data);
                        } else {
                            totas.message = data.msg;
                            resolve(data);
                            store.commit("setToast", totas)
                        }
                        break;
                }


            },
            fail(response) {

                totas.message = response.errMsg;
                store.commit("setToast", totas)
            }
        })
    })
}
