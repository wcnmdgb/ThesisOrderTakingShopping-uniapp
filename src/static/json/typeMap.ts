//使用HashMap存储不同的状态信息
export const moneyMap = new Map([
    [100, 0],
    [200, 1],
    [500, 2],
]);

//修改user信息的的状态
export const userMap = new Map(
    [
        ["sex", "设置性别"],
        ["userName", "设置姓名"],
        ["nickName", "设置昵称"],
        ["birthday", "设置生日"],
        ["phone", "设置手机号"],
    ]);

//余额板块中提现或者充值的记录
export const banlanMap = new Map<number, String>([
    [0, "充值"],
    [1, "消费"]
]);
//设置订单的状态
export const orderTypeMap = new Map([
    [0, "待付款"],
    [1, "待取货"],
    [2, "清洗中"],
    [3, "配送中"],
    [4, "已完成"],
    [5, "已收货"],
    [6, "已取消"],
]);
//设置订单的提示信息
export const orderTypeDescMap = new Map([
    [0, "等待买家付款"],
    [1, "买家付款成功"],
    [2, "卖家清洗中"],
    [3, "卖家配送中"],
    [4, "订单已完成"],
    [5, "订单确认收货"],
    [6, "订单被关闭"],
]);


//优惠卷
export const couponMap = new Map<String, String>([
    ["0", "未领取"],
    ["1", "已领取"],
]);
//条件
export const fullReductionMap = new Map<String, String>([
    ["0", "满10元立减"],
    ["1", "满20元立减"],
    ["2", "满30元立减"]
]);
//优惠卷状态
export const useMap = new Map<number, String>([
    [0, "未使用"],
    [1, "已使用"],
]);

export const anOrSubMap = new Map<number, string>([
    [0, "+"],
    [1, "-"]
])
