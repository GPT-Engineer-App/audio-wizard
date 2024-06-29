import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export async function isolateVocals(audioBlob) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const audioData = await fetchFile(audioBlob);
  ffmpeg.FS('writeFile', 'input.wav', audioData);

  await ffmpeg.run('-i', 'input.wav', '-af', 'pan=stereo|c0=c0|c1=c1', 'vocals.wav');

  const output = ffmpeg.FS('readFile', 'vocals.wav');
  const outputBlob = new Blob([output.buffer], { type: 'audio/wav' });

  return outputBlob;
}