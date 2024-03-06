let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let previousVolumeLevel = 0;
const defaultContentType = 'video/mp4';
const applicationID = '3DDC41A0';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4'
];

const CONNECTION_ERROR = "CONNECTEZ VOUS";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const NOT_YET_IMPLEMENTED = "NOT YET IMPLEMENTED";
const ON_SUCCESSFUL_MEDIA_LOAD = "Media chargé avec succès";
const ON_INIT_ERROR = 'Chromecast initialization error';

function onError(error) {
    console.error(ON_INIT_ERROR, error);
}

function onSuccess() {
    console.log(SUCCESS);
}

function sessionListener(newSession) {
    currentSession = newSession;
    start();
}

function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } else {
        document.getElementById('connectButton').style.display = 'none';
    }
}

function initCurrentMediaSession(mediaSession) {
    currentMediaSession = mediaSession;
}

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    //specify content type
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    currentMediaSession = request;
    currentSession.loadMedia(request, mediaSession => {
        console.log(ON_SUCCESSFUL_MEDIA_LOAD);
        initCurrentMediaSession(mediaSession);
      }, onError);
}

function start() {
    if (currentSession) {
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert(CONNECTION_ERROR);
    }
}

function mute() {
    const volume = new chrome.cast.Volume(previousVolumeLevel, !currentMediaSession.volume.muted);
    const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
    currentMediaSession.setVolume(volumeRequest, onSuccess, onError);
}

function addVideo() {
    let mp4Url = prompt("mp4 file url : ");
    if (mp4Url !== "") {
        videoList.push(mp4Url); 
    }
}

function notYetImplemented() {
    alert(NOT_YET_IMPLEMENTED);
}


let captureBtn = document.getElementById("capture");
let connectButton = document.getElementById('connectButton');
let nextBtn = document.getElementById('nextBtn');
let previousBtn = document.getElementById("previousBtn");
let playBtn = document.getElementById('playBtn');
let slider = document.getElementById("volume-slider"); slider.step = 0.01;
let backwardBtn = document.getElementById("backward");
let forwardBtn = document.getElementById("forward");
let muteBtn = document.getElementById("muteButton");
let addVideoButton = document.getElementById("add-video");
let upBtn = document.getElementById("upBtn");
let downBtn = document.getElementById("downBtn");

connectButton.addEventListener('click', () => {
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    //initCurrentSession
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);
    chrome.cast.initialize(apiConfig, onSuccess, onError);
});

nextBtn.addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert(CONNECTION_ERROR);
    }
});

previousBtn.addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex = (currentVideoIndex - 1) % videoList.length;
        
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert(CONNECTION_ERROR);
    }
})


playBtn.addEventListener('click', () => {
    let playPauseIcon = document.getElementById("playPauseIcon");
    if (currentMediaSession) {
        playPauseIcon.classList = [];
        if (isPlaying) {
            currentMediaSession.pause(null, onSuccess, onError);
            playPauseIcon.classList.add("fa", "fa-play");
        } else {
            currentMediaSession.play(null, onSuccess, onError);
            playPauseIcon.classList.add("fa", "fa-pause");
        }
        isPlaying = !isPlaying;
    }
});

slider.oninput = () => {
    if (currentMediaSession) {
        let sliderValue = slider.value;
        const volume = new chrome.cast.Volume(sliderValue, false);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onSuccess, onError);
        previousVolumeLevel = sliderValue;
    }
}

backwardBtn.addEventListener('click', () => {
    let request = new chrome.cast.media.SeekRequest();
    request.currentTime = currentMediaSession.getEstimatedTime() - 10;
    currentMediaSession.seek(request, onSuccess, onError);

})

forwardBtn.addEventListener('click', () => {
    let request = new chrome.cast.media.SeekRequest();
    request.currentTime = currentMediaSession.getEstimatedTime() + 10;
    currentMediaSession.seek(request, onSuccess, onError);
})

captureBtn.addEventListener('click', notYetImplemented);
upBtn.addEventListener('click', notYetImplemented);
downBtn.addEventListener('click', notYetImplemented);
muteBtn.addEventListener('click', mute);
addVideoButton.addEventListener('click', addVideo);
// ========================================================================================================


