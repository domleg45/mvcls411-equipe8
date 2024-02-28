let currentSession;
let currentMediaSession;
let isPlaying = true;
let currentVideoIndex = 0;
let currentVideoUrl;
let updateInterval;
let previousVolumeLevel = 0.5;
const seekSlider = document.getElementById('seekSlider');
const currentTimeElement = document.getElementById('currentTime');
const totalTimeElement = document.getElementById('totalTime');
const defaultContentType = 'video/mp4';
const applicationID = '3DDC41A0';
const videoList = [
    'https://transfertco.ca/video/DBillPrelude.mp4',
    'https://transfertco.ca/video/DBillSpotted.mp4',
    'https://transfertco.ca/video/usa23_7_02.mp4'
];

CONNECTION_ERROR = "CONNECTEZ VOUS";
SUCCESS = "SUCCESS"
ERROR = "ERROR";

function onError(error) {
    console.error('Chromecast initialization error', error);
}

function onSuccess() {
    console.log(SUCCESS);
}

function sessionListener(newSession) {
    currentSession = newSession;
}

function receiverListener(availability) {
    if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } else {
        document.getElementById('connectButton').style.display = 'none';
    }
}


// ========================================================================================================
document.getElementById('connectButton').addEventListener('click', () => {
    const sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    //initCurrentSession
    const apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

    chrome.cast.initialize(apiConfig, onSuccess, onError);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSession) {
        // 1 + 2 % 3 = 0
        currentVideoIndex = (currentVideoIndex + 1) % videoList.length;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert(CONNECTION_ERROR);
    }
});

document.getElementById("previousBtn").addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex--;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert(CONNECTION_ERROR);
    }
})


document.getElementById('playBtn').addEventListener('click', () => {
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

var slider = document.getElementById("volume-slider");
slider.step = 0.01;
slider.oninput = function() {
    const volume = new chrome.cast.Volume(parseFloat(slider.value), false);
    const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
    currentMediaSession.setVolume(volumeRequest, onSuccess, onError);
}


document.getElementById("backward").addEventListener('click', () => {
    currentTime = currentMediaSession.getEstimatedTime();

})

document.getElementById("forward").addEventListener('click', () => {
    currentTime = currentMediaSession.getEstimatedTime();
})
// ========================================================================================================


function initCurrentMediaSession(mediaSession) {
    currentMediaSession = mediaSession;
 }


function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
    const mediaInfo = new chrome.cast.media.MediaInfo(videoUrl, defaultContentType);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    currentMediaSession = request;
    currentSession.loadMedia(request, mediaSession => {
        console.log('Media chargé avec succès');
        initCurrentMediaSession(mediaSession);
      }, onError);
}

function start() {
    if (currentSession) {
        loadMedia(videoList[currentVideoIndex]);
    } else {
        alert('Connectez-vous sur chromecast en premier');
    }
}
