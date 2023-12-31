<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>
		<view class="main">
			<view>
				<u-tabs
					:list="titleList"
					:scrollable="true"
					:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1)',
					}"
					:inactiveStyle="{ color: '#606266', transform: 'scale(0.9)' }"
					@click="getClassificationListByStatic">
				</u-tabs>
				<!--内容板块-->
			</view>

			<view v-if="list?.length !== 0">
				<van-tabitem
					:list="list"
					ref="testcomRef"
					:order="false"
					@findTarde="findTarde">
					<template #check></template>
					<template #shanchu></template>
				</van-tabitem>
			</view>
			<view v-else>
				<u-empty mode="data" />
			</view>
			<!---购物车板块-->
			<view>
				<view class="Cart">
					<view>
						<text class="iconfont icon-gouwuche">
							<text
								class="label"
								v-if="testcomRef.commodity.count != 0"
								>{{ testcomRef.commodity.count }}</text
							>
						</text>
					</view>

					<view
						><text>合计：￥</text>&nbsp;<text
							style="font-size: 30rpx; font-weight: bold"
							>{{ (testcomRef.commodity.maney as number) / 100 }}</text
						>
					</view>
					<view
						><u-button
							@click="jumpConfirmOrder"
							:disabled="checkCount.count === 0">
							结算</u-button
						>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive, watch, toRaw, computed, onMounted } from 'vue';
	import topNav from '../../components/navbar.vue'; //引入组件
	import vanTabitem from '../../components/vanTabitem.vue'; //引入组件
	import { jumpConfirmOrder } from '@/api/jumpApi';
	import { findAlltitle, findAllTarde } from '@/api/getApi';
	import type { tradeInterFace, tradeType } from '@/interface/interface';
	import store from '@/store/index';
	import { onPullDownRefresh } from '@dcloudio/uni-app';
	import { debounce } from '@/utils/antishake';
	import { tryFun } from '@/utils/tryFun';

	const queryData = reactive({ id: '', index: 1, status: 0 });
	//title信息
	const title = ref('分类');
	//滑块的列表
	const titleList = ref<tradeType[]>([]);

	const checkTaede = reactive({ id: undefined, index: 1, status: 0 });
	const list = ref<tradeInterFace[]>([]);
	const total = ref<number>(10);

	//获取标签信息
	const findtitle = async () => {
		const { data } = await findAlltitle(
			queryData.id,
			queryData.index,
			queryData.status
		);
		titleList.value = data.rows;
		//修改label为name
		titleList.value.forEach((item) => {
			const name = item.label;
			item.name = name;
		});
		//添加一列全部商品
		titleList.value.unshift({
			id: undefined,
			name: '全部',
			create_time: '',
			status: 0,
			label: '',
		});
	};

	//单独获取sotre中选择的数据和
	const checkCount = computed(() => {
		let count = 0;
		let array = store.state.commodityList;
		array.forEach((element) => {
			if (element.checked && element.value !== 0) {
				count += element.value;
			}
		});
		return { count };
	});

	//获取商品信息
	const findTarde = async () => {
		tryFun(
			async () => {
				if (((checkTaede.index * 10 - total.value) as number) < 10) {
					uni.showLoading({
						title: '加载中',
						mask: true,
					});

					const {
						data: { rows, count },
					} = await findAllTarde(
						checkTaede.id,
						checkTaede.index,
						checkTaede.status
					);

					let row = list.value;

					list.value = row.concat(rows);
					total.value = count;
					list.value.forEach((item) => {
						Object.assign(item, { value: 0 });
						Object.assign(item, { checked: true });
					});
					store.commit('setListValue', list.value);
					debounce(() => {
						uni.hideLoading();
					}, 500);
					checkTaede.index++;
				} else {
					console.log('到底了');
				}
			},
			() => {},
			'获取商品异常'
		);
	};

	//获取商品的列表信息
	const getClassificationListByStatic = async (item: tradeType) => {
		checkTaede.id = item.id;
		checkTaede.index = 1;
		list.value = [];
		total.value = 10;
		findTarde();
	};
	/**
	 * 默认的执行方法
	 */

	//转化为json格式
	let newStore = computed(() => {
		return JSON.stringify(store.state.commodityList);
	});

	//接收子组件传递的值
	const testcomRef = ref({ commodity: { maney: 0, count: 0 } });

	//监控缓存中的数据变换 若是缓存中数据变更为0需要重新加载

	watch(newStore, (newvalue, oldvalue) => {
		store.commit('setListValue', list.value);
	});

	//需要监控token的改变
	onMounted(() => {
		findTarde();
		findtitle();
	}),
		onPullDownRefresh(() => {
			titleList.value = [];
			list.value = [];
			checkTaede.index = 1;
			total.value = 10;
			findtitle();
			findTarde();
			uni.stopPullDownRefresh();
		});
</script>

<style lang="scss" scoped>
	@import url('../../style/style.scss');

	.main {
		background-color: #f6f6f6;
		min-height: 85vh;
		max-height: 100%;

		> view {
			&:nth-child(1) {
				background: #fff;
				height: 100rpx;
			}

			&:nth-child(2) {
				width: 95%;
				margin: 20rpx 2.5% 0 2.5%;
			}

			&:nth-child(3) {
				height: 110rpx;
			}
		}
	}

	::v-deep .u-tabs {
		position: fixed;
		z-index: 99;
		background-color: #fff;
		min-width: 100%;
	}

	/**购物车板块 */
	.Cart {
		width: 90%;
		position: fixed;
		border-radius: 50px;
		display: flex;
		flex-direction: row;
		border: 1px solid #e5e5e5;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		justify-content: space-between;
		height: 90rpx;
		background-color: #ffff;
		bottom: 20rpx;
		margin: 0 5% 0 5%;

		view:nth-child(1) {
			width: 200rpx;
		}

		view:nth-child(2) {
			width: 300rpx;
			font-size: 25rpx;
		}

		view:nth-child(3) {
			width: calc(100% - 320rpx);

			::v-deep .u-button {
				background-color: #2b85e1;
				width: 180rpx;
				font-size: 30rpx;
				color: #ffffff;
				font-weight: bold;
				border-radius: 50px;
				height: 70rpx;
				line-height: 70rpx;
			}
		}
	}

	.icon-gouwuche {
		position: relative;
		font-size: 40rpx;
		font-weight: bold;
	}

	.label {
		position: relative;
		background-color: orange;
		border-radius: 50rpx;
		padding: 2rpx 5rpx 2rpx 5rpx;
		font-weight: lighter;
		font-size: 6rpx;
		color: #fff;
		top: -37rpx;
		left: -8rpx;
	}
</style>
