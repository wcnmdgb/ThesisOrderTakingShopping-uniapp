<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>
		<view class="image">
			<view>{{ fileterOrderTypeDesc(orderItem?.status as number) }}</view>
			<image src="../../static/order_2.png"></image>
		</view>

		<view class="local">
			<view>
				<text class="iconfont icon-dizhi" />
			</view>
			<view>
				<view
					><text
						>{{ orderItem?.xlxw_address.consignee_name }}&nbsp;{{
							orderItem?.xlxw_address.phone
						}}</text
					>
				</view>
				<view
					><text
						>{{ orderItem?.xlxw_address.dormitory_number
						}}{{ orderItem?.xlxw_address.lou_number }}</text
					>
				</view>
			</view>
		</view>
		<view class="card">
			<view
				class="item"
				v-for="(item, index) in orderItem?.xlxw_order_trades"
				:key="index">
				<image
					:src="`${url.host}/file/image/${item.xlxw_trade.image}`"
					class="shour_images" />
				<view class="tabulation">
					<view
						><text>{{ item.xlxw_trade.name }}</text></view
					>
					<view
						><text>￥{{ item.xlxw_trade.money / 100 }}</text> &nbsp;
						<text>X&nbsp; {{ item.number }}</text></view
					>
				</view>
			</view>
		</view>

		<view class="card">
			<view
				><text>订单编号</text> <text>{{ orderItem?.order_id }}</text></view
			>
			<view
				><text>下单时间</text>
				<text>{{ formatdate(orderItem?.create_time) }}</text></view
			>
		</view>

		<view class="card">
			<!-- <view><text>商品金额</text> <text style="color: red;">{{orderItem?.actual_payment}}</text></view> -->
			<view
				><text>实付款</text>
				<text style="color: red"
					>￥&nbsp;{{ (orderItem?.actual_payment as number) / 100 }}</text
				>
			</view>
			<view
				><text>订单状态</text>
				<text> {{ fileterType(orderItem?.status as number) }}</text></view
			>
		</view>

		<view class="order">
			<view v-if="orderItem?.status === 0">
				<button @click="modalClose.showClose = true">取消订单</button>
				<button @click="jumpPayment(orderItem?.order_id)">去付款</button>
			</view>
		</view>

		<!---弹出框-->
		<u-modal
			:show="modalClose.showClose"
			:title="modalClose.titleClose"
			:content="modalClose.contentClose"
			@cancel="modalClose.showClose = false"
			@confirm="cancelOrder"
			:showCancelButton="true"></u-modal>
	</view>
</template>

<script lang="ts" setup>
	import { ref, toRaw, reactive } from 'vue';
	import topNav from '../../components/navbar.vue'; //引入组件
	import { formatdate } from '../../utils/dayjs';
	import { jumpclassification } from '@/api/jumpApi';

	import url from '@/static/json/request';
	import { onLoad } from '@dcloudio/uni-app';
	import { details, cgeOrder } from '@/api/getApi';
	import { jumpPayment } from '@/api/jumpApi';
	import { orderTypeMap, orderTypeDescMap } from '../../static/json/typeMap';

	import type { Orderdetails } from '@/interface/interface';
	import store from '@/store';
	import { tryFun } from '@/utils/tryFun';

	const title = ref('订单详情');
	//价格

	const orderItem = ref<Orderdetails>();

	onLoad(async (options: any) => {
		//获取传输的id信息
		let id = options.orderId;
		let status = options.status;

		tryFun(
			async () => {
				const { data } = await details(id, status);
				orderItem.value = data;
			},
			() => {},
			'获取订单异常'
		);
	});

	//头部的的提示信息
	const fileterOrderTypeDesc = (key: number) => {
		return orderTypeDescMap.get(key);
	};

	//订单的状态信息
	const fileterType = (key: number) => {
		return orderTypeMap.get(key);
	};

	//关闭订单
	const modalClose = reactive({
		showClose: false,
		titleClose: '关闭订单',
		contentClose: '您确定关闭订单吗',
	});
	const toast = reactive({
		type: 'success',
		message: '',
	});

	const cancelOrder = async () => {
		modalClose.showClose = false;
		const { msg, code } = await cgeOrder(orderItem.value?.order_id, 6);
		if (code === '000') {
			toast.message = msg;
			store.commit('setToast', toast);
			jumpclassification();
		}
	};
</script>

<style lang="scss" scoped>
	@import url('../../style/style.scss');

	.image {
		width: 100%;
		height: 200rpx;
		background: linear-gradient(to right, #5be3ad, #60db89);
		display: flex;
		flex-direction: row;
		align-items: center;

		image {
			width: 30%;
			width: 220rpx;
			height: 180rpx;
		}

		view {
			width: 60%;
			margin-left: 40rpx;
			color: #fff;
		}
	}

	.card {
		width: 95%;
		margin: 15rpx 2.5% 0rpx 2.5%;
		background-color: #fff;
		border-radius: 20rpx;
		align-items: center;

		> view {
			width: 93%;
			margin: 0 3.5% 0rpx 3.5%;
			display: flex;
			flex: row;
			justify-content: space-between;

			padding: 30rpx 0 30rpx 0;
			font-size: 28rpx;

			text {
				&:first-child {
					width: 200rpx;
				}

				&:last-child {
					text-align: right;
					width: calc(100% - 200rpx);
				}
			}
		}

		> view:not(:last-child) {
			border-bottom: 2rpx solid rgba(0, 0, 0, 0.08);
		}
	}

	.order {
		height: 120rpx;

		> view {
			height: 100rpx;
			position: fixed;
			background-color: #fff;
			display: flex;
			z-index: 99;
			align-items: center;
			bottom: 0rpx;
			width: 50%;
			justify-content: space-between;
			padding-left: 50%;

			> button {
				font-size: 20rpx;
				width: 160rpx;
				height: 60rpx;
				border-radius: 0;
				line-height: 60rpx;

				&:nth-child(1) {
					border: 1px solid rgba(0, 0, 0, 0.7);
				}

				&:nth-child(2) {
					color: #fff;
					background-color: red;
				}
			}
		}
	}

	.item {
		border-radius: 20rpx;
		background-color: #ffff;
		display: flex;
		flex-direction: row;
		padding: 10rpx 0 10rpx 0;
		width: 100%;

		margin-bottom: 10rpx;

		&:not(:last-child) {
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.07);
		}
	}

	.shour_images {
		width: 180rpx;
		height: 180rpx;
	}

	.tabulation {
		width: calc(100% - 180rpx);
		margin-left: 20rpx;

		view {
			font-size: 35rpx;
			font-weight: bold;
			padding: 10rpx 0 20rpx 0;
		}

		view:nth-child(2) {
			font-size: 28rpx;
			color: red;
			padding: 5rpx 0 20rpx 0;

			font-weight: bold;

			> text:last-child {
				padding-left: 300rpx;
			}
		}
	}

	.local {
		display: flex;
		flex: row;
		width: 95%;
		margin: 15rpx 2.5% 0 2.5%;
		background-color: #fff;
		align-items: center;
		border-radius: 20rpx;

		> view:first-child {
			width: 40rpx;
			padding: 20rpx;
		}

		> view:last-child {
			padding: 20rpx;
			width: calc(100% - 30rpx);

			> view:first-child {
				font-size: 30rpx;
				font-weight: bold;
			}

			> view:last-child {
				margin-top: 10rpx;
				font-size: 28rpx;
				color: #9b9b9b;
			}
		}
	}
</style>
