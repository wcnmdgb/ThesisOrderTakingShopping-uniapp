export interface tabInterface {
    laber: string;
    type: number;
    active: boolean
}

export interface tradeTypeInterFace {
    id: number | string;
    label: string;
    create_time: string;
    status: number | undefined;
}

//商品
export interface tradeInterFace {
    id: number;
    name: string;
    desc: string;
    image: string;
    money: number;
    create_time: string;
    update_time: string;
    status: number;
    product_type_id: number;
    product_type: Product_type | string;
    value: number;
    checked: Boolean;
}
export interface Product_type {
    label: string;
}

export interface tradeSubInterFace {
    id: number | string;
    name: string;
    desc: string;
    image: string;
    create_time: string;
    money: number | string;
    status: number | undefined | string;
    product_type_id: number | undefined | string;

}

export interface tradeType {
    label: string;
    id: number | undefined;
    name: string;
    create_time: string;
    status: number;
}

export interface interfaceUser {
    id: number;
    user_name: string;
    ban: number;
    money: number;
    create_time: string;
    vip: number;
}

export interface RuleForm {
    oldPassword: string;
    password: string;
    checkedPassword: string;
}


export interface rotationChartInterface {
    id: number;
    title: string;
    create_time: string;
    del: number;
    status: number;
    image: string
}




export interface Xlxw_coupon {
    id: number;
    money: number;
    condition: number;
    user_id: number;
    number: number;
    status: number;
    title: string;
}

export interface couppon_userInterface {
    id: number;
    user_id: number;
    create_time: string;
    update_time: string;
    coupon_id: number;
    xlxw_coupon: Xlxw_coupon;
    status: number;
}

export interface orderInfo {
    id: number;
    order_id: string;
    user_id: string;
    actual_payment: number;
    address_id: number;
    ip: string;
    status: number;
    del: number;
    create_time: string;
    update_time: string;
}


export interface Xlxw_coupon_user {
    user_id: number | undefined;
}

export interface xlxw_coupon_interface {
    id: number;
    money: number;
    condition: number;
    user_id: number;
    number: number;
    status: number;
    title: string;
    xlxw_coupon_users: Xlxw_coupon_user[];
}
export interface totasInterface {
    message: string,
    type: string
}


export interface addResInterface {
    id: number;
    user_id: string;
    del: number;
    phone: number;
    dormitory_number: string;
    lou_number: string;
    desc: string;
    update_time: string;
    create_time: string;
    consignee_name: string;
    checked: number;
}



export interface Order {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
}

export interface orderInterface {
    id: number;
    order_id: string;
    user_id: string;
    coupon_id?: any;
    actual_payment?: number;
    payment?: any;
    update_time: string;
    create_time: string;
    address_id: number;
    ip: string;
    status: number;
    del: number;
    order: Order;
}

export interface Xlxw_trade {
    id: number;
    name: string;
    desc: string;
    image: string;
    money: number;
    product_type_id: number;
    create_time: string;
    update_time: string;
    del: number;
    status: number;
}

export interface Xlxw_order_trade {
    id: number;
    order_id: string;
    trade_id: number;
    number: number;
    xlxw_trade: Xlxw_trade;
}

export interface Orderdetails {
    id: number;
    order_id: string;
    user_id: string;
    coupon_id?: any;
    actual_payment?: number;
    payment?: any;
    update_time: string;
    create_time: string;
    address_id: number;
    ip: string;
    status: number;
    del: number;
    xlxw_address: xlxw_addres;
    xlxw_order_trades: Xlxw_order_trade[]
}

export interface xlxw_addres {
    id: number;
    user_id: string;
    checked: number;
    del: number;
    phone: string;
    dormitory_number: string;
    lou_number: string;
    desc: string;
    update_time: string;
    create_time: string;
    consignee_name: string;
}



// export interface responInterface<T> {
//     data: responDataInterface<T>
// }

export interface responInterCountface<T> {
    data: responCount<T>
}


//携带count的返回类型
export interface responCount<T> {
    data: countResInterdace<T>,
    msg: string
    code: number
}
export interface countResInterdace<T> {
    rows: T[];
    count: number
}

export interface xlxw_user {
    id: number | undefined;
    user_name: string | undefined;
    user_id: string | undefined;
    ban: number | undefined;

    create_time: string | undefined;
    vip: number | undefined;
    xlxw_coupon_users: Xlxw_couponuser[];
    xlxw_balances: Xlxw_blance[];

}
export interface Xlxw_blance {
    id: number;
    money: number;
    create_time: string;
    update_time: string;
    user_id: string;
    status:number;

}

export interface Xlxw_couponuser {
    id: number;
    user_id: string | undefined;
    status: number;
    coupon_id: number;
    create_time: string;
    update_time: string;
}

export interface checkedToken {
    token: string;
}

export interface Admin_user {
	user_name: string;
}

export interface drawInterface {
	id: number;
	image: string;
	user_id: string;
	create_time: string;
	status: number;
	del: number;
	admin_user: Admin_user;
}
