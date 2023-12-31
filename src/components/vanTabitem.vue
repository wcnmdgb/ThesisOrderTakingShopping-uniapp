<!-- @format -->

<template>
	<view class="tab">
		<u-loading-page></u-loading-page>
		<u-checkbox-group v-if="list?.length !== 0">
			<u-list
				@scrolltolower="scrolltolower"
				class="scroll">
				<view
					class="order_item"
					v-for="(item, index) in list"
					:key="index">
					<u-list-item> </u-list-item>
					<slot
						name="check"
						style="display: none">
						<u-checkbox
							shape="circle"
							:name="index"
							:checked="item.checked"
							@change="checkedItem(item)"
							style="padding: 0 20rpx 0 20rpx">
						</u-checkbox>
					</slot>
					<image
						:src="`${url.host}/file/image/${item.image}`"
						class="shour_images" />
					<view class="tabulation">
						<view>
							<view class="title">{{ item.name }}</view
							><br />

							<view class="desc">{{ item.desc }}</view>
						</view>

						<view class="money"
							><text
								><text class="moneyIcon">￥&nbsp;</text
								>{{ (item.money / 100).toFixed(2) }}</text
							></view
						>
					</view>
					<view class="number-box">
						<view @click="show = true">
							<slot
								name="shanchu"
								style="display: none"
								><text class="iconfont icon-shanchu"></text
							></slot>
						</view>

						<view class="box">
							<u-number-box
								v-model="item.value"
								:name="item.id"
								:min="0"
								button-size="20"
								inputWidth="24"
								:disabledInput="true"
								:asyncChange="true"
								:showMinus="item.value > 0">
								<!--步进器减-->
								<template #minus>
									<view
										class="minus"
										@click="changernumber(item, -1)">
										<u-icon
											name="minus"
											size="10"></u-icon>
									</view>
								</template>

								<!--步进器输入框-->
								<template #input>
									<text class="input">
										<text v-if="item.value > 0">{{ item.value }}</text></text
									>
								</template>
								<!--步进器加-->
								<template #plus>
									<view
										class="minus"
										@click="changernumber(item, +1)">
										<u-icon
											name="plus"
											size="10"></u-icon>
									</view>
								</template>
							</u-number-box>
						</view>
					</view>
					<!---删除标签中的信息-->
					<view>
						<u-modal
							:show="show"
							:title="title"
							:content="content"
							:showCancelButton="showCancelButton"
							@confirm="() => delteCommodityItem(item)"
							@cancel="() => (show = false)"></u-modal>
					</view>
				</view>
			</u-list>
		</u-checkbox-group>
		<view v-else>
			<u-empty
				mode="data"
				class="empty" />
		</view>
	</view>
</template>

<script lang="ts" setup>
	import store from '@/store/index';
	import { ref, computed, onMounted } from 'vue';
	import type { tradeInterFace } from '@/interface/interface';
	import { debounce } from '@/utils/antishake';
	import { generateOrder } from '@/api/getApi';
	import { AES_Encrypt } from '@/utils/Encry';
	import url from '@/static/json/request';
	import { jumpUserLogin } from '@/api/jumpApi';
	import { tryFun } from '@/utils/tryFun';

	const content = ref('确认要从购物车移除吗');
	const show = ref<Boolean>(false);
	const title = ref('确认操作');

	const showCancelButton = ref(true);

	const windowInfo = uni.getWindowInfo();
	const width = ref(windowInfo.screenHeight);

	//获取传递的标签
	const props = defineProps<{
		list: tradeInterFace[];
		order: boolean;
	}>();

	//获取价格 和数量
	const commodity = computed(() => {
		const array: any = store.state.commodityList;

		let count = 0;
		let maney = 0;
		let check = true;
		for (let i = 0; i < array.length; i++) {
			if (props.order) {
				if (array[i].checked) {
					//需要获取复选框选中的状态
					maney += parseFloat((array[i].money * array[i].value).toString());
					count += parseInt(array[i].value);
				} else {
					check = false;
				}
			} else {
				//需要获取复选框选中的状态
				maney += parseFloat((array[i].money * array[i].value).toString());
				count += parseInt(array[i].value);
			}
		}
		maney = (Number(maney.toFixed(3)) * 1000) / 1000;
		maney === null ? 0 : maney;
		return { count, maney, check };
	});

	//修改选中状态
	const checkedItem = (item: tradeInterFace) => {
		debounce(() => {
			item.checked = !item.checked;
			let cipherItem = AES_Encrypt(JSON.stringify([item])).toString();
			generateOrder(cipherItem, false);
		}, 300);

		//此处需要提交后台
	};

	//全选
	const checkedAll = () => {
		tryFun(
			() => {
				debounce(() => {
					const array: tradeInterFace[] = props.list;

					var len = array.filter((item) => {
						return item.checked === true;
					}).length;

					let bol = true;
					//查询列表中ture的数量
					if (len === array.length) {
						bol = false;
					}

					for (let i = 0; i < array.length; i++) {
						array[i].checked = bol;
					}
					let cipherItem = AES_Encrypt(JSON.stringify([array])).toString();
					generateOrder(cipherItem, false);

					//此处需要提交后台
				}, 300);
			},
			() => {},
			'全选异常'
		);
	};

	//改变数据 将订单 保存到vuex中
	const changernumber = async (item: tradeInterFace, value: number) => {
		//判断是否登陆

		const toekn = uni.getStorageSync('token');
		if (toekn !== '') {
			tryFun(
				() => {
					debounce(async () => {
						let itemcpy: tradeInterFace = JSON.parse(JSON.stringify(item));
						itemcpy.value += value;
						//此处需要使用数据加密
						const cipherItem = AES_Encrypt(
							JSON.stringify([itemcpy])
						).toString();

						const { code } = await generateOrder(cipherItem, false);
						if (code == '000') {
							item.value += value;
							// const value = e.value;
							if (item.value === 0) {
								store.commit('deltetItem', item);
								//删除
							} else if (item.value !== 0) {
								store.commit('updateItem', item);
							}
						}
					}, 300);
				},
				() => {},
				'步进器异常'
			);
		} else {
			jumpUserLogin();
		}
	};

	//删除一列数据
	const delteCommodityItem = (item: tradeInterFace) => {
		tryFun(
			() => {
				debounce(() => {
					store.commit('deltetItem', item);
					show.value = false;
					let cipherItem = AES_Encrypt(JSON.stringify([item])).toString();
					generateOrder(cipherItem, true);
				}, 300);
			},
			() => {},
			'删除异常'
		);
	};

	const scrolltolower = () => {
		emit('findTarde');
	};

	//传递到父组件中
	defineExpose({ commodity, checkedAll });

	//执行父组件的方法
	const emit = defineEmits(['findTarde']);
</script>

<style lang="scss" scoped>
	@import '../style/style.scss';

	.scroll {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/**洗鞋列表 */
	.order_item {
		display: flex;
		flex-direction: row;
		flex: 1;
		border-radius: 20rpx;
		background-color: #fff;
		gap: 20rpx;
		margin: 10rpx;
		padding: 25rpx;
		position: relative;
		// font-family: '黑体';
		box-shadow: 0px 0px 2px rgb(246, 246, 246);
	}
	.shour_images {
		width: clamp(180rpx, 200rpx, 220rpx);
		height: clamp(150rpx, 160rpx, 180rpx);
		border-radius: 10rpx;
	}
	.tabulation {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10prx;
		justify-content: space-between;
	}
	//改变计步器的大小
	.number-box {
		position: absolute;

		border-radius: 10rpx;
		bottom: 10rpx;
		right: 10rpx;

		> view:first-child {
			font-size: 30rpx;
		}
	}

	//步进器
	.minus {
		width: 25px;
		height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20rpx;
		box-shadow: 0 0 1px rgb(197, 197, 197);
	}
	.input {
		width: 25px;
		height: 25px;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
	.money {
		color: red;
		font-weight: bold;
	}
	.desc {
		margin-top: clamp(15rpx, 18rpx, 20rpx);
		font-size: 30rpx;
		color: #a8acad;
	}
	.title {
		font-size: 35rpx;
	}
	.empty {
		display: flex;
	}
	.icon-shanchu {
		display: flex;
		text-align: right;
		justify-content: flex-end;
		padding-bottom: 10rpx;
	}
	.moneyIcon {
		font-size: 25rpx;
	}
</style>
