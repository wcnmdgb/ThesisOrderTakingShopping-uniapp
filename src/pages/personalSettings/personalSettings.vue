<template>
    <view >
        <topNav :title="title"></topNav>
        <view class="main">
            <view class="tags">
                <view class="item">
                    <view>头像</view>
                    <view @click="changeImages()">
                        <image v-if="src === undefined" style=" background-color: rgba(0, 0, 0, 0.2);"></image>
                        <image v-else :src="src"></image>
                    </view>
                    <view><text class="iconfont icon-xiangyou1" /></view>
                </view>
                <view class="item" @click="jumpChangerUser('nickName')">
                    <view>昵称</view>
                    <view>信息</view>
                    <view><text class="iconfont icon-xiangyou1" /></view>
                </view>

            </view>
            <view class="tags">
                <view>
                    <view class="item" @click="jumpChangerUser('userName')">
                        <view>姓名</view>
                        <view>姓名</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                    <view class="item" @click="jumpChangerUser('phone')">
                        <view>手机号</view>
                        <view>信息</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                    <view class="item" @click="jumpChangerUser('sex')">
                        <view>性别</view>
                        <view>未知</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                    <view class="item" @click="jumpChangerUser('birthday')">
                        <view>生日</view>
                        <view>未知</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                </view>
            </view>
            <view class="tags">
                <view>
                    <view class="item">
                        <view>收货地址</view>
                        <view>未知</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                </view>
            </view>
            <view class="tags">
                <view>
                    <view class="item">
                        <view>切换账号</view>
                        <view>未知</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                </view>
            </view>
            <view class="tags">
                <view>
                    <view class="item">
                        <view>退出登陆</view>
                        <view>未知</view>
                        <view><text class="iconfont icon-xiangyou1" /></view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { changeImages } from "@/api/changerUserApi";
import topNav from "@/components/navbar.vue"; //引入组件

import { jumpChangerUser } from "@/api/jumpApi";


import { ref, reactive } from "vue";

const title = ref("个人设置");

//测试使用的头像
const src = ref();

//上传头像信息

</script>

<style lang="scss" scoped>
@import url("../../style/style.scss");

.main {
    width: 95%;
    
    margin: 20rpx 2.5% 0 2.5%;

    .tags {

        background-color: #fff;
        margin-top: 20rpx;
        border-radius: 10rpx;
    }
}

.item {
    margin: 0 20rpx 0 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20rpx;

    &:not(:last-child) {

        border-bottom: 1rpx solid rgb(221, 221, 221);
    }

    >view {

        font-size: 25rpx;

        &:nth-child(1) {
            font-size: 28rpx;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.5);
            width: 150rpx;
            text-align: left;
        }

        &:nth-child(2) {
            width: calc(100% - 210rpx);
            text-align: right;
        }

        &:last-child {
            width: 60rpx;
            text-align: center;
        }
    }

}

image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;

}
</style> 