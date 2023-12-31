<!-- @format -->

<template>
	<view style="background-color: #f6f6f6">
		<topNav :title="title"></topNav>
		<view class="main">
			<view
				><u-search
					placeholder="请输入姓名搜索"
					v-model="search"
					:show-action="false"></u-search
			></view>
			<view>
				<card
					:list="list"
					@findAddr="findAddr"></card>
			</view>
			<view>
				<u-button @click="jumpAddAddress">+ 添加地址</u-button>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '../../components/navbar.vue'; //引入组件
	import card from '../../components/card.vue';
	import { jumpAddAddress } from '@/api/jumpApi';
	import { getAddr, cgeAddr } from '@/api/getApi';
	import { ref, onMounted } from 'vue';
	import type { addResInterface } from '@/interface/interface';

	const title = ref('收货地址');

	//输入框信息
	const search = ref<string | undefined>(undefined);

	const list = ref<addResInterface[]>([]);

	const findAddr = async () => {
		const { data, msg } = await getAddr(search.value, undefined);
		list.value = data;
		if (list.value?.length === 0) {
			jumpAddAddress();
		}
	};

	//执行方法
	onMounted(() => {
		findAddr();
	});
</script>

<style lang="scss" scoped>
	.main {
		view {
			width: 93%;
			margin: 20rpx 3.5% 0 3.5%;

			//设置搜索样式
			::v-deep .u-search {
				width: 100%;
			}
		}

		view:nth-child(3) {
			height: 90rpx;

			> ::v-deep .u-button {
				background-color: #2b85e4;
				border-radius: 50rpx;
				color: #fff;
				position: fixed;
				bottom: 0;
				width: 95%;
				height: 90rpx;
			}
		}
	}
</style>
