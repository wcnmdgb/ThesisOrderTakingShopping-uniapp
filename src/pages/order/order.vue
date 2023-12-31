<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>

		<view class="main">
			<view v-show="list?.length !== 0">
				<view class="title">鞋来鞋往</view>

				<van-tabitem
					:list="list"
					:order="true"
					ref="testcomRef">
				</van-tabitem>
			</view>

			<view v-if="list?.length === 0">
				<!--购物车为空提示-->
				<u-empty
					mode="car"
					:marginTop="50">
					<!-- <template #default="slot"> -->
					<button
						class="empty_button"
						@click="jumpClassFication">
						去选购
					</button>
					<!-- </template> -->
				</u-empty>
			</view>

			<view>
				<view
					class="Cart"
					v-if="list?.length != 0">
					<view>
						<u-checkbox-group @change="checkedAll">
							<u-checkbox
								shape="circle"
								:label="`全选(` + testcomRef.commodity.count + `)`"
								:checked="testcomRef.commodity.check">
							</u-checkbox>
						</u-checkbox-group>
					</view>
					<view><text>合计:</text></view>
					<view
						><text
							>￥{{ (testcomRef.commodity.maney as number) / 100 }}</text
						></view
					>
					<view
						><u-button
							:disabled="testcomRef.commodity.count === 0"
							@click="jumpConfirmOrder"
							>去结算</u-button
						></view
					>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '../../components/navbar.vue'; //引入组件
	import vanTabitem from '../../components/vanTabitem.vue'; //引入组件
	import { ref, toRaw, onMounted, watch, computed } from 'vue';
	import { jumpClassFication, jumpConfirmOrder } from '@/api/jumpApi';
	import store from '@/store/index';
	//导入list数据 此处使用为图简洁 使用的是分类中的信息 实际使用需要修改 需要获取前端缓存的信息

	const title = ref('订单');

	const list = computed(() => {
		return store.state.commodityList;
	});

	//使用子组件的方法
	const checkedAll = () => {
		testcomRef.value.checkedAll();
	};

	//接收子组件传递的值
	const testcomRef = ref({
		commodity: { maney: 0, count: 0, check: true },
		checkedAll,
	});
</script>

<style lang="scss" scoped>
	@import url('../../style/style.scss');

	.main {
		> view:nth-child(1) {
			width: 97%;
			margin: 20rpx 1.5% 0 1.5%;
		}

		> view:nth-child(2) {
			height: 100rpx;
		}
	}

	//标题
	.title {
		background-color: #fff;
		padding: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
		border-radius: 20rpx 20rpx 0 0;
	}

	//设置按钮 商品增加
	.stepper {
		position: relative;
		top: -80rpx;
		height: 0;
	}

	//设置图标样式
	.icon-shanchu {
		position: relative;
		bottom: 10rpx;
		font-size: 30rpx;
		margin-bottom: 20rpx;
	}

	/**购物车板块 */
	.Cart {
		position: fixed;
		bottom: 0;
		z-index: 99;
		height: 100rpx;
		background-color: #ffff;
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		width: 100%;
		padding-left: 40rpx;

		view:nth-child(1) {
			width: 280rpx;
		}

		view:nth-child(2) {
			font-weight: bold;
			width: 80rpx;
			font-size: 25rpx;
		}

		view:nth-child(3) {
			font-weight: bold;
			font-size: 30rpx;
			color: red;
			width: 100rpx;
		}

		view:nth-child(4) {
			position: absolute;
			right: 8%;

			::v-deep .u-button {
				background-color: #2b85e1;
				width: 220rpx;
				font-size: 30rpx;
				color: #ffffff;
				font-weight: bold;
				transform: scale(0.9, 0.9);
			}
		}
	}

	//提示框下的按钮
	.empty_button {
		margin-top: 30rpx;
		width: 450rpx;
		height: 80rpx;
		font-size: 30rpx;
		color: #fff;
		background-color: #2b85e1;
		border-radius: 0rpx;
	}
	::v-deep .u-checkbox__icon-wrap {
		margin-right: 0px !important;
	}
	::v-deep .Cart .u-checkbox {
		display: flex;
		gap: 10rpx;
	}
</style>
