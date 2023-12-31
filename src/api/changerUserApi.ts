//修改头像信息
export const changeImages = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
            console.log(JSON.stringify(res.tempFilePaths));

        }
    });
}