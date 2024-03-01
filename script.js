const video = document.getElementById('video');
const video2 = document.getElementById('video2')
const canvas = document.getElementById('canvas');
const UserMediaBtn = document.getElementById('UserMediaBtn');
const controlPanel = document.getElementById('controlPanel');
const ctx = canvas.getContext('2d');

let videoW = 0;
let videoN = 0;
const constraints = {
    video: { 
      facingMode: 'environment',
      frameRate: 60,
    },
    audio: false
  };

function media(mode){
  if(mode === 'camera'){
    videoN = 0
      navigator.mediaDevices.getUserMedia(constraints).then(streamFunc)
  }
  else if(mode === 'displayMedia'){
    videoN = 1
    navigator.mediaDevices.getDisplayMedia(constraints).then(streamFunc);
  }

}

function streamFunc(stream){
  const videoTrack = stream.getVideoTracks()[0];

  const constraints = {
    width: {
      ideal: 1920,     // 希望する幅
      min: 1920        // 最小値として指定
    },
    height: {
      ideal: 1080,      // 希望する高さ
      min: 1080         // 最小値として指定
    }
  };

  videoTrack.applyConstraints(constraints)
    .then(() => {
      let VIDEO;
      if(videoN === 0){
        VIDEO = video;
      }else{
        VIDEO = video2;
      }
      VIDEO.srcObject = stream;
      VIDEO.addEventListener('play',()=>{
      if(videoN === 0){
        canvas.height = VIDEO.videoHeight;
        videoW = VIDEO.videoWidth;
        canvas.width = videoW * 2;
        videodraw(VIDEO)
      }else{
        videodraw2(VIDEO)
      }

    
    });
    })
}


UserMediaBtn.addEventListener('click',()=>{
  media('camera');
})

displayMediaBtn.addEventListener('click',()=>{
  ctrlDisplayNone();
  media('displayMedia');
})

function ctrlDisplayNone(){
  controlPanel.style.display = 'none';
}

function videodraw(VIDEO){
  const draw = () => {
    if (VIDEO.paused || VIDEO.ended) {
      return;
    }
    ctx.globalAlpha = 1; // 透明度を設定（0から1の間、1が不透明）
    ctx.drawImage(VIDEO, 0, 0, videoW, canvas.height);
    ctx.drawImage(VIDEO, videoW + 1, 0, videoW, canvas.height);

    requestAnimationFrame(draw);
  };

  draw();
}
let test0 = 0;
let test1 = 0;

// let test0 = videoW / 3
// let test1 = canvas.height / 3
function videodraw2(VIDEO){
  const rate = 1.5;
  let newVideoW = videoW / rate;
  let newHeight = canvas.height / rate;
  const draw = () => {
    if (VIDEO.paused || VIDEO.ended) {
      return;
    }
    ctx.globalAlpha = 0.7; // 透明度を設定（0から1の間、1が不透明）
    ctx.drawImage(VIDEO, videoW / 6, canvas.height / 6, newVideoW, newHeight);
    ctx.drawImage(VIDEO, videoW + (videoW / 6), canvas.height / 6, newVideoW, newHeight);

    requestAnimationFrame(draw);
  };

  draw();
}


let localStream;
const st_option = {
  video: { 
    frameRate: 60,
  },
  audio: {
      sampleRate: 44100
  }
}
document.getElementById('btn00').onclick = () => {

navigator.mediaDevices.getDisplayMedia(st_option)
  .then( stream => {
  video.srcObject = stream;
  video.play();
  localStream = stream;
  document.getElementById('shareID').textContent = "接続ID: " + peer.id;
  let mv = document.getElementById('myV')
  mv.setAttribute("playsinline",'')
  mv.setAttribute("controls",'')
})

}
const peer = new Peer({key: 'b2ec5df0-85b1-4e32-965f-072a7379a325'});

document.getElementById('btn').onclick = () => {

  let idv = document.getElementById('ID').value;
  const ID = idv.replace(' ','');
  const dataConnection = peer.connect(ID);
  const mediaConnection = peer.call(ID, localStream);
    setEventListener(mediaConnection);
  alert(ID + "に接続")
  // ctrlDisplayNone();
};

//映像
  // 相手側のやつ
  const setEventListener = mediaConnection => {
    mediaConnection.on('stream', stream => {
      const videoTrack = stream.getVideoTracks()[0];
      const constraints = {
        width: {
          ideal: 2560,     // 希望する幅
          min: 1920        // 最小値として指定
        },
        height: {
          ideal: 1440,      // 希望する高さ
          min: 1080         // 最小値として指定
        }
      };
  
      videoTrack.applyConstraints(constraints)
      video2.srcObject = stream;
      video2.play();
      video2.addEventListener('play',()=>{
        videodraw2(video2)

      });

    });
  }

peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
});
