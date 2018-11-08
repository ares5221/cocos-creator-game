var UtilsCommon = cc.Class({
    extends: cc.Component,

    statics: {
        _cameraMain: null,
        getCameraMain: function() {
            if (UtilsCommon._cameraMain == null) {
                UtilsCommon._cameraMain = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
            }
            return UtilsCommon._cameraMain;
        },

        //http://docs.cocos2d-x.org/creator/manual/zh/render/camera.html#截图
        //https://github.com/cocos-creator/example-cases/blob/master/assets/cases/07_render_texture/render_to_canvas.js
        getScreenshotBase64: function(camera) {
            let texture = new cc.RenderTexture();
            let gl = cc.game._renderContext;
            texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
            camera.targetTexture = texture;
            camera.render();
            camera.targetTexture = null;

            let data = texture.readPixels();

            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = texture.width;
            canvas.height = texture.height;

            let width = texture.width;
            let height = texture.height;
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = srow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start+i];
                }

                ctx.putImageData(imageData, 0, row);
            }

            let dataURL = canvas.toDataURL("image/jpeg");
            return dataURL;
        },
    },
});
