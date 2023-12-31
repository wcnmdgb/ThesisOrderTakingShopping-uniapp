<template>
    <view>
        <topNav :title="title"></topNav>
        <view class="main">
            <view>
                请输入兑换码进行兑换

            </view>
            <view>
                <input placeholder="请输入您的兑换码">
            </view>
            <button>立即兑换</button>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import topNav from "../../components/navbar.vue"; //引入组件
const title = ref("兑换中心");
</script>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    align-items: center;

    >view {
        margin-top: 120rpx;

        &:nth-child(2) {
            padding: 20rpx;
            width: 85%;
            background-color: #fff;
        }
    }

    button {
        margin-top: 120rpx;
        background-color: red;
        color: #fff;
        width: 90%;
    }
}
</style>