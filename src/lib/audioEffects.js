export const applyDistortion = (audioContext, audioBuffer, amount) => {
  const distortion = audioContext.createWaveShaper();
  distortion.curve = makeDistortionCurve(amount);
  distortion.oversample = '4x';

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(distortion);
  distortion.connect(audioContext.destination);

  return source;
};

export const applyDelay = (audioContext, audioBuffer, delayTime) => {
  const delay = audioContext.createDelay();
  delay.delayTime.value = delayTime;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(delay);
  delay.connect(audioContext.destination);

  return source;
};

export const applyFilter = (audioContext, audioBuffer, type, frequency) => {
  const filter = audioContext.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(filter);
  filter.connect(audioContext.destination);

  return source;
};

export const applyEqualizer = (audioContext, audioBuffer, settings) => {
  const { low, mid, high } = settings;

  const lowFilter = audioContext.createBiquadFilter();
  lowFilter.type = "lowshelf";
  lowFilter.frequency.value = 320;
  lowFilter.gain.value = low;

  const midFilter = audioContext.createBiquadFilter();
  midFilter.type = "peaking";
  midFilter.frequency.value = 1000;
  midFilter.gain.value = mid;

  const highFilter = audioContext.createBiquadFilter();
  highFilter.type = "highshelf";
  highFilter.frequency.value = 3200;
  highFilter.gain.value = high;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(lowFilter);
  lowFilter.connect(midFilter);
  midFilter.connect(highFilter);
  highFilter.connect(audioContext.destination);

  return source;
};

export const applyNoiseReduction = (audioContext, audioBuffer) => {
  // Implement noise reduction logic here
  // This is a placeholder implementation
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  return source;
};

export const detectClipping = (audioBuffer) => {
  const channelData = audioBuffer.getChannelData(0);
  for (let i = 0; i < channelData.length; i++) {
    if (channelData[i] > 1 || channelData[i] < -1) {
      return true;
    }
  }
  return false;
};

export const normalizeAudio = (audioBuffer) => {
  const channelData = audioBuffer.getChannelData(0);
  const maxAmplitude = Math.max(...channelData.map(Math.abs));
  const normalizationFactor = 1 / maxAmplitude;

  for (let i = 0; i < channelData.length; i++) {
    channelData[i] *= normalizationFactor;
  }

  return audioBuffer;
};

const makeDistortionCurve = (amount) => {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
};