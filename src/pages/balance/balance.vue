<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>
		<view class="main">
			<view class="show">
				<view
					><text>我的余额\n ￥</text>
					<text>{{
						Number(funMoney(userInfo?.xlxw_balances)) / 100
					}}</text></view
				>
				<view><text @click="jumpRechargeRecord">充值记录></text></view>
			</view>
			<view class="recharge">
				<view><text>充值余额(元)\n</text></view>
				<view>
					<text>￥</text>
					<input
						@input="updateManey"
						class="uni-input"
						focus
						placeholder="请输入充值金额"
						v-model="money" />
				</view>
				<view class="prompt">
					<text
						v-for="(item, index) in roumptList"
						:class="item.active ? 'active' : ''"
						:key="index"
						@click="addprompt(item)"
						>满{{ item.money }}元\n<text>赠送{{ item.reduction }}元</text></text
					>
				</view>
			</view>
			<view
				><u-button
					@click="subbanlance"
					:disabled="
						money === undefined || money === 0 || money === null || money === ''
					"
					>支付</u-button
				></view
			>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '../../components/navbar.vue'; //引入组件

	import { ref, computed, reactive } from 'vue';
	import { jumpRechargeRecord } from '@/api/jumpApi';
	import type { Xlxw_blance } from '@/interface/interface';
	import store from '@/store';
	import { AES_Encrypt } from '@/utils/Encry';
	import { genbanlance, findUserInfo } from '@/api/getApi';
	import { tryFun } from '@/utils/tryFun';

	interface tabs {
		money: number;
		reduction: number;
		active: boolean;
	}
	const toast = reactive({ message: '', type: '' });

	const roumptList = ref<tabs[]>([
		{ money: 100, reduction: 5, active: false },
		{ money: 200, reduction: 20, active: false },
		{ money: 500, reduction: 80, active: false },
	]);

	const userInfo = computed(() => {
		return store.state.userInfo;
	});

	const funMoney = (moneys: Xlxw_blance[] | undefined) => {
		let money = 0;
		if (moneys?.length === 0) {
			return money;
		} else {
			moneys?.filter((item) => {
				if (item.status == 0) {
					money += item.money;
				} else {
					money -= item.money;
				}
			});
			return money;
		}
	};

	const subbanlance = async () => {
		const item = {
			money: money.value,
		};

		let cipherItem = AES_Encrypt(JSON.stringify(item)).toString();

		const { data } = await genbanlance(cipherItem);

		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: data.timeStamp,
			nonceStr: data.nonceStr,
			package: data.package,
			signType: data.signType,
			paySign: data.paySign,
			success: async function (res) {
				paySuccess();
				//查询finUserinfo
			},
			fail: function (err) {
				console.log('充值错误' + JSON.stringify(err));
				toast.message = '买家取消支付';
				toast.type = 'error';
				store.commit('setToast', toast);
			},
		});
	};

	const title = ref('余额充值');
	//充值金额
	const money = ref();
	//选中不同的充值方式
	const addprompt = (item: tabs) => {
		roumptList.value.filter((ite) => {
			ite.active = false;
		});
		item.active = true;
		money.value = item.money;
	};

	//根据充值金额选中不同的充值方式
	const updateManey = () => {
		roumptList.value.filter((ite) => {
			ite.active = false;
		});
		const amney = money.value as number;
		if (amney < 100) {
		} else if (amney >= 100 && amney < 200) {
			roumptList.value[0].active = true;
		} else if (amney >= 200 && amney < 500) {
			roumptList.value[1].active = true;
		} else if (amney >= 500) {
			roumptList.value[2].active = true;
		}
	};

	const getUserInfo = async () => {
		tryFun(
			async () => {
				const { data } = await findUserInfo();
				store.commit('setUserInfo', data);
			},
			() => {},
			'获取用户信息异常'
		);
	};

	const paySuccess = async () => {
		tryFun(
			async () => {
				toast.message = '购买成功';
				toast.type = 'success';
				store.commit('setToast', toast);
				await getUserInfo();
			},
			() => {},
			'添加异常'
		);
	};
</script>

<style lang="scss" scoped>
	.main {
		> view {
			width: 95%;
			margin: 20rpx 2.5% 20rpx 2.5%;

			&:nth-child(1) {
				background-color: #2b85e4;
				height: 20vh;
				border-radius: 10rpx 50rpx 10rpx 10rpx;
				color: #fff;
			}

			&:nth-child(2) {
				background-color: #fff;
				height: 30vh;
			}

			&:nth-child(3) {
				::v-deep .u-button {
					background-color: #2b85e4;
					width: 100%;
					color: #fff;
					line-height: 90rpx;
					height: 90rpx;
					font-size: 35rpx;
					font-weight: bold;
				}
			}
		}
	}

	.show {
		view {
			&:nth-child(1) {
				&:nth-child(1) {
					padding: 50rpx;

					text:nth-child(1) {
						font-size: 25rpx;
					}

					text:nth-child(2) {
						font-size: 60rpx;
					}
				}
			}

			&:nth-child(2) {
				position: absolute;
				right: 2.5%;
				top: 20%;
				text-align: center;
				width: 140rpx;
				height: 60rpx;
				background-color: rgba(255, 255, 255, 0.2);
				font-size: 20rpx;
				font-weight: bold;
				line-height: 60rpx;

				border-radius: 50rpx 0 0 50rpx;
			}
		}
	}

	.recharge {
		view {
			padding: 30rpx;
			font-weight: bold;

			&:nth-child(1) {
				text {
					font-size: 25rpx;
					color: gray;
				}
			}

			&:nth-child(2) {
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				display: flex;

				text {
					font-size: 40rpx;
					width: 10%;
				}

				input {
					display: block;
					width: 80%;
					height: 50rpx;
					font-size: 40rpx;
					padding: 0;
				}
			}
		}

		.prompt {
			display: flex;
			flex-direction: row;
			justify-content: center;
			font-size: 30rpx;
			text-align: center;
			color: rgba(0, 0, 0, 0.6);

			> text {
				border-radius: 10rpx;
				display: block;
				background-color: #fdf6f6;
				width: 30%;
				margin: 5rpx;
				padding: 15rpx;

				text {
					font-size: 25rpx;
				}
			}

			.active {
				background-color: #2b85e4;
				color: #fff;
			}
		}
	}

	//小标提示
</style>
