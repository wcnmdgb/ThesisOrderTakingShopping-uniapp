<template>
  <view>
    <topNav :title="title"></topNav>
    <view class="main">
      <view>
        <u-tabs :list="titleList" :current="orderData.status"
          :activeStyle="{ color: '#303133', fontWeight: 'bold', transform: 'scale(1)' }"
          :inactiveStyle="{ color: '#606266', transform: 'scale(0.9)' }" @click="switchTab"> </u-tabs>
      </view>
      <view></view>
      <view>
        <order :list="orderlist" @findAll="findAll"></order>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import topNav from "../../components/navbar.vue"; //引入组件
import order from "../../components/order.vue";
import {  findAllOrder } from "@/api/getApi";
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive } from "vue";
import type { Orderdetails } from "@/interface/interface";
import { debounce } from '@/utils/antishake';

const title = ref("洗鞋订单列表");

interface orderDateInterface {
  index: number,
  status: number | undefined;
}

const orderData = reactive<orderDateInterface>({
  index: 1,
  status: 0
})
//订单列表
const orderlist = ref<Orderdetails[]>([])

const total = ref<number>(10);

onLoad((options: any) => {
  let status = options.active === undefined ? undefined : Number(options.active)
  orderData.status = status;
  orderData.index = 1;
  findAll();
})

interface tabInterface {
  name: string;
  status: number | undefined;
}



const titleList = ref<tabInterface[]>([
  // { name: "全部", status: undefined },
  { name: "待付款", status: 0 },
  { name: "待取货", status: 1 },
  { name: "清洗中", status: 2 },
  { name: "配送中", status: 3 },
  { name: "已完成", status: 4 },
  { name: "已收货", status: 5 },
  { name: "已取消", status: 6 }
])


const switchTab = (item: tabInterface) => {
  orderData.status = item.status;
  orderData.index = 1;
  orderlist.value = [];
  total.value = 10;
  findAll();
}


const findAll = async () => {
  try {
    if ((orderData.index * 10 - total.value as number) < 10) {
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      const { data: { rows, count } } = await findAllOrder(orderData.index, orderData.status);
      let list = orderlist.value;
      orderlist.value = [];
      orderlist.value = list.concat(rows);
      total.value = count;
      orderData.index++;
      debounce(() => {
        uni.hideLoading();
      }, 500)
    } else {
      console.log("到底了");
    }
  } catch (e) {
    console.log("获取订单异常" + e);
  }
}
</script>


<style scoped lang="scss">
.main {


  >view {
    &:nth-child(1) {
      width: 100%;
      background-color: #fff;
      position: fixed;
      z-index: 99;
    }

    &:nth-child(2) {
      height: 80rpx;
    }

    &:nth-child(3) {
      width: 95%;
      margin: 10rpx 2.5% 0 2.5%;
    }
  }
}
</style>


