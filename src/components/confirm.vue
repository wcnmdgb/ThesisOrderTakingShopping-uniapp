<template>
    <view>

        <u-checkbox-group>
            <view class="item" v-for="(item, index) in list" :key="index">
                <image :src="`${url.host}/file/image/${item.image}`" class="shour_images" />
                <view class="tabulation">
                    <view><text>{{ item.name }}</text></view>

                    <view><text>￥{{ item.money / 100 }}</text> &nbsp; <text>X&nbsp; {{
                        item.value }}</text></view>
                </view>
            </view>
        </u-checkbox-group>
    </view>
    <view v-if="list?.length === 0">
        <u-empty mode="data" />
    </view>
</template>
  
  
<script lang="ts" setup>

import { computed } from 'vue';
import type { tradeInterFace } from "@/interface/interface";
import url from "@/static/json/request";



//获取传递的标签
const props = defineProps<{
    list: tradeInterFace[],
}>();


//获取价格 和数量
const commodity = computed(() => {

    const array = props.list;


    let maney = 0;
    for (let i = 0; i < array.length; i++) {
        maney += parseFloat((array[i].money * array[i].value).toString());
    }
    maney = Number(maney.toFixed(3)) * 1000 / 1000
    maney === null ? 0 : maney;

    return { maney };
})


//传递到父组件中
defineExpose({ commodity });

</script>
  
<style lang="scss" scoped >
/**洗鞋列表 */
.item {
    border-radius: 20rpx;
    background-color: #ffff;
    display: flex;
    flex-direction: row;
    padding: 10rpx 0 10rpx 0;
    width: 100%;

    margin-bottom: 10rpx;

    &:not(:last-child) {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.07);
    }

}

/**鞋子图片的大小 */
.shour_images {
    width: 220rpx;
    height: 180rpx;
}

/**选择列表中的文字 */
.tabulation {
    width: calc(100% - 180rpx);
    margin-left: 20rpx;

    view {
        font-size: 32rpx;
        font-weight: bold;
        padding: 10rpx 0 20rpx 0;
    }

    view:nth-child(2) {
        font-size: 28rpx;
        color: red;
        padding: 5rpx 0 20rpx 0;

        font-weight: bold;

        >text:last-child {
            padding-left: 300rpx;
        }
    }
}
</style>
  
  
  