<template>
    <view>
        <topNav :title="title"></topNav>
        <view class="memberInformation">
            <view>
                <image>头像</image>
            </view>
            <view>
                <view>名称</view>
                <view>会员</view>
                <view>到期时间：永久</view>
            </view>

        </view>

        <view class="buttonGroup">
            <view>您到达最高可升级的级别</view>
            <view><button>开通会员</button></view>

            <view><button @click="jumpExchange">兑换会员</button></view>
        </view>

        <view class="bottom">
            <view>-等级特权-</view>
            <view class="item">1.享受消费送积分，积分可以抵扣金额，兑换礼品，参与抽奖活动</view>
            <view class="item">2.购买商品享受上传优惠价格</view>
            <view class="item">3.免费领取优惠券，购买商品直接抵扣</view>
            <view class="item">4.更多优惠券活动随时关注平台更新</view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { jumpExchange } from "@/api/jumpApi";
import topNav from "../../components/navbar.vue"; //引入组件
import { ref } from "vue";
const title = ref("等级说明");
</script>

<style lang="scss" scoped>
//设置描述信息
.memberInformation {
    display: flex;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.6);
    align-items: center;

    >view {

        &:nth-child(1) {
            width: 250rpx;
            height: 200rpx;


            image {
                margin: 30rpx 10rpx 10rpx 80rpx;
                width: 150rpx;
                height: 150rpx;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
            }
        }

        &:nth-child(2) {
            color: #fff;

            >view:nth-child(2) {
                font-size: 20rpx;
                color: rgba(245, 196, 18);
            }

            >view:nth-child(3) {
                font-size: 20rpx;
            }
        }
    }
}

//设置按钮组
.buttonGroup {
    padding-top: 50rpx;

    >view {
        button {
            height: 90rpx;
            font-size: 40rpx;
            font-weight: 500;
            line-height: 90rpx;
        }

        width: 80%;
        margin: 30rpx 10%;

        &:first-child {
            color: rgba(245, 196, 18);
            font-size: 30rpx;
        }

        &:nth-child(2) {

            button {
                color: #fff;
                background-color: #026cf6;
            }
        }

        &:nth-child(3) {
            button {

                color: #fff;
                background-color: rgb(110, 16, 249);
            }
        }

    }
}

//底部信息
.bottom {
    margin-top: 40rpx;
    padding-top: 20rpx;
    background-color: #fff;
    font-size: 18prx;
    line-height: 50rpx;

    >view {
        margin-top: 10rpx;
        &:first-child {
            font-size: 35rpx;
            font-weight: bold;
            text-align: center;
        }

    }
}

.item {
    font-size: 25rpx;
}
</style>