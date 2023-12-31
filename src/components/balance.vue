<template>
    <view>
        <view v-for="(item, index) in props.list" class="item" :key="index">
            <view class="banlanItemRow">
                <view>用户{{ timeFilters(item.status) }}</view>
                <view>{{ formatdate(item.create_time) }}</view>
            </view>
            <view> {{ andOrSub(item.status) }} {{ item.money / 100 }}</view>
        </view>
        <view v-if="list?.length === 0">
            <u-empty mode="data" />
        </view>
    </view>
</template>

<script lang="ts" setup>
import { banlanMap, anOrSubMap } from "../static/json/typeMap";
import type { Xlxw_blance } from "@/interface/interface"
import { formatdate } from "../utils/dayjs"

const props = defineProps<{
    list: Xlxw_blance[]
}>();


//过滤替换状态
const timeFilters = (item: number) => {
    return banlanMap.get(item);
}

const andOrSub = (item: number) => {
    return anOrSubMap.get(item);
}

</script>

<style lang="scss" scoped>
@import "../style/style.scss";

.item {
    display: flex;
    background-color: #fff;
    margin-top: 10rpx;
    border-radius: 10rpx;
    flex-direction: row;
    align-items: center;
    padding: 40rpx 20rpx;

    >view:nth-child(1) {
        width: 400rpx;
    }

    >view:nth-child(2) {
        width: calc(100% - 200rpx);
        text-align: right;
        color: rgb(255, 14, 14);
        font-size: 40rpx;
    }

    &:not(:last-child) {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.03);
    }
}

.banlanItemRow {
    view:nth-child(2) {
        padding-top: 10rpx;
        color: #b8b8b8;
        font-size: 24rpx;
    }
}
</style>