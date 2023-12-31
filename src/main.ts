import { createSSRApp } from "vue";
import store from '@/store/index'

import uviewPlus from 'uview-plus'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import App from "./App.vue";


export function createApp() {


  const app = createSSRApp(App);
  app.mixin({
    onShareAppMessage() {
      return {
        title: '焕新洗护鞋来鞋往',
        path: '/pages/index/index',
        imageUrl: ''
      }
    },
    onShareTimeline() {
      return {
        title: '焕新洗护鞋来鞋往',

        // imageUrl: '',
      }
    }
    
  });

  app.use(uviewPlus)
  app.use(store)

  return {
    app,
  };
}






