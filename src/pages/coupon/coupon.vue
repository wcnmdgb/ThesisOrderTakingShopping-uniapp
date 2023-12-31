<template>
    <view class="main">
        <topNav :title="title"></topNav>
        <view>
            <u-tabs :list="titleList" :scrollable="false"
                :activeStyle="{ color: '#303133', fontWeight: 'bold', transform: 'scale(1)' }"
                :inactiveStyle="{ color: '#606266', transform: 'scale(0.9)' }" @click="getTypeUserCoupon"></u-tabs>
        </view>
        <view>
            <coupon :list="coupponUserList"></coupon>
        </view>
    </view>
</template>
<script lang="ts" setup>
import topNav from "@/components/navbar.vue"; //引入组件
import coupon from "@/components/coupon.vue";
import type { couppon_userInterface } from "@/interface/interface";

import { getUserCoupon } from "@/api/getApi";
import { ref, onMounted } from "vue";
import { tryFun } from "@/utils/tryFun";

const title = ref("我的优惠券");

interface titleList {
    name: string,
    status: number | undefined
}
const coupponUserList = ref<couppon_userInterface[]>([]);

const titleList = ref<titleList[]>([{ name: "全部", status: undefined }, { name: "未使用", status: 0 }, { name: "已使用", status: 1 }])



const getTypeUserCoupon = (item: titleList) => {
    queryGetUserCouppon(item.status);
}


const queryGetUserCouppon = async (status: number | undefined) => {
    tryFun(async () => {
        const { data } = await getUserCoupon(status, undefined)
        coupponUserList.value = data;
    }, () => { }, "获取优惠券异常");
}



onMounted(() => {
    queryGetUserCouppon(undefined);
})




//此处需要从后台获取
const list = ref()
</script>
<style lang="scss" scoped>
.main {


    >view:nth-child(2) {
        height: 100rpx;


    }

    >view:nth-child(3) {
        width: 95%;
        margin: 0 2.5% 0 2.5%;
        z-index: 1;
    }
}

::v-deep .u-tabs {
    width: 100%;
    background-color: #ffffff;
    position: fixed;
    height: 100rpx;
    z-index: 99;
}
</style>
  