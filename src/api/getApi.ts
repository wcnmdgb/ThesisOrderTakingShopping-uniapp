import url from "@/static/json/request";
import { myRequest } from "@/utils/request"
import type { responCount, drawInterface, Order, Xlxw_blance, orderInfo, checkedToken, orderInterface, Orderdetails, xlxw_user, xlxw_coupon_interface, rotationChartInterface, addResInterface, tradeType, tradeInterFace, couppon_userInterface, countResInterdace } from "@/interface/interface";


//携带用户信息登陆到后端
export const koaLogin = (code: string) => {
    return myRequest<any>({
        url: `${url.host}/user/find/unilogin`,
        data: {
            code
        },
        method: 'POST',
    });

}

//获取轮播图

export const finAllDrotationChart = (title: string | undefined, index: number | undefined, status: undefined | number) => {

    return myRequest<countResInterdace<rotationChartInterface>>({
        url: `${url.host}/user/find/rotat`,
        data: {
            title, index, status
        },
        method: 'GET',
    })
}

export const findAlltitle = (name: string | undefined, index: number, status: number | undefined) => {
    return myRequest<tradeType[]>({
        url: `${url.host}/user/find/shoptype`,
        data: {
            name, index, status
        },
        method: 'GET',
    })
}


export const findAllTarde = (productTypeId: number, index: number, status: undefined | number) => {

    return myRequest<countResInterdace<tradeInterFace>>({
        url: `${url.host}/user/find/tarde`,
        data: {
            productTypeId,
            index,
            status
        },
        method: 'GET',
    })
}

export const getUserCoupon = (status: number | undefined, condition: number | undefined) => {
    return myRequest<couppon_userInterface[]>({
        url: `${url.host}/user/find/coupon`,
        data: {
            status, condition
        },
        method: 'GET',
    })
}


export const findCoupon = () => {
    return myRequest<xlxw_coupon_interface[]>({
        url: `${url.host}/user/find/couponall`,
        data: {},
        method: 'GET',
    })
}

export const seizeCoupons = (couponId: number) => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/obtaincouppon`,
        data: {
            couponId
        },
        method: "POST"
    })
}


export const generateOrder = (orderItem: string, del: boolean) => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/generateorder`,
        data: {
            orderItem,
            del
        },
        method: "POST"
    })
}

export const getAddr = (consigneeName: string | undefined, checked: number | undefined) => {
    return myRequest<addResInterface[]>({
        url: `${url.host}/user/find/addr`,
        data: {
            consigneeName, checked
        },
        method: "GET"
    })
}

export const cgeAddr = (id: number, phone: number | undefined, dormitoryNumber: string | undefined, louNumber: string | undefined, desc: string | undefined, consigneeName: string | undefined, checked: number) => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/addr`,
        data: {
            id, phone, dormitoryNumber, louNumber, desc, consigneeName, checked
        },
        method: "POST"
    })
}

export const createAddr = (phone: number | undefined, dormitoryNumber: string, louNumber: string, desc: string, consigneeName: string, checked: number) => {
    return myRequest<undefined>({
        url: `${url.host}/user/create/addr`,
        data: {
            phone, dormitoryNumber, louNumber, desc, consigneeName, checked
        },
        method: "PUT"
    })
}

export const delAddr = (id: number | undefined) => {
    return myRequest<undefined>({
        url: `${url.host}/user/del/addr`,
        data: {
            id
        },
        method: "DELETE"
    })
}

export const submitOrder = (orderAes: string) => {
    return myRequest<orderInfo>({
        url: `${url.host}/user/create/suborder`,
        data: {
            orderAes
        },
        method: "POST"
    })
}

export const findOrder = (orderId: number, status: number) => {
    return myRequest<orderInterface>({
        url: `${url.host}/user/find/order`,
        data: {
            orderId, status
        },
        method: "GET"
    })
}

export const details = (orderId: number, status: number) => {
    return myRequest<Orderdetails>({
        url: `${url.host}/user/find/details`,
        data: {
            orderId, status
        },
        method: "GET"
    })
}

export const findAllOrder = (index: number, status: number | undefined) => {
    return myRequest<countResInterdace<Orderdetails>>({
        url: `${url.host}/trade/findAll`,
        data: {
            index, status
        },
        method: "POST"
    })

}

export const payment = (payment: number, orderId: string | undefined) => {
    return myRequest({
        url: `${url.host}/user/alter/payment`,
        data: {
            payment, orderId
        },
        method: "POST"
    })
}
export const findUserInfo = () => {

    return myRequest<xlxw_user>({
        url: `${url.host}/user/find/userinfo`,
        data: {},
        method: "GET"
    })
}

//修改订单状态
export const cgeOrder = (orderId: string | undefined, status: number) => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/order`,
        data: {
            orderId,
            status
        },
        method: "POST"
    })

}

export const checkToken = () => {
    return myRequest<checkedToken>({
        url: `${url.host}/system/checkToken`,
        data: {},
        method: 'POST'
    })
}
export const cgeUser = (userName: string) => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/user`,
        data: { userName },
        method: "POST"
    })
}

export const loginout = () => {
    return myRequest<undefined>({
        url: `${url.host}/user/alter/loginout`,
        data: {},
        method: "POST"
    })
}

//获取余额
export const findbanlance = (status: number | undefined) => {

    return myRequest<Xlxw_blance[]>({
        url: `${url.host}/user/find/banlance`,
        data: { status },
        method: "GET"

    })
}

export const genbanlance = (item: string) => {
    return myRequest<Order>({
        url: `${url.host}/user/alter/genbanlance`,
        data: { item },
        method: "POST"
    })
}

// export const cgeblance = (item: string) => {
//     return myRequest<undefined>({
//         url: `${url.host}/trade/cgeblance`,
//         data: { item },
//         method: "POST"
//     })

// }
export const findDraw = (index: number, status: number) => {
    return myRequest<countResInterdace<drawInterface>>({
        url: `${url.host}/user/find/draw`,
        data: { index, status },
        method: "POST"
    })
}

// export const cgetOder = (status: number, orderId: string) => {
//     return myRequest<undefined>({
//         url: `${url.host}/trade/cgeOrder`,
//         data: { status, orderId },
//         method: "POST"
//     })
// }
