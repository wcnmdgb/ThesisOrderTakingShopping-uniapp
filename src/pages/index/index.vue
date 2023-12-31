<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>
		<view
			class="container"
			:show="show">
			<view class="content1">
				<view class="title">
					<view class="logo">
						<image
							src="../../static/logo.jpg"
							class="image"></image>
						<text>鞋来鞋往 </text>
					</view>
					<view class="title-space">
						<text>互联网+洗鞋馆\n</text>
						<text>手机下单.上门取货</text>
					</view>
				</view>
				<view class="icons">
					<text class="iconfont icon-pinzhigongyingshang"
						>&nbsp; <text>品质服务</text></text
					>
					<text class="iconfont icon-gongxuxinxibiao"
						>&nbsp;<text>标准工序</text></text
					>
					<text class="iconfont icon-anquanzhongxin"
						>&nbsp;<text>全程可塑</text></text
					>
					<text class="iconfont icon-shouhou"
						>&nbsp;<text>售后无忧</text>
					</text>
				</view>
			</view>

			<view>
				<u-swiper
					:list="srcList"
					indicatorMode="line"
					:radius="10"
					height="600rpx"
					:display-multiple-items="0"
					keyName="image"
					showTitle
					:autoplay="false"
					circular></u-swiper>
			</view>

			<view>
				<view @click="jumpClassFication">
					<text class="iconfont icon-xiezi">\n</text>
					<text>洗护下单\n</text>
					<text>无接触送达 \n</text>
				</view>
				<view @click="jumpshoeWashing(0)">
					<text class="iconfont icon-dingdan">\n</text>
					<text>洗护订单\n</text>
					<text>订单实时更新\n</text>
				</view>
			</view>

			<view>
				<button
					class="button"
					@click="jumpCareInstructions">
					<view><text>洗护说明\n</text><text>关于清洗及修复展示</text></view>
					<view> <text class="iconfont icon-dingdan1">\n</text></view>
				</button>
			</view>

			<view>
				<button
					class="button"
					open-type="contact"
					bindcontact="handleContact"
					session-from="sessionFrom">
					<view><text>咨询客服\n</text><text>如有疑问请先咨询客服</text></view>
					<view> <text class="iconfont icon-weixin">\n</text></view>
				</button>
			</view>

			<view><text>焕新洗护 超级干净</text></view>
			<view>
				<view class="icons">
					<text class="iconfont icon-zhuanyezhuanyeke">&nbsp;专业工序</text>
					<text class="iconfont icon-jiankong">&nbsp;全程监控</text>
					<text class="iconfont icon-aixinjuanzeng">&nbsp;专业精洗</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '@/components/navbar.vue'; //引入组件
	import {
		jumpClassFication,
		jumpCareInstructions,
		jumpshoeWashing,
	} from '@/api/jumpApi';
	import { ref, reactive, onMounted } from 'vue';

	import url from '@/static/json/request';
	import { finAllDrotationChart } from '@/api/getApi';
	import type { rotationChartInterface } from '@/interface/interface';
	import { onPullDownRefresh } from '@dcloudio/uni-app';

	const show = ref(false);
	const title = ref('main');
	const srcList = ref<rotationChartInterface[]>([]);
	const getRoatation = async () => {
		const {
			data: { rows },
		} = await finAllDrotationChart('', 1, 0);
		srcList.value = rows;
		srcList.value.forEach((item) => {
			item.image = `${url.host}/file/image/${item.image}`;
		});
	};

	onMounted(() => {
		// checkedLogin();
		getRoatation();
	});

	onPullDownRefresh(() => {
		// checkedLogin();
		getRoatation();
		uni.stopPullDownRefresh();
	});
</script>

<style lang="scss" scoped>
	@import url('../../style/style.scss');

	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		> view {
			border-radius: 20rpx;
			background-color: #fff;
			width: 95%;
			margin: 10rpx 0;

			&:nth-child(2) {
				> image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}

			&:nth-child(3) {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				text-align: center;
				gap: 20rpx;
				background-color: #f6f6f6;

				> view {
					flex: 1;
					padding: 20rpx 20rpx;
					background-color: #fff;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					gap: clamp(10rpx, 12rpx, 15rpx);

					text:nth-child(1) {
						position: relative;
						font-size: 80rpx;
						color: gray;
					}

					text:nth-child(2) {
						position: relative;
						font-size: 40rpx;
						font-weight: bold;
					}

					text:nth-child(3) {
						position: relative;
						color: gray;
						font-size: 20rpx;
					}
				}
			}

			&:nth-child(n + 4):nth-child(-n + 5) {
				.button {
					display: flex;
					color: gray;
					align-items: center;
					background-color: #fff;

					view:nth-child(1) {
						text-align: left;
						text:nth-child(1) {
							color: black;
							font-size: 35rpx;
							font-weight: bold;
							flex: 1;
						}

						text:nth-child(2) {
							font-size: 25rpx;
						}
					}

					view:nth-child(2) {
						flex: 1;
						text-align: right;
						> text {
							font-size: 55rpx;
							font-weight: bold;
						}
					}
				}

				.button:after {
					border: none;
				}
			}

			&:nth-child(6) {
				background-color: #f6f6f6;
				color: gray;
				text-align: center;
				> text:nth-child(1) {
					font-weight: bold;
					font-size: 40rpx;
				}
			}
			&:nth-child(7) {
				background-color: #f6f6f6;
				color: gray;
				margin-bottom: 20rpx;
			}
		}
	}

	//第一个白格
	.content1 {
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 20rpx;
		flex-direction: column;
		& .image {
			width: clamp(100rpx, 110rpx, 120rpx);
			height: clamp(100rpx, 110rpx, 120rpx);
			border-radius: 50%;
		}
	}

	//首页标签信息
	.title {
		display: flex;
		text-align: center;
		align-items: center;
		gap: 20rpx;
		justify-content: center;
		flex: 1;
		& > view {
			flex: 1;
		}
	}
	//logo字体
	.logo {
		display: flex;
		justify-content: space-around;
		font-size: clamp(40rpx, 50rpx, 60rpx);
		font-weight: bold;
	}
	.title-space {
		display: flex;
		flex-direction: column;

		color: black;
		font-weight: bold;

		& > text:nth-child(1) {
			font-size: clamp(30rpx, 35rpx, 40rpx);
			font-weight: bold;
		}
		& > text:nth-child(2) {
			padding-top: 20rpx;
			font-size: clamp(18rpx, 20rpx, 22rpx);
		}
	}
	.icons {
		display: flex;
		flex: 1;
		justify-content: center;
		gap: clamp(30rpx, 40rpx, 50rpx);
		.iconfont {
			font-size: clamp(18rpx, 20rpx, 22rpx);
		}
	}
</style>
