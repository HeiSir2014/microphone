// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.onload = () => {

    const audioInputSelect = document.querySelector('select#audioSource');

    function handleError(error) {
        const errorMessage = 'navigator.MediaDevices.getUserMedia error: ' + error.message + ' ' + error.name;
        console.log(errorMessage);
    }
    function gotDevices(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        let value = null;
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            !value && (value = deviceInfo.deviceId);
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
                audioInputSelect.appendChild(option);
            }
        }

        audioInputSelect.onchange = play;
        audioInputSelect.value = value;
        play();
    }

    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    function play() {
        const audio = document.querySelector('audio');
        function handleSuccess(stream) {
            const audioTracks = stream.getAudioTracks();
            console.log('Using audio device: ' + audioTracks[0].label);
            stream.oninactive = function () {
                console.log('Stream ended');
            };
            audio.srcObject = stream;
        }
        const audioSource = audioInputSelect.value;
        navigator.mediaDevices.getUserMedia({ audio:{deviceId: audioSource ? {exact: audioSource} : undefined}, video: false }).then(handleSuccess).catch(handleError);
    }

}