export const jumpshoeWashingApi = (active: number) => {
    uni.navigateTo({
        url: `../shoeWashing/shoeWashing?active=` + active,
    });
}

export const jumpclassification = () => {
    uni.switchTab({
        url: `../classification/classification`
    });
}

//跳转到订单确认界面
export const jumpConfirmOrder = () => {

    uni.navigateTo({
        url: "../confirmOrder/confirmOrder"
    })
}

//跳转到收货地址界面

export const jumpHarvestAddress = () => {
    uni.navigateTo({
        url: "../harvestAddress/harvestAddress"
    })

}
//到达添加界面

export const jumpAddAddress = () => {
    uni.navigateTo({
        url: "../addAddress/addAddress"
    })
}

//跳转到用户设置界面
export const jumpPersonalSettings = () => {
    uni.navigateTo({
        url: "../personalSettings/personalSettings"
    })
}

//跳转到修改界面携带一个修改项
export const jumpChangerUser = (query: string) => {

    uni.navigateTo({
        url: "../changeUser/changeUser?query=" + query
    })

}

export const jumpClassFication = () => {
    uni.switchTab({
        url: "../classification/classification",
    });
}
//跳转到洗护说明
export const jumpCareInstructions = () => {
    uni.navigateTo({
        url: "../careInstructions/careInstructions",
    });
}
//跳转到订单管理界面 携带的参数是在订单管理界面中所处的位置
export const jumpshoeWashing = (active: number | undefined) => {
    uni.navigateTo({
        url: `../shoeWashing/shoeWashing?active=${active}`,
    });
}
export const redirectToshoeWashing = (active: number | undefined) => {
    uni.redirectTo({
        url: `../shoeWashing/shoeWashing?active=${active}`,
    });
}



export const jumpShoeRed = (active: number | undefined) => {
    uni.redirectTo({
        url: `../shoeWashing/shoeWashing?active=${active}`,
    });
}


//跳转到付款界面
export const jumpPayment = (orderId: string | undefined) => {

    uni.reLaunch({
        url: `../payment/payment?orderId=${orderId}`,
    });

}

//跳转到订单的详情界面
export const jumpOrderDetails = (orderId: string, status: number) => {
    uni.navigateTo({
        url: `../orderDetails/orderDetails?orderId=${orderId}&status=${status}`
    })
}


//跳转到余额界面
export const jumpBalance = () => {
    uni.navigateTo({
        url: "../balance/balance"
    });
}
//跳转到优惠券界面
export const jumpCoupon = () => {
    uni.navigateTo({
        url: "../coupon/coupon"
    })
}

//界面跳转到充值记录
export const jumpRechargeRecord = () => {
    uni.navigateTo({
        url: `../rechargeRecord/rechargeRecord`
    });
}

//跳转到会员中心
export const jumpActivateMembership = () => {
    uni.navigateTo({
        url: '../activateMembership/activateMembership'
    })
}

//跳转到兑换中心
export const jumpExchange = () => {
    uni.navigateTo({
        url: "../exchange/exchange"
    })
}
//跳转到领卷中心
export const jumpVoucherCollectionCenter = () => {
    uni.navigateTo({
        url: "../voucher/voucher"
    })
}
//跳转到分享海报
export const jumpShareFriends = () => {
    uni.navigateTo({
        url: "../shareFriends/shareFriends"
    })
}
//跳转到登陆界面
export const jumpUserLogin = () => {
    uni.navigateTo({
        url: "../userlogin/userlogin"
    })
}

