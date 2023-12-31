<template>
  <view>
    <view class="navbar">
      <view class="title" v-if="title === 'main' && !black">
        <view>鞋来鞋往</view>
      </view>
      <view v-else-if="!black" class="title"><text class="iconfont icon-shouye2" @click="jumpMain"></text>{{ title }}
      </view>
      <view v-else class="title"><text class="iconfont icon-xiangzuo" @click="jumpBack"></text>{{ title }}</view>
    </view>

    <view style="height: 160rpx"></view>
    <u-toast ref="utoast" ></u-toast>
  </view>
</template>
<script lang="ts" setup>
import { ref, watch, reactive, watchEffect } from "vue";
import store from "@/store/index";
import { debounce } from "@/utils/antishake";
const utoast = ref();
const toast = reactive({ message: undefined, type: undefined });
const newStore = store.state.toast;
const black = ref(true);



//获取父类传递的信息
const props = defineProps<{
  title: String
}>();
//跳转到主界面
const jumpMain = () => {
  uni.switchTab({
    url: "../index/index",
  });
}

watch(newStore, async (newvalue) => {
  if (newvalue.type != undefined) {
    await utoast.value.show({
      type: newvalue.type,
      message: newvalue.message
    })
    store.commit("setToast", toast);
  }
});


let pages;
watchEffect(() => {
  pages = getCurrentPages();
  const { route } = pages[pages.length - 1];
  if (route === 'pages/myPage/myPage' || route === 'pages/order/order' || route === 'pages/classification/classification' || route === 'pages/index/index') {
    black.value = false;
  }

})

const jumpBack = () => {
  let count = pages.length - 2;

  if (count <= 0) {
    uni.switchTab({
      url: "../classification/classification",
    });
  } else {
    uni.navigateBack({ delta: pages.length - 2 });
  }

}

</script>
 
<style lang="scss" scoped>
@import url("../style/style.scss");

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  color: #fff;
  background-color: #2b85e4;
  z-index: 99;
  height: 160rpx;
}

.title {
  position: absolute;
  top: 80rpx;
  left: 30rpx;

  .iconfont {
    padding-right: 10rpx;
  }
}
</style>