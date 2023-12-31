<!-- @format -->

<template>
	<view>
		<topNav :title="title"></topNav>

		<view class="main">
			<view>
				<view>
					<image :src="head"></image>
					<!-- <text class="iconfont icon-zhongxingkehu"></text> -->
				</view>
				<view>
					<text>{{ userInfo?.user_name }}</text>
				</view>
				<view> </view>
			</view>
			<view>
				<view @click="jumpBalance">
					<text class="userInfo"
						>{{
							(Number(funMoney(userInfo?.xlxw_balances)) / 100).toFixed(2)
						}}\n</text
					>
					<text>余额</text>
				</view>
				<view @click="jumpCoupon">
					<text class="userInfo"
						>{{ funCoupon(userInfo?.xlxw_coupon_users) }}\n</text
					>
					<text>优惠卷</text>
				</view>
			</view>

			<view>
				<view> <text>洗护订单</text></view>
				<view @click="jumpshoeWashing(0)">
					<text class="iconfont icon-zhifudingdan"></text>
					<text>\n未支付</text>
				</view>

				<view @click="jumpshoeWashing(1)">
					<text class="iconfont icon-shoujianxiang"></text>
					<text>\n待取货</text>
				</view>

				<view @click="jumpshoeWashing(2)">
					<text class="iconfont icon-linyu_"></text>
					<text>\n待清洗</text>
				</view>
				<view @click="jumpshoeWashing(3)">
					<text class="iconfont icon-baoguofasong"></text>
					<text>\n配送中</text>
				</view>
				<view @click="jumpshoeWashing(4)">
					<text class="iconfont icon-baoguo_shouhuo_o"></text>
					<text>\n已完成</text>
				</view>
			</view>
			<view>
				<view> <text>快捷功能</text></view>
				<view>
					<view @click="jumpshoeWashing(0)">
						<text class="iconfont icon-dingdan2"></text>
						<text>洗护订单</text>
					</view>
					<view @click="jumpHarvestAddress">
						<text class="iconfont icon-shouhuodizhi"></text>
						<text>我的地址</text>
					</view>
					<view @click="jumpActivateMembership">
						<text class="iconfont icon-huiyuan1"></text>
						<text>开通会员</text>
					</view>
					<view @click="jumpBalance">
						<text class="iconfont icon-daifukuan"></text>
						<text>充值中心</text>
					</view>
					<view @click="jumpRechargeRecord">
						<text class="iconfont icon-zhanghuyuemingxi"></text>
						<text>余额明细</text>
					</view>
					<view @click="jumpVoucherCollectionCenter">
						<text class="iconfont icon-youhuiquan1"></text>
						<text>领券中心</text>
					</view>
					<view @click="jumpCoupon">
						<text class="iconfont icon-wodeyouhuiquan"></text>
						<text>优惠券</text>
					</view>
					<view @click="jumpShareFriends">
						<text class="iconfont icon-fenxiang1"></text>
						<text>分享朋友</text>
					</view>
					<view
						v-if="userInfo !== undefined"
						@click="longOut.show = true">
						<text class="iconfont icon-icon_tuichu-"></text>
						<text>退出登陆</text>
					</view>
				</view>
			</view>
		</view>
		<u-modal
			:show="longOut.show"
			:title="longOut.title"
			:content="longOut.content"
			:showCancelButton="true"
			:buttonReverse="true"
			@cancel="longOut.show = false"
			@confirm="userlongOut"></u-modal>
	</view>
</template>

<script lang="ts" setup>
	import topNav from '../../components/navbar.vue'; //引入组件

	import {
		jumpPersonalSettings,
		jumpShareFriends,
		jumpUserLogin,
		jumpHarvestAddress,
		jumpBalance,
		jumpCoupon,
		jumpRechargeRecord,
		jumpshoeWashing,
		jumpActivateMembership,
		jumpVoucherCollectionCenter,
	} from '@/api/jumpApi';
	import { ref, watch, computed, onMounted } from 'vue';
	import store from '@/store/index';
	import { reactive } from 'vue';
	import { findUserInfo, checkToken, cgeUser, loginout } from '@/api/getApi';

	import type { Xlxw_couponuser, Xlxw_blance } from '@/interface/interface';
	import { onShow } from '@dcloudio/uni-app';
	import { tryFun } from '@/utils/tryFun';
	import head from '@/static/head_sculpture.png';

	const title = ref('我的');

	//获取用户的信息

	const longOut = reactive({
		show: false,
		content: '您确定退出吗',
		title: '退出登陆',
	});

	const userName = ref('测试名称使用');

	const getUserInfo = async () => {
		try {
			const { data } = await findUserInfo();
			store.commit('setUserInfo', data);
		} catch (e) {
			console.log('获取用户信息异常:' + e);
		}
	};

	const funCoupon = (Xlxw_coupon_users: Xlxw_couponuser[] | undefined) => {
		if (Xlxw_coupon_users === undefined) {
			return `0 / 0`;
		} else {
			const list = Xlxw_coupon_users.filter((item) => {
				return item.status === 0;
			});

			return `${list.length} / ${Xlxw_coupon_users.length}`;
		}
	};

	const userInfo = computed(() => {
		userName.value = store.state.userInfo?.user_name as string;
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

	//退出登陆

	const userlongOut = async () => {
		tryFun(
			async () => {
				await loginout();
				uni.removeStorageSync('token');
				longOut.show = false;

				store.commit('clearUserInfo');

				store.commit('clearList');

				uni.switchTab({
					url: '../index/index',
				});
			},
			() => {},
			'退出登陆失败'
		);
	};

	onShow(async () => {
		//token续期
		// const { data } = await checkToken();
		// intoData(data);
		await getUserInfo();
	});
</script>

<style lang="scss" scoped>
	@import url('../../style/style.scss');

	.main {
		font-size: 30rpx;

		> view {
			background-color: #fff;
			border-radius: 15rpx;
			align-items: center;

			&:nth-child(1) {
				background-color: #f6f6f6;
				display: flex;
				flex-direction: column;
				padding: 5% 0;

				> view:nth-child(1) {
					> image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 50%;
					}
				}

				//设置用户名
				> view:nth-child(2) {
					> text {
						font-size: 34rpx;
						color: #c4c4c4;
					}
				}
			}

			&:nth-child(2) {
				display: flex;
				justify-content: center;
				text-align: center;
				padding: 20rpx 0 20rpx 0;
				width: 95%;
				margin: 20rpx 2.5%;

				> view:nth-child(1) {
					width: 50%;
				}

				> view:nth-child(2) {
					width: 50%;
				}
			}

			&:nth-child(3) {
				width: 95%;
				margin: 20rpx 2.5%;
				padding: 30rpx 0 30rpx 0;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				flex-wrap: wrap;
				font-size: 25rpx;

				> view {
					text-align: center;

					&:nth-child(1) {
						margin-bottom: 30rpx;
						text-align: left;
						width: 95%;
						padding: 0 0 20rpx 20rpx;
						font-size: 35rpx;
						font-weight: bold;
					}

					&:nth-child(n + 2) {
						flex: 1 1 auto;

						> text:nth-child(2) {
							display: block;
						}
					}
				}
			}

			&:nth-child(4) {
				width: 95%;
				margin: 20rpx 2.5% 30rpx 2.5%;
				padding: 30rpx 0 30rpx 0;

				> view:nth-child(1) {
					text-align: left;
					width: 95%;
					padding: 0 0 20rpx 20rpx;
					font-size: 35rpx;
					font-weight: bold;
					margin-bottom: 30rpx;
				}

				> view:nth-child(2) {
					position: relative;
					font-size: 25rpx;
					display: grid;
					grid-template-columns: auto 200rpx auto;
					grid-row-gap: 10vw;

					> view {
						text-align: center;

						> text:nth-child(2) {
							display: block;
							padding-top: 25rpx;
						}
					}
				}
			}
		}
	}

	//图标的大小
	.iconfont {
		font-size: 50rpx;
		color: #848484;
	}

	.userInfo {
		font-weight: bold;
	}

	//vip板块提示语句
</style>
