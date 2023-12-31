<template>
    <view>
        <topNav :title="title"></topNav>

        <view> </view>
        <view class="main">
            <image src="../../static/qrCode.jpg" class="qrcode" />
            <view class="item">
                <view>
                    <view>焕新洗护鞋来鞋网</view>
                    <view>1.欢迎来到鞋来鞋往分享界面。</view>
                    <view>2.点击分享按钮可以将小程序分享好友吧</view>
                    <view>3.使用二维码让好友扫一扫加入吧</view>
                </view>
            </view>
            <View class="buttonGroup">
                <button open-type="share">分享链接</button>
            </View>
        </view>
    </view>
</template>

<script lang="ts" setup>
import topNav from "../../components/navbar.vue"; //引入组件
import { ref, reactive } from "vue";


const title = ref("分享海报");

const popup = reactive({
    show: false,

})

</script>

<style lang="scss" scoped>
.main {
    position: relative;
    width: 100vw;
    height: 140vw;
    background-size: 100% 100%;
    background-image: url("https://xlxwhxxh.cn/file/image/share.jpg");
    background-repeat: no-repeat;

    .qrcode {
        position: absolute;
        width: 14vw;
        height: 14vw;
        top: 122vw;
        left: 79vw;

    }

    .item {
        position: relative;
        top: 142vw;
        height: calc(100vh - 280rpx - 142vw);
        background: linear-gradient(#ecf7ff, rgb(244, 242, 242)9a9);
        width: 100%;

        >view {
            margin: 0 5%;

            >view:first-child {
                border-bottom: 2px solid #a9a9a9;
                font-size: 30rpx;
                height: 5vh;
                line-height: 5vh;
                font-weight: bold;

            }

            >view:not(:first-child) {
                padding-top: 2vw;
                font-size: 25rpx;
            }

        }

    }

    .buttonGroup {
        height: 140rpx;
        position: fixed;
        background: linear-gradient(#dddddd, #ffffff);
        bottom: 0;
        z-index: 99;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        >button {
            height: 80rpx;
            line-height: 80rpx;
            width: 80%;
            margin: 0 10%;

            background: linear-gradient(90deg, #4ac8f9, #fcf766);
            border-radius: 50px;
            color: #fff;
        }
    }
}
</style>