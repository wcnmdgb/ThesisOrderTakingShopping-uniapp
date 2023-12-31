<template>
    <view>
        <toNav :title="title"></toNav>
        <view class="main">
            <u-form ref="formRef" :model="data" :rules="rules" labelWidth="90">

                <u-form-item label="收货人姓名" prop="consigneeName">
                    <u-input type="text" v-model="data.consigneeName" placeholder="请输入姓名" border="none" />
                </u-form-item>
                <u-form-item label="手机号" prop="phone">
                    <u-input type="text" v-model="data.phone" placeholder="请输入手机号" border="none" />
                </u-form-item>
                <u-form-item label="选择楼栋号" prop="dormitoryNumber">
                    <u-input type="text" v-model="data.dormitoryNumber" placeholder="选择楼栋号" border="none" />
                </u-form-item>
                <u-form-item label="选择寝室号" prop="louNumber">
                    <u-input type="text" v-model="data.louNumber" placeholder="选择寝室号" border="none" />
                </u-form-item>
                <u-form-item label="默认地址" prop="checked" @click="showChecked = true;">
                    <u-radio-group v-model="data.checked" placement="row" @change="groupChange">
                        <u-radio :customStyle="{ marginLeft: '5vm' }" v-for="(item, index) in actions" :key="index"
                            :label="item.name" :name="item.value" dis>
                        </u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item>
                    <u-textarea type="text" v-model="data.desc" placeholder="请输入描述" border="none" />
                </u-form-item>
            </u-form>

            <button class="u-button" @click="submitInfo" v-if="editShow === false">保存</button>
            <button class="u-button" @click="editmitInfo" v-else>修改</button>
        </view>

    </view>
</template>

<script lang="ts" setup>

import toNav from "../../components/navbar.vue";
import { ref, reactive, inject, watch, onMounted } from "vue";
import { createAddr, cgeAddr } from "@/api/getApi";
import store from "@/store/index";
import { jumpHarvestAddress, jumpConfirmOrder } from "@/api/jumpApi";
import { tryFun } from "@/utils/tryFun";


const title = ref("编辑收货地址")


const toast = reactive({
    message: "",
    type: "success"
})

const editShow = ref(false);

const formRef = ref(null);

const showChecked = ref(false);

const editRes = uni.getStorageSync("editRes");

interface subAddr {
    id: number,
    desc: string,
    dormitoryNumber: string,
    consigneeName: string,
    checked: number,
    louNumber: string,
    phone: number | undefined
}

interface checked {
    name: string,
    value: number;
    disabled: boolean
}

const data = reactive<subAddr>({
    id: 0,
    desc: "",
    dormitoryNumber: "",
    consigneeName: "",
    checked: 0,
    louNumber: "",
    phone: undefined
})

//查询是否编辑
const defaultData = () => {

    if (editRes != '') {
        data.id = editRes.id;
        data.desc = editRes.desc
        data.checked = editRes.checked;
        data.louNumber = editRes.lou_number;
        data.phone = editRes.phone;
        data.dormitoryNumber = editRes.dormitory_number;
        data.consigneeName = editRes.consignee_name;
        editShow.value = true;
        uni.removeStorageSync('editRes');
    }
}



const actions = ref<checked[]>([{ name: '默认', value: 0, disabled: true }, { name: '不默认', value: 1, disabled: false, }])

const rules = reactive({

    desc: [{
        type: 'string',
        required: true,

        message: '请填写描述',
        trigger: ['blur']
    },{
        required: true,
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
    }],
    phone: [{
        required: true,
        pattern: /^1[3-9]\d{9}$/,
        message: '请填写正确的手机号',
        trigger: ['blur']
    }, {
        required: true,
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
    }],
    louNumber: [{
        type: 'string',
        required: true,
        message: '请填写宿舍号',
        trigger: ['blur']
    },
    {
        type: 'string',
        required: true,
        max: 5,
        message: '输入1-5个字符',
        trigger: ['blur']
    },{
        required: true,
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
    }],
    checked: {
        type: 'number',
        required: true,
        message: '默认地址',
        trigger: ['blur']
    },
    consigneeName: [{
        type: 'string',
        required: true,
        message: '收货人名称',
        trigger: ['blur']
    },{
        required: true,
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
    }],
    dormitoryNumber: [{
        type: 'string',
        required: true,
        message: '楼栋号',
        trigger: ['blur']
    },
    {
        type: 'string',
        required: true,
        max: 5,
        message: '输入1-5个字符',
        trigger: ['blur']
    },{
        required: true,
        pattern: /^[^\s]*$/,
        message: '禁止输入空格',
    }]
})

const submitInfo = async (param: any) => {
    formRef.value?.validate()
        .then(async (res: any) => {
            //使用添加

            const { msg, code } = await createAddr(data.phone, data.dormitoryNumber, data.louNumber, data.desc, data.consigneeName, data.checked)
            toast.message = msg;
            // jumpHarvestAddress();
            if (code == '000') {
                toast.type = "success";
                store.commit("setToast", toast);
                const pages = getCurrentPages();
                let bool = false;
                pages.forEach(page => {
                    const { route } = page;
                    if (route === 'pages/confirmOrder/confirmOrder') {
                        bool = true;
                        return
                    }
                });

                if (bool) {
                    jumpConfirmOrder();
                } else {
                    jumpHarvestAddress();
                }
            } else {

                toast.type = "error";
                store.commit("setToast", toast);
            }

        })
        .catch((err: any) => {
            console.log('表单错误信息：', err);

        });
};


const groupChange = (e: number) => {
    data.checked = e;
    formRef.value?.validateField('data.checked')
}

const editmitInfo = async (param: any) => {
    formRef.value?.validate()
        .then(async (res: any) => {
            tryFun(async () => {
                const { msg, code } = await cgeAddr(data.id, data.phone, data.dormitoryNumber, data.louNumber, data.desc, data.consigneeName, data.checked)

                toast.message = msg;

                // jumpHarvestAddress();
                if (code == '000') {

                    toast.type = "success";
                    store.commit("setToast", toast);

                    const pages = getCurrentPages();
                    let bool = false;
                    pages.forEach(page => {
                        const { route } = page;
                        if (route === 'pages/confirmOrder/confirmOrder') {
                            bool = true;
                            return
                        }
                    });
                    if (bool) {
                        jumpConfirmOrder();
                    } else {
                        jumpHarvestAddress();
                    }
                } else {
                    toast.type = "error";
                    store.commit("setToast", toast);
                }
            }, () => { }, "添加地址异常");
            //使用添加
        })
        .catch((err: any) => {
            console.log('表单错误信息：', err);

        });
};


onMounted(() => {
    defaultData();
})


</script>

<style lang="scss" scoped>
.main {
    background-color: #fff;
    padding: 40rpx;
    align-items: center;
    margin: 20rpx 1.5% 0 1.5%;

    text {
        font-size: 28rpx;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.5);
    }
}

.u-button {
    background-color: #2b85e4;
    border-radius: 50rpx;
    color: #fff;
    margin-top: 50rpx;


}

::v-deep .u-input {
    width: 60vm;
}

::v-deep .u-form-item {
    margin-top: 20rpx;

    &:not(:last-child) {
        border-bottom: 1rpx solid gainsboro;
    }

}
</style>
