<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>

		<button
			class="button"
			@click="getUserCode">
			微信授权登陆
		</button>
		<button
			class="button"
			@click="notLogin">
			暂不登陆
		</button>
		<u-popup
			:show="modal.show"
			mode="center"
			:errorType="errorType">
			<u-form
				ref="formRef"
				:model="user"
				:rules="rules"
				labelWidth="80">
				<u-form-item
					label="设置昵称"
					prop="name">
					<u-input
						v-model="user.name"
						placeholder="设置昵称"></u-input>
				</u-form-item>
				<button
					class="form_button"
					@click="changeUserName">
					确认
				</button>
			</u-form>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '../../components/navbar.vue'; //引入组件
	import { ref, onMounted, reactive } from 'vue';
	import store from '@/store/index';
	import { koaLogin, findUserInfo, cgeUser } from '@/api/getApi';
	import { intoData } from '@/utils/local';
	import { debounce } from '@/utils/antishake';
	import { tryFun } from '@/utils/tryFun';

	const title = ref('用户登陆');

	const formRef = ref();

	const errorType = ref('message');
	const checkUser = (rule: any, value: any, callback: any) => {
		if (value === '微信用户') {
			callback(new Error('不能使用这个昵称'));
		}
	};

	const rules = reactive({
		name: [
			{
				type: 'string',
				required: true,
				message: '请填写名称',
				trigger: ['blur'],
			},
			{
				required: true,
				pattern: /^[^\s]*$/,
				message: '禁止输入空格',
			},
			{
				required: true,
				message: '长度在2-8之间',
				trigger: ['blur'],
				max: 8,
				min: 2,
			},
			{
				validator: checkUser,
				trigger: 'blur',
			},
		],
	});

	const user = reactive({
		name: '',
	});

	const modal = reactive({
		show: false,
		title: '修改用户昵称',
	});

	const toast = reactive({
		message: '',
		type: 'success',
	});

	const getUserCode = () => {
		uni.showLoading({
			title: '加载中',
			mask: true,
		});
		uni.login({
			success: function (res) {
				getKoLogin(res.code);
				//TODO：接下来要向后端发送请求，将code发给后端进行处理
			},
		});
	};

	const changeUserName = async () => {
		tryFun(
			() => {
				debounce(() => {
					formRef.value
						?.validate()
						.then(async (res: any) => {
							//修改用户名称
							const { code, msg } = await cgeUser(user.name);
							//修改完毕跳转到文档
							if (code == '000') {
								uni.switchTab({
									url: '../myPage/myPage',
								});
							} else {
								uni.$u.toast('不能使用当前名称');
							}
						})
						.catch((err: any) => {
							console.log('表单错误信息：', err);
						});
				}, 500);
			},
			() => {},
			'修改名称错误'
		);
	};

	const notLogin = () => {
		uni.switchTab({
			url: '../index/index',
		});
	};

	const getUserInfo = async () => {
		tryFun(
			async () => {
				const { data } = await findUserInfo();
				//在这里判断用户的名称是否为默认的名称,是则弹出修改名称的界面
				uni.hideLoading();

				if (data.user_name === '微信用户') {
					modal.show = true;
				} else {
					store.commit('setUserInfo', data);
					uni.switchTab({
						url: '../myPage/myPage',
					});
				}
			},
			() => {},
			'获取用户异常'
		);
	};

	const getKoLogin = async (logincode: string) => {
		tryFun(
			async () => {
				const { data, msg, code } = await koaLogin(logincode);

				if (code === '000') {
					toast.type = 'success';
					toast.message = msg;
					store.commit('setToast', toast);
					intoData(data);
					getUserInfo();
				} else if (code == 408) {
					uni.hideLoading();
					toast.message = msg;
					toast.type = 'error';
					store.commit('setToast', toast);
				} else if (code == 403) {
					uni.hideLoading();
					toast.message = msg;
					toast.type = 'error';
					store.commit('setToast', toast);
				}
			},
			() => {},
			'登陆异常'
		);
	};
</script>
<style lang="scss" scoped>
	.button {
		width: 70%;
		margin: 40rpx 15%;
		border-radius: 50px;
		font-size: 30rpx;
		border: none;
		font-weight: 500;
		padding: 10rpx 0;

		&:nth-child(2) {
			background-color: #0b6dff;
			color: #fff;
		}

		&:nth-child(3) {
			background-color: #ededed;
			color: #8f8f8ffe;
		}
	}

	.form_button {
		width: 60%;
		height: 80rpx;
		border-radius: 50px;
		font-size: 35rpx;
		color: #fff;
		line-height: 80rpx;
		background-color: #2d6eca;
		margin-top: 40rpx;
	}

	::v-deep .u-form {
		padding: 80rpx 40rpx;
	}
</style>
