<template>
    <view>
        <totNar :title="title"></totNar>

        <view class="main">

            <view @click="jumpHarvestAddress">
                <view><text class="iconfont icon-dingwei"></text></view>
                <view>
                    <text>{{ addrItem?.consignee_name }}&nbsp</text>
                    <text>{{ addrItem?.phone }}\n</text>
                    <text>{{ addrItem?.dormitory_number }}{{ addrItem?.lou_number }}{{ addrItem?.desc }}</text>
                </view>
                <view><text class="iconfont icon-xiangyou1"></text></view>

            </view>
            <view>
                <!-- <u-button type="primary">寄放网点</u-button> -->
            </view>


            <view>
                <text style="font-size: 35rpx;">鞋来鞋往</text>
                <confirm :list="list" ref="confirComponentsRef"></confirm>

                <view>
                    <!-- <view class="order"><text>鞋来鞋往</text> <text>寄放网点</text></view> -->
                    <view class="order"><text>￥{{ confirComponentsRef.commodity.maney / 100 }}</text> <text>商品金额</text>
                    </view>
                    <view class="order"><text>￥0</text> <text>配送费</text></view>
                    <view class="order">

                        <text v-if="subOrderData.couponId" class="money" @click="coupponShow = true">
                            -￥{{ couponReduction.reductionmoney / 100 }}</text>

                        <text class="wait" v-else-if="subOrderData.couponId || coupponUserList.length > 0"
                            @click="coupponShow = true">未选优惠券,点击使用</text>

                        <text v-else class="none">无可用优惠券</text>

                        <text>优惠券</text>
                    </view>
                </view>
            </view>


        </view>
        <view class="card">
            <view>
                <text>总计:</text>
                <text style="color:red;">￥{{ couponReduction.sumMoney / 100 }}</text>
                <u-button type="primary" @click="subOrder">提交订单</u-button>
            </view>
        </view>

        <u-popup :show="coupponShow" mode="bottom" @close="close">
            <view class="popup">
                <u-radio-group v-model="subOrderData.couponId" placement="column" @change="coupponShow = false">
                    <view class="item" v-for="(item, index) in coupponUserList" :key="index">
                        <view>
                            <view class="couponItem">
                                <view class="couponTitle"> {{ item.xlxw_coupon?.title }} </view>

                                <view class="couppmoney">{{ item.xlxw_coupon?.money / 100 }} <text
                                        style="font-size: 25rpx;">元</text></view>
                                <view class="couppernDisc">满{{ item.xlxw_coupon?.condition / 100 }}元立减</view>
                            </view>
                        </view>
                        <view>
                            <u-radio :name="item.coupon_id">
                            </u-radio>
                        </view>
                    </view>
                    <view class="item">
                        <view class="couponItem">
                            不使用优惠券
                        </view>
                        <view>
                            <u-radio :name="undefined">
                            </u-radio>
                        </view>
                    </view>

                </u-radio-group>
            </view>
        </u-popup>

    </view>
</template>


<script lang="ts" setup>
import totNar from "../../components/navbar.vue"
import confirm from "../../components/confirm.vue"
import { jumpHarvestAddress, jumpPayment, jumpClassFication, jumpclassification } from "@/api/jumpApi"
import { ref, computed, onMounted, reactive, watch } from "vue"
import store from "@/store/index"
import type { tradeInterFace } from "@/interface/interface";
import { getAddr, submitOrder, getUserCoupon } from "@/api/getApi";
import type { addResInterface, orderInfo, couppon_userInterface } from "@/interface/interface";
import { debounce } from "@/utils/antishake";
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import { AES_Encrypt } from '@/utils/crypt';
import { tryFun } from "@/utils/tryFun"

const title = ref("确认订单");

//获取缓存的信息 将没有选择的数据过滤
const list = ref<tradeInterFace[]>(store.state.commodityList.filter(item => item.checked === true && item.value > 0));

//获取子类的传输对象
const confirComponentsRef = ref({ commodity: { maney: 0 } });

const addrItem = ref<addResInterface>();
const coupponShow = ref(false);

const coupponUserList = ref<couppon_userInterface[]>([]);

const subOrderData = reactive({

    couponId: undefined,
})

const orderData = ref<orderInfo>();

//点击关闭界面
const close = () => {
    coupponShow.value = false
}

const toast = reactive({
    message: "",
    type: ""
})


const queryGetUserCouppon = async (status: number | undefined) => {
    const { data, code } = await getUserCoupon(status, confirComponentsRef.value.commodity.maney);
    if (code === '000') {
        coupponUserList.value = data;
    }

}

const cache = () => {
    let number = store.state.commodityList;

    if (number.length == 0) {
        jumpClassFication()
    }
}

//订单提交
const subOrder = async () => {


    tryFun(() => {
        debounce(async () => {
            if (couponReduction.value.addrId == undefined) {
                toast.message = "地址为空";
                toast.type = "error"
                store.commit("setToast", toast)
                return
            }
            const dataJson = {
                addrId: couponReduction.value.addrId,
                couponId: subOrderData.couponId,

            }
            const orderAes = AES_Encrypt(JSON.stringify(dataJson)).toString();
            const { data } = await submitOrder(orderAes);
            orderData.value = data;
            //需要删除pages中的全部当前界面
            if (orderData != undefined || orderData != '') {
                jumpPayment(orderData.value?.order_id);
            } else {
                toast.message = "购物车信息错误";
                toast.type = "error"
                store.commit("setToast", toast);
                jumpclassification();
            }
            store.commit("clearList");

        }, 300)
    }, () => { }, "订单提交异常");

}




//获取默认的地址信息

const getaddr = () => {
    getAddr('', 0).then(res => {
        if (res.data.length === 0) {
            toast.message = "请填写收货地址";
            toast.type = "error"
            store.commit("setToast", toast);
            jumpHarvestAddress();
        } else {
            addrItem.value = res.data[0];
        }
    })
}


const couponReduction = computed(() => {

    let reductionmoney = 0;
    let sumMoney = confirComponentsRef.value.commodity.maney;
    if (subOrderData.couponId) {
        reductionmoney = coupponUserList.value.filter(item => { return item.coupon_id == subOrderData.couponId })[0].xlxw_coupon.money;
        sumMoney -= reductionmoney;
    }
    let addrId = addrItem.value?.id;

    return { reductionmoney, sumMoney, addrId };
})

//检验缓存是否为空


onMounted(() => {
    queryGetUserCouppon(0);
    cache();
})


//切换到当前界面就会执行
onShow(() => {
    getaddr();
})

onPullDownRefresh(() => {
    getaddr();
    queryGetUserCouppon(0);
    cache();
    uni.stopPullDownRefresh()

})



//此处选中默认地址
</script>

<style lang="scss" scoped>
@import url("../../style/style.scss");


.main {


    >view {
        width: 93%;
        margin: 20rpx 3.5% 0 3.5%;
        background: #fff;

        //第一部分的地址列表
        &:first-child {
            align-items: center;
            border-radius: 10rpx;
            padding: 20rpx 0 20rpx 0;


            display: flex;
            flex-direction: row;
            justify-content: center;

            view {
                &:first-child {
                    width: 120rpx;
                    height: 120rpx;
                    text-align: center;
                    line-height: 120rpx;
                }

                &:nth-child(2) {
                    width: calc(93% - 160rpx);

                    text {
                        font-size: 28rpx;
                        font-weight: bold;

                        &:nth-child(3) {
                            font-size: 24rpx;
                            color: gray;
                        }
                    }
                }

                &:nth-child(3) {
                    width: 40rpx;
                    font-size: 25rpx;

                    >text {
                        color: gray;
                    }

                    ;
                }
            }
        }

        &:nth-child(2) {
            ::v-deep .u-button {
                border-radius: 0rpx;
                background-color: #2b85e4;
                height: 90rpx;
            }
        }

        //第二部分的订单列表
        &:nth-child(3) {
            padding: 0 0 20rpx 0;
            border-radius: 10rpx;

            >text {
                display: block;
                padding: 20rpx;
                font-weight: bold;

            }
        }


    }

}

.order {
    font-size: 30rpx;
    position: relative;
    left: 20rpx;
    width: calc(100% - 20rpx);
    padding-top: 30rpx;

    text {
        &:first-child {
            font-weight: bold;
            position: absolute;
            right: 40rpx;

        }

    }

    .wait {
        background: rgb(233, 64, 64);
        border-radius: 50rpx;
        color: white;
        padding: 5rpx 20rpx;
        font-weight: 100;
        font-size: 28rpx;
    }

    .money {
        color: rgb(255, 59, 59);
    }

}

//设置购物车

.card {

    height: 100rpx;

    >view {
        display: flex;
        position: fixed;
        flex-direction: row;
        align-items: center;
        height: 100rpx;

        background-color: #fff;
        z-index: 99;
        width: 100%;
        margin: 0;
        bottom: 0;
        padding: 0 0 0 20rpx;

        ::v-deep .u-button {

            position: absolute;
            right: 40rpx;

            border-radius: 50rpx;
            width: 200rpx;
            height: 70rpx;
            background-color: #2b85e4;

        }
    }
}

//设置图标样式
.icon-dingwei {
    font-size: 60rpx;
    color: red;
}

.popup {
    max-height: 50vh;
    overflow: scroll;
    width: 90%;
    margin: 0 auto;

    .item {


        margin-top: 20rpx;
        display: flex;
        align-items: center;
        box-shadow: 1rpx 1rpx 2rpx rgb(0, 0, 0, 0.08);

        >view:first-child {
            width: 90%;
        }

        >view:last-child {
            text-align: right;

            width: 10%;

        }

        &:last-child {
            padding: 20rpx 0;
        }
    }

}


.couponTitle {
    font-size: 35rpx;
}

.couppmoney {
    color: rgb(224, 70, 70);
    font-size: 40rpx;
    font-weight: bold;
}

.couppernDisc {
    font-size: 25rpx;
    color: orange;
}

.none {
    color: darkgray;
}
</style>
