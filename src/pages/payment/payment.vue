<template>
  <view>
    <topNav :title="title"></topNav>
    <view class="main">
      <view class="paymeny">
        <text>需支付</text>
        <text v-if="order">￥{{ order?.actual_payment as number / 100 }}</text>
        <text v-else>加载中</text>
        <text v-if="orderId" @click="jumpOrderDetails(orderId, 0)">订单详情 ></text>
      </view>

      <view>

        <text class="u-block__title">选择支付方式</text>
        <u-radio-group v-model="radiovalue1" placement="column" @change="groupChange" iconPlacement="right">
          <view v-for="(item, index) in list" :key="index" class="item">

            <view style="width: 120rpx;"> <text :class="item.icon"></text></view>
            <view style="width: 220rpx;"><text>{{ item.name }}</text></view>
            <view style="width: calc(100% - 340rpx)"> <u-radio :name="item.value" @change="radioChange">
              </u-radio></view>
          </view>

        </u-radio-group>
      </view>
      <view> <u-button type="primary" @click="subPayment">立即支付</u-button></view>
    </view>
  </view>
</template>
<script lang="ts" setup>

import { ref, reactive, onMounted } from "vue";
import topNav from "../../components/navbar.vue"; //引入组件
import { onLoad } from "@dcloudio/uni-app";
import { jumpOrderDetails, jumpshoeWashing, jumpShoeRed } from "@/api/jumpApi";
import { findOrder, payment } from "@/api/getApi";
import type { orderInterface } from "@/interface/interface";
import { debounce } from "@/utils/antishake";
import store from "@/store/index";
import { tryFun } from "@/utils/tryFun";

const toast = reactive({
  message: "",
  type: ""
})

const title = ref("收银台");
//价格
const money = ref();
const orderId = ref();



onLoad((options: any) => {
  money.value = options.money;
  orderId.value = options.orderId;


  if (orderId.value) {
    getOrder(orderId.value);
  }
  list.value = [{ name: "微信支付", disabled: true, value: 0, icon: "iconfont icon-weixinzhifu2" }
    , { name: "余额支付", value: "1", disable: false, icon: "iconfont icon-caiyouduo_zhifu-qianbaozhifu" }
  ]

})

const order = ref<orderInterface>();


//支付方式
const list = ref();

const radiovalue1 = ref<number>(0);

//修改选中框中的内容
const groupChange = (n: any) => {
  // console.log('groupChange', n);
}
const radioChange = (n: any) => {
  // console.log('radioChange', n);
}

const getOrder = async (orderId: number) => {
  tryFun(async () => {
    uni.showLoading({
      title: '加载中',
      mask: true,
    });
    const { data } = await findOrder(orderId, 0)
    order.value = data;
  }, () => { uni.hideLoading(); }, "获取订单异常");
}

//此处防抖
const subPayment = () => {

  debounce(async () => {
    if (radiovalue1.value === undefined) {
      toast.type = "error"
      toast.message = "请选择支付方式";
      store.commit("setToast", toast)
    } else if (radiovalue1.value === 0) {

      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: order.value?.order.timeStamp,
        nonceStr: order.value?.order.nonceStr,
        package: order.value?.order.package,
        signType: order.value?.order.signType,
        paySign: order.value?.order.paySign,
        success: function (res) {
          toast.type = "success";
          toast.message = "支付完成";
          store.commit("setToast", toast);
          jumpShoeRed(1);
        },
        fail: function (err) {
          toast.message = "买家取消支付";
          toast.type = 'error';
          store.commit('setToast', toast);
        }
      });

    } else if (radiovalue1.value == 1) {
      paySuccess();
    }


  }, 300)

}

const paySuccess =() => {
  tryFun(async () => {
    const { msg, code } = await payment(radiovalue1.value, orderId.value);

    if (code ==='000') {
      toast.type = "success";
      toast.message = msg;
      store.commit("setToast", toast);
      jumpShoeRed(1);
    }
  }, () => { }, "支付异常");
}
</script>
<style lang="scss" scoped>
@import "../../style/style.scss";

.main {

  display: flex;
  align-items: center;
  flex-direction: column;


  >view {
    width: 90%;
    font-weight: bold;
    position: relative;
    margin: 40rpx 5% 0 5%;

    &:nth-child(1) {
      display: flex;
      flex-direction: column;
      padding-top: 20px;
      text-align: center;

      >text {
        font-size: 25rpx;

        &:nth-child(1) {

          color: rgba(0, 0, 0, 0.6);
        }

        &:nth-child(2) {
          font-size: 60rpx;
          padding: 20rpx;
        }

        &:nth-child(3) {
          color: red;
        }
      }
    }

    //支付方式的元素
    &:nth-child(2) {
      background-color: #fff;
      border-radius: 10rpx;
      padding: 40rpx 20rpx 0 20rpx;
      font-size: 30rpx;
      color: rgba(0, 0, 0, 0.8);

      ::v-deep .u-radio {
        padding: 30rpx;
      }
    }

    &:nth-child(3) {
      padding: 30rpx 0 30rpx 0;


    }

  }
}

.item {
  display: flex;
  flex-direction: row;
  width: 100%;
  text-align: center;
  align-items: center;

  .iconfont {

    text-align: center;
  }

  .icon-weixinzhifu2 {
    font-size: 70rpx;
    color: rgb(15, 183, 93);

  }

  .icon-caiyouduo_zhifu-qianbaozhifu {
    font-size: 85rpx;
    color: rgb(224, 70, 9);
  }
}




::v-deep .u-button {
  color: #fff;
  background-color: #2b85e4;
}
</style>
