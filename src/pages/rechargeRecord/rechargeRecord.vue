<template>
  <view class="main">
    <topNav :title="title"></topNav>
    <view>
      <u-tabs :list="titleList" :activeStyle="{ color: '#303133', fontWeight: 'bold', transform: 'scale(1)' }"
        :inactiveStyle="{ color: '#606266', transform: 'scale(0.9)' }" :scrollable="false" @click="recharge"></u-tabs>
    </view>

    <view>
      <balance :list="list"></balance>
    </view>

  </view>
</template>
<script lang="ts" setup>
import topNav from "@/components/navbar.vue"; //引入组件
import { ref, onMounted } from "vue";
import type { Xlxw_blance } from "@/interface/interface"
import balance from "@/components/balance.vue";
import { findbanlance } from "@/api/getApi";
import { tryFun } from "@/utils/tryFun";

const title = ref("余额明细");

const titleList = ref([{ name: "余额明细", status: undefined }, { name: "充值记录", status: 0 }, { name: "付款记录", status: 1 }])

const list = ref<Xlxw_blance[]>([])

const getBanbance = async (status: number | undefined) => {
  tryFun(async () => {
    const { data } = await findbanlance(status);
    list.value = data;
  }, () => { }, "获取余额异常")
}
const recharge = async (item: any) => {

  getBanbance(item.status);

}

onMounted(() => {
  getBanbance(undefined);
})


// queryBanlance(0);


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

  background-color: #ffffff;
  z-index: 99;
  position: fixed;
  height: 100rpx;
  width: 100%;
}
</style>
