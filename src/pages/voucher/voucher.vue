<template>
    <view>
        <topNav :title="title"></topNav>
        <view class="main">
            <view v-for="(item, index) in couponList" :key="index" class="item">
                <view class="couponItem">
                    <view class="couponTitle"> {{ item.title }} </view>
                    <view class="couppmoney">{{ item.money / 100 }} <text style="font-size: 25rpx;">元</text></view>
                </view>
                <view class="couponItem">
                    <view class="couppernDisc">满{{ item.condition / 100 }}元立减</view>
                    <view v-if="determine(item.xlxw_coupon_users)"><button class="active"
                            @click="SeizeCoupons(item)">领取</button></view>
                    <view v-else><button class="no-active">已领取</button>
                    </view>
                </view>
            </view>
            <view v-if="couponList?.length === 0">
                <u-empty mode="data" />
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import topNav from "../../components/navbar.vue"; //引入组件
import { ref, onMounted, reactive } from "vue";
import { findCoupon, seizeCoupons } from "@/api/getApi";
import type { xlxw_coupon_interface, Xlxw_coupon_user } from "@/interface/interface";
import { findData } from "@/utils/local";
import store from "@/store/index";
import { debounce } from "@/utils/antishake";
import { tryFun } from "@/utils/tryFun";

const toast = reactive({
    message: "",
    type: "success"
})

const title = ref("领券中心");

const couponList = ref<xlxw_coupon_interface[]>([]);

const loginId = ref();



const getUserId = async () => {
    const res = await findData('userId');
    loginId.value = res;

}

const queryFindCoupon = async () => {
    tryFun(async () => {
        const { data } = await findCoupon();
        couponList.value = data;
    }, () => { }, "获取券异常");

}


//判断用户是否领券
const determine = (item: Xlxw_coupon_user[]) => {
    const list = item.filter(ite => {
        return ite.user_id == loginId.value;
    })
    return list.length === 0 ? true : false

}


const SeizeCoupons = (item: xlxw_coupon_interface) => {
    tryFun(() => {
        debounce(async () => {
            const { msg } = await seizeCoupons(item.id);
            queryFindCoupon();
            toast.message = msg;
            store.commit("setToast", toast);
        }, 300);
    }, () => { }, "抢券异常");

}






onMounted(() => {
    getUserId();
    queryFindCoupon();
})

</script>
<style lang="scss" scoped>
.main {
    width: 95%;
    margin: 0 2.5% 0 2.5%;
}

.item {

    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin-top: 20rpx;
    border-radius: 20rpx;


    >view {
        width: 90%;
        margin: 0 5% 0 5%;
        padding: 10rpx 0 10rpx 0;

        &:not(:last-child) {
            border-bottom: 1rpx solid rgba(0, 0, 0, 0.02);
        }
    }
}

.couponItem {
    display: flex;
    flex-direction: row;

    >view:nth-child(1) {
        width: calc(100% - 150rpx);
    }

    >view:nth-child(2) {
        text-align: center;
        width: 150rpx;
    }

    button {
        line-height: 50rpx;
        width: 150rpx;
        height: 50rpx;
        font-size: 20rpx;
        color: #fff;
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

.no-active {
    background-color: rgb(136, 136, 136);
}

.active {
    background-color: rgb(255, 150, 22);
}
</style>