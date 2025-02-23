(() => {
  let nonaudio = [];
  let timestamp = [];
  let videoElement = null;
  let index = 0;
  let duration = 0;

  const getnonaudio = () => {
    if (!videoElement) {
      videoElement = document.querySelector("video");
      // videoElement.addEventListener('seeking', () => {
      //   console.log('使用者正在改變進度條...');
      // });

      videoElement.addEventListener('seeked', () => {
        skipTime();
        // console.log('進度條調整完成，當前時間:', videoElement.currentTime);
      });
    }
    videoElement.addEventListener('loadedmetadata', () => {
      duration = videoElement.duration;
    })

    const seekbarseg = document.getElementsByClassName("seekbar-segment");
    if (seekbarseg.length > 2) {
      let tmp = [...seekbarseg];
      nonaudio = tmp.slice(2, (tmp.length / 2));
      timestamp = [];
      for (var i = 0; i < nonaudio.length; i++) {
        timestamp.push({ left: nonaudio[i].style.left, width: nonaudio[i].style.width });
      }
    }
  }


  const skipTime = () => {
    if(timestamp.length == 0){
      // console.log('no timestamp');
      return;
    }
    // console.log(duration);
    let curr = videoElement.currentTime;
    // console.log(`currentTime: ${curr}`);
    // console.log(`index: ${index}`)
    if ( index < timestamp.length && curr > (parseFloat(timestamp[index].left) * duration / 100)) {
      // console.log('bigger');
      while (index < timestamp.length && curr > (parseFloat(timestamp[index].left) * duration / 100)) {
        index++;
      }
    }
    else {
      // console.log('smaller');
      while (index > 0 && curr < (parseFloat(timestamp[index - 1].left) * duration / 100)) {
        index--;
      }
    }
    // console.log(`index: ${index}`);

    while (index > 0 && index <= timestamp.length && curr >= (parseFloat(timestamp[index-1].left) * duration / 100) - 10 && curr <= ((parseFloat(timestamp[index-1].left) + parseFloat(timestamp[index-1].width)) * duration / 100)) {
      // console.log(`skip ${index}`);
      videoElement.currentTime = ((parseFloat(timestamp[index-1].left) + parseFloat(timestamp[index-1].width)) * duration / 100) + 20;
      curr = videoElement.currentTime;
      if(index < timestamp.length)index++;
    }
  }



  chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.type === "NEW") {
      getnonaudio();
      if (timestamp.length !== 0) {
        skipTime();
      }
      // console.log('new');
      response("sucess");
      // response(currentSong);
    }
  });
})();