<template>
  <view>
    <topNav :title="title"></topNav>
    <view class="main">
      <u-list @scrolltolower="findallDraw">
        
        <u-list-item v-for="(item, index) in list" :key="index">
          <view class="compare">
            vs
          </view>
          <!-- <view class="bgc"></view>
          <view class="title">洗护对比</view> -->
          
          <image :src="`${url.host}/file/image/${item.image}`"></image>
          <view class="message">
            <view>旧</view>
            <view>新</view>
          </view>
         
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>




<script lang="ts" setup>
import topNav from "../../components/navbar.vue"; //引入组件
import { ref, reactive } from "vue";
import { findDraw } from '@/api/getApi';
import { onMounted } from "vue";
import { tryFun } from "@/utils/tryFun"
import type { drawInterface } from "@/interface/interface";
import url from "@/static/json/request";

const title = ref("洗护说明");
const query = reactive({ index: 1, status: 0, total: 10 });
const list = ref<drawInterface[]>([]);

const windowInfo = uni.getWindowInfo();
const width = ref(windowInfo.screenWidth);

const findallDraw = async () => {
  tryFun(async () => {
    if ((query.index * 10 - query.total as number) < 10) {

      uni.showLoading({
        title: '加载中',
        mask: true,
      });

      const { data: { rows, count } } = await findDraw(query.index, query.status);

      let row = list.value;

      list.value = row.concat(rows);
      query.total = count;
      query.index++;
    } else {
      console.log("到底了")
    }

  }, () => {
    uni.hideLoading();
  }, "获取图片异常");
}


onMounted(() => {
  findallDraw();
})
</script>
<style lang="scss" scoped>
.main {
  background-color: #f3f3f3;

  ::v-deep .u-list-item {
    position: relative;
    background-color: #fff;
    width: 95%;
    margin: 0 2.5% 2.5% 2.5%;
    // height: 75vw;
      height: 60vw;
  }


  image {
    width: 95%;
    height: 45vw;
    margin: 30rpx auto 20rpx auto;
  }
}

.message {
  display: flex;
  text-align: center;
  padding-bottom: 30rpx;

  >view {
    font-size: 35rpx;
    font-weight: bold;
    color: #6a6a6a;

    &:first-child {
      width: 50%;
    }

    &:last-child {
      width: 50%;
    }
  }

}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #4a4a4a;
  margin: 30rpx auto 20rpx auto;
  z-index: 2;
}

.bgc {
  width: 100rpx;
  height: 25rpx;
  left: calc( (100% - 100rpx)/2);  
  background-color: #b6fafd;
  border-radius: 30rpx;
  position: absolute;
  top: calc(35rpx + 2.5vw);
  margin: 0 auto;
  z-index: 1;
  box-shadow: 0 0 30rpx #a3f8fb;
}

.compare {
  position: absolute;
 
  left: calc( (100% - 80rpx)/2);  
  // top:calc( 75vw/2);
  top:calc( 50vw/2);
  width: 80rpx;
  height: 50rpx;
  color: #fff;
  background: linear-gradient(90deg, #06c2fc, #10f8c6);
  text-align: center;
  line-height: 50rpx;
  border-radius: 50px;
  font-weight: bold;
  font-size: 40rpx;
}
</style>