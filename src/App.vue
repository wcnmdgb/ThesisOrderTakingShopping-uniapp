<!-- @format -->

<script setup lang="ts">
	import {
		onLaunch,
		onShow,
		onHide,
		onLoad,
		onUnload,
	} from '@dcloudio/uni-app';

	onLaunch(async () => {});
	onShow(() => {
		console.log('App Show');
	});
	onHide(async () => {});
	onUnload(async () => {});
</script>
<style lang="scss">
	@import 'uview-plus/index.scss';

	#app,
	uni-app,
	uni-page,
	page {
		background-color: #f6f6f6;
	}

	::v-deep .u-button {
		background-color: #2b85e4;
	}
</style>
