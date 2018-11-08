window.AudioContext = window.AudioContext || window.webkitAudioContext;

cc.Class({
    extends: cc.Component,

    properties: {
        voiceLevel: 0,
        _inited: false,
        _audioContext: null,
        _audioInput: null,
        _analyserNode: null,
        _freqByteData: null
    },

    // use this for initialization
    onLoad () {
        this._audioContext = new AudioContext();

        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

        var self = this;
        navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, function (stream) {
                // Create analyser node
                var audioContext = self._audioContext;
                var inputPoint = audioContext.createGain();

                var audioInput = audioContext.createMediaStreamSource(stream);
                audioInput.connect(inputPoint);

                var analyserNode = audioContext.createAnalyser();
                analyserNode.fftSize = 2048;
                inputPoint.connect(analyserNode);

                var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
                analyserNode.getByteFrequencyData(freqByteData);

                self._freqByteData = freqByteData;
                self._analyserNode = analyserNode;
                self._audioInput = audioInput;

                self._inited = true;
            }, function (e) {
                alert('Error getting audio');
                console.log(e);
                self._inited = false;
            });

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._inited) {
            var analyser = this._analyserNode,
                freqByteData = this._freqByteData;
            analyser.getByteFrequencyData(freqByteData);
            var sum = 0;
            for (var i = 0; i < freqByteData.length; i++) {
                sum += freqByteData[i];
            }
            this.voiceLevel = sum / freqByteData.length;
        }
    },
});
