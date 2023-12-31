<!-- @format -->

<template>
	<view>
		<view
			v-for="(item, index) in props.list"
			:key="index"
			class="item">
			<view
				><text style="font-weight: bold">{{ item.consignee_name }}</text
				>&nbsp<text style="color: gray">{{ item.phone }}</text>
				<text
					@click="cardbedit(item)"
					class="iconfont icon-bianji"></text
			></view>
			<view
				><text>{{ item.dormitory_number }}{{ item.lou_number }}</text></view
			>
			<view></view>
			<u-divider :hairline="true"></u-divider>

			<view>
				<radio
					@click="SetDefaultAddress(item)"
					:checked="item.checked == 0">
					<text style="font-size: 20px"
						>&nbsp{{ item.checked == 0 ? '默认地址' : '设为默认' }}</text
					>
				</radio>

				<text @click="clickDel(item)"> 删除</text>
			</view>
		</view>

		<view v-if="list?.length === 0">
			<u-empty mode="data" />
		</view>

		<u-modal
			:show="delAddresshow"
			title="删除地址"
			content="您确定要删除当前地址吗"
			:showCancelButton="true"
			@confirm="deladdres"
			@cancel="delAddresshow = false"></u-modal>
	</view>
</template>

<script lang="ts" setup>
	import type { addResInterface } from '@/interface/interface';
	import { cgeAddr, delAddr } from '@/api/getApi';
	import { jumpConfirmOrder, jumpAddAddress } from '@/api/jumpApi';
	import { ref } from 'vue';
	import { tryFun } from '@/utils/tryFun';

	//设置重父类获取的信息
	const props = defineProps<{
		list: addResInterface[];
	}>();

	const delAddresshow = ref(false);

	const delItem = ref<addResInterface>();

	const clickDel = (item: addResInterface) => {
		delAddresshow.value = true;
		delItem.value = item;
	};

	//设置默认的地址
	const SetDefaultAddress = async (item: addResInterface) => {
		tryFun(
			async () => {
				uni.showLoading({
					title: '加载中',
					mask: true,
				});
				const { code, msg } = await cgeAddr(
					item.id,
					item.phone,
					item.dormitory_number,
					item.lou_number,
					item.desc,
					item.consignee_name,
					0
				);
				if (code === '000') {
					const pages = getCurrentPages();
					let bool = false;
					pages.forEach((page) => {
						const { route } = page;
						if (route === 'pages/confirmOrder/confirmOrder') {
							bool = true;
							return;
						}
					});
					if (bool) {
						jumpConfirmOrder();
					} else {
						emit('findAddr');
					}
				}
			},
			async () => {
				uni.hideLoading();
			},
			'设置默认地址异常'
		);
	};

	//删除地址
	const deladdres = async () => {
		tryFun(
			async () => {
				uni.showLoading({
					title: '加载中',
					mask: true,
				});
				delAddresshow.value = false;
				const { code } = await delAddr(JSON.stringify(delItem.value?.id));

				if (code == '000') {
					emit('findAddr');
				}
			},
			() => {
				uni.hideLoading();
			},
			'删除地址异常'
		);
	};

	//编辑地址信息
	const cardbedit = async (item: addResInterface) => {
		uni.setStorageSync('editRes', item);
		jumpAddAddress();
	};

	const emit = defineEmits(['findAddr']);
</script>

<style lang="scss" scoped>
	@import '../style/style.scss';

	.item {
		font-size: 28rpx;
		padding: 40rpx;
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;

		> view:nth-child(2) {
			margin: 35rpx 0 25rpx 0;
		}

		//选择第一和最后一个
		> view:nth-of-type(2n + 1) {
			display: flex;
			align-items: center;
			height: 30rpx;

			> text:last-child {
				position: absolute;
				right: calc(1.5% + 50rpx);
			}
		}

		radio {
			transform: scale(0.7);
		}
	}
</style>
