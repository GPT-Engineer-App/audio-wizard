export async function removeSilence(audioBlob) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);
  const silenceThreshold = 0.01;
  const minSilenceDuration = 0.5 * audioBuffer.sampleRate;

  let start = 0;
  let end = channelData.length;

  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > silenceThreshold) {
      start = i;
      break;
    }
  }

  for (let i = channelData.length - 1; i >= 0; i--) {
    if (Math.abs(channelData[i]) > silenceThreshold) {
      end = i;
      break;
    }
  }

  if (end - start < minSilenceDuration) {
    return audioBlob;
  }

  const trimmedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    end - start,
    audioBuffer.sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    trimmedBuffer.copyToChannel(
      audioBuffer.getChannelData(channel).subarray(start, end),
      channel
    );
  }

  const offlineContext = new OfflineAudioContext(
    trimmedBuffer.numberOfChannels,
    trimmedBuffer.length,
    trimmedBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = trimmedBuffer;
  source.connect(offlineContext.destination);
  source.start();

  const renderedBuffer = await offlineContext.startRendering();
  const renderedBlob = await new Promise((resolve) => {
    offlineContext.oncomplete = (event) => {
      const renderedBuffer = event.renderedBuffer;
      const wavBlob = bufferToWaveBlob(renderedBuffer);
      resolve(wavBlob);
    };
  });

  return renderedBlob;
}

function bufferToWaveBlob(buffer) {
  const numOfChan = buffer.numberOfChannels,
    length = buffer.length * numOfChan * 2 + 44,
    bufferArray = new ArrayBuffer(length),
    view = new DataView(bufferArray),
    channels = [],
    sampleRate = buffer.sampleRate;

  let offset = 0,
    pos = 0;

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample =
        (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  return new Blob([bufferArray], { type: "audio/wav" });
}