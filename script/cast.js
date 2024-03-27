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
//https://www.w3schools.com/html/mov_bbb.mp4

const CONNECTION_ERROR = "Vous devez connecter la console à un chromecast en premier";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const ON_SUCCESSFUL_MEDIA_LOAD = "Media chargé avec succès";
const ON_INIT_ERROR = "Erreur d'initialization";
const UNMUTED_ICON = "fa-volume-low";
const MUTED_ICON = "fa-volume-xmark";
const ADD_VIDEO_STRING = "Lien vers une ressource MP4 (exemple : https://transfertco.ca/video/DBillPrelude.mp4): ";
const onAddVideoError = "Mauvais lien";
const seekValue = 11;
const help = "Voici les étapes pour vous connecter et utiliser le chromcast\n1. Pour se connecter au chromcast, cliquez sur le bouton start au milieu.\n2. Normalement, la vidéo devrait démarrer quelques secondes après votre clique.\n3. Pour changer de vidéo : Cliquez sur les flèches droite ou gauche qui se trouvent à gauche.\n4. Avancer ou reculer la vidéo : Cliquez sur les flèches qui se trouvent en dessous du bouton start\n5. Pour mute : Cliquez sur le bouton mute."

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
let volumeIcon = document.getElementById("volumeIcon");
let playPauseIcon = document.getElementById("playPauseIcon");
let helpIcon = document.getElementById("help");

let seekBackwardIncator = document.getElementById("seekValueB").innerHTML = "-" + seekValue + "s";
let seekForwardIndicator = document.getElementById("seekValueF").innerHTML = "+" + seekValue + "s";
//let volumeLevelIndicator = document.getElementById("volumeLevel").innerHTML = 0;




function volumeIconToMute() {
    volumeIcon.classList.remove(UNMUTED_ICON);
    volumeIcon.classList.add(MUTED_ICON);
}

function volumeIconToUnMute() {
    volumeIcon.classList.remove(MUTED_ICON);
    volumeIcon.classList.add(UNMUTED_ICON);
}

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

function connectionError() {
    alert(CONNECTION_ERROR);
}

/**function receiverListener(availability) {
    /**if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
        document.getElementById('connectButton').style.display = 'block';
    } //else {
        document.getElementById('connectButton').style.display = 'none';
    }
}*/

function initCurrentMediaSession(mediaSession) {
    currentMediaSession = mediaSession;
}

function loadMedia(videoUrl) {
    currentVideoUrl = videoUrl;
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
        connectionError();
    }
}

function mute() {
    if (currentMediaSession) {
        const volume = new chrome.cast.Volume(previousVolumeLevel, !currentMediaSession.volume.muted);
        const volumeRequest = new chrome.cast.media.VolumeRequest(volume);
        currentMediaSession.setVolume(volumeRequest, onSuccess, onError);
        if (!currentMediaSession.volume.muted) {
            volumeIconToMute();
            slider.value = 0;
        } else {
            volumeIconToUnMute();
            slider.value = previousVolumeLevel;
        }
    }
}

function addVideo() {
    let mp4Url = prompt(ADD_VIDEO_STRING);
    if (mp4Url !== "" && mp4Url.endsWith(".mp4")) {
        videoList.push(mp4Url); 
    } else {
        connectionError();
    }
}

function helpMessage(){
    alert(help)
}
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
        connectionError();
    }
});

previousBtn.addEventListener('click', () => {
    if (currentSession) {
        currentVideoIndex == 0 ? currentVideoIndex = videoList.length - 1 : currentVideoIndex--;
        loadMedia(videoList[currentVideoIndex]);
    } else {
        connectionError();
    }
})


playBtn.addEventListener('click', () => {
    if (currentMediaSession) {
        playPauseIcon.classList = [];
        if (!isPlaying) {
            currentMediaSession.play(null, onSuccess, onError);
            playPauseIcon.classList.add("fa", "fa-pause");
        } else {
            currentMediaSession.pause(null, onSuccess, onError);
            playPauseIcon.classList.add("fa", "fa-play");
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

function seekBy(seconds) {
    if (currentMediaSession) {
        let request = new chrome.cast.media.SeekRequest();
        request.currentTime = currentMediaSession.getEstimatedTime() + seconds;
        currentMediaSession.seek(request, onSuccess, onError);
    } else {
        console.log();
    }
}

backwardBtn.addEventListener('click', () => {
    seekBy(-seekValue);

})

forwardBtn.addEventListener('click', () => {
    seekBy(seekValue);
})

helpIcon.addEventListener('click', helpMessage)
// ========================================================================================================


