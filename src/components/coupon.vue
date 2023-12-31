<template>
    <view>

        <view v-for="(item, index) in props.list" class="item" :key="index">
            <view class="couponItem">
                <view class="couponTitle"> {{ item.xlxw_coupon.title }} </view>
                <view class="couppmoney">{{ item.xlxw_coupon.money / 100 }} <text style="font-size: 25rpx;">元</text></view>
            </view>
            <view class="couponItem">
                <view class="couppernDisc">满{{ item.xlxw_coupon.condition / 100 }}元立减</view>

                <view v-if="item.status == 0"><button class="button active" @click="jumpclassification()">去使用</button>
                </view>
                <view v-else><button class="button  no-active" disabled>已使用</button></view>
            </view>

        </view>

        <view v-if="props.list?.length === 0">
            <u-empty mode="data" />
        </view>
    </view>
</template>

<script lang="ts" setup>

import { jumpclassification } from "../api/jumpApi"
import type { couppon_userInterface } from "@/interface/interface";
//从父类获取到余额信息
const props = defineProps<{
    list: couppon_userInterface[]
}>()

</script>

<style lang="scss" scoped>
@import "../style/style.scss";

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

.button {

    line-height: 50rpx;
    width: 150rpx;
    height: 50rpx;
    font-size: 20rpx;
    color: #fff;
}

.no-active {
    background-color: rgb(136, 136, 136);
}

.active {
    background-color: rgb(255, 150, 22);
}
</style>
