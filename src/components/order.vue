<!-- @format -->

<template>
	<view>
		<u-list
			@scrolltolower="scrolltolower"
			v-if="list.length > 0">
			<view
				class="orderList"
				v-for="(item, oderIndex) in props.list"
				:key="oderIndex">
				<u-list-item> </u-list-item>

				<view class="orderId"
					><text> 订单号:{{ item.order_id }}</text>
					<text>{{ orderTypeFilter(item.status) }}</text>
				</view>
				<view class="card">
					<view
						class="item"
						v-for="(tradeItem, index) in item?.xlxw_order_trades"
						:key="index">
						<image
							:src="`${url.host}/file/image/${tradeItem.xlxw_trade.image}`"
							class="shour_images" />
						<view class="tabulation">
							<view
								><text>{{ tradeItem.xlxw_trade.name }}</text></view
							>
							<view
								><text>￥{{ tradeItem.xlxw_trade.money / 100 }}</text> &nbsp;
								<text>X&nbsp; {{ tradeItem.number }}</text></view
							>
						</view>
					</view>
				</view>

				<view class="money">
					<view
						>共&nbsp;{{ orderNumber(item.xlxw_order_trades) }}&nbsp;件商品</view
					>
					<view>实付&nbsp;￥{{ (item.actual_payment as number) / 100 }}</view>
				</view>
				<view class="groupButton">
					<view>
						<button @click="jumpOrderDetails(item.order_id, item.status)">
							详情
						</button></view
					>
					<view v-if="item.status == 0"
						><button @click="jumpPayment(item.order_id)">去付款</button></view
					>
					<view
						v-else-if="item.status == 4"
						@click="Con_take(item)"
						><button>确认收货</button></view
					>
				</view>
			</view>
		</u-list>
		<view v-else>
			<u-empty mode="data" />
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { orderTypeMap } from '../static/json/typeMap';
	import {
		jumpPayment,
		jumpOrderDetails,
		redirectToshoeWashing,
	} from '@/api/jumpApi';
	import { ref } from 'vue';
	import type { Orderdetails, Xlxw_order_trade } from '@/interface/interface';
	import { wxPay } from '@/config/config';
	import url from '@/static/json/request';
	import { cgeOrder } from '@/api/getApi';
	import { tryFun } from '@/utils/tryFun';

	const props = defineProps<{
		list: Orderdetails[];
	}>();

	const scrolltolower = () => {
		emit('findAll');
	};

	const windowInfo = uni.getWindowInfo();
	const width = ref(windowInfo.screenHeight);

	const orderNumber = (list: Xlxw_order_trade[]) => {
		if (list != undefined) {
			let number = 0;
			for (let i = 0; i < list.length; i++) {
				number += list[i].number;
			}

			return number;
		} else {
			return 0;
		}
	};

	//确认收货
	const Con_take = (item: Xlxw_order_trade) => {
		tryFun(
			async () => {
				wx.openBusinessView({
					businessType: 'weappOrderConfirm',
					extraData: {
						merchant_trade_no: item.order_id,
						merchant_id: wxPay.mchid,
					},
					success() {
						tryFun(
							async () => {
								const { code } = await cgeOrder(item.order_id, 5);
								if (code == '000') {
									redirectToshoeWashing(4);
								}
							},
							() => {},
							'修改订单失败'
						);
						//此处需要点击修改状态
					},
					fail() {
						//dosomething
					},
					complete() {
						//dosomething
					},
				});
			},
			() => {},
			'确人收货异常'
		);
	};

	//获取map中的数据
	const orderTypeFilter = (key: number) => {
		return orderTypeMap.get(key);
	};

	const emit = defineEmits(['findAll']);
</script>

<style lang="scss" scoped>
	.orderList {
		font-weight: bold;
		font-size: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 2%;

		> view {
			padding: 20rpx 0 20rpx 0;
			width: 95%;
			margin: 0 2.5% 0 2.5%;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
		}
	}

	//订单号列表样式
	.orderId {
		display: flex;
		justify-content: space-between;
		flex-direction: row;

		> text {
			&:last-child {
				font-size: 30rpx;
				width: 100rpx;
				color: #f29509;
			}

			&:first-child {
				color: rgba(0, 0, 0, 0.5);
				width: calc(100% - 150rpx);
			}
		}
	}

	.money {
		padding: 10rpx 0 10rpx 0;
		color: rgba(0, 0, 0, 0.7);
		display: flex;

		view:first-child {
			width: 50%;
		}

		view:last-child {
			width: 40%;
			text-align: right;
		}
	}

	.groupButton {
		display: flex;
		align-items: center;
		justify-content: flex-end;

		> view {
			width: 200rpx;

			button {
				font-size: 25rpx;
				width: 160rpx;
				height: 60rpx;
				border-radius: 0;
				position: relative;
				right: 20rpx;
			}

			&:last-child {
				button {
					color: #fff;
					background-color: #2b85e4;
				}
			}

			&:not(:last-child) {
				button {
					background-color: #fff;
				}
			}
		}
	}

	.card {
		width: 97%;
		margin: 15rpx 1.5% 0rpx 1.5%;
		background-color: #fff;
		border-radius: 10rpx;
		align-items: center;

		> view {
			width: 95%;
			margin: 0 1.5% 0rpx 1.5%;
			display: flex;
			flex: row;
			justify-content: space-between;

			padding: 20rpx 0 20rpx 0;
			font-size: 25rpx;

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
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);
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
		width: 220rpx;
		height: 180rpx;
	}

	.tabulation {
		width: calc(93% - 200rpx);

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
				float: right;
			}
		}
	}
</style>
