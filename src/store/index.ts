import { createStore } from 'vuex'
import type { tradeInterFace, totasInterface, xlxw_user } from "@/interface/interface";
import { cleanData } from '@/utils/local';



const store = createStore({
    state: {
        //存储订单
        commodityList: [] as tradeInterFace[],
        //存储user信息
        user: {
            "vip": true
        },
        toast: {
            type: "",
            message: "",
        } as totasInterface,
        userInfo: {} as xlxw_user | undefined,


    },
    getters: {

    },
    mutations: {

        setUserInfo(start, item) {
            start.userInfo = item;
        },
        clearUserInfo(start) {
            start.userInfo = undefined;
        },


        setToast(state, item) {
            state.toast.message = item.message;
            state.toast.type = item.type;
        },
        setList(state, list: tradeInterFace[]) {
            state.commodityList = list;
        },
        //添加
        addItem(state, item: tradeInterFace) {
            state.commodityList.push(item);
        },
        //修改
        updateItem(state, item: tradeInterFace) {
            let bol = true;
            //改list值
            state.commodityList.map((v, i) => {
                if (v.id === item.id) {
                    v.value = item.value;
                    bol = false;
                    return;
                }
            });

            //
            if (bol) {
                state.commodityList.push(item);
            }

        },
        //判断是否存在相同的值 
        setListValue(state, list: tradeInterFace[]) {
            list.filter(ite => {
                state.commodityList.map((v, i) => {
                    if (ite.id === v.id) {
                        ite.value = v.value;
                    }
                })
            })

            let newList = list.filter(item => !state.commodityList.some(x => x.id === item.id));

            newList.filter(item => {
                item.value = 0;
            })

        },
        //删除
        deltetItem(state, item: tradeInterFace) {
            state.commodityList.map((v, i) => {
                if (v.id == item.id) {
                    state.commodityList.splice(i, 1)
                }
            })
        },
        //清除缓存
        clearList() {
            store.state.commodityList.length = 0;
        }

    },
    actions: {

    },
    modules: {

    }
})

export default store
