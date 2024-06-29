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