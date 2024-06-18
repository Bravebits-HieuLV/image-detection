const tf = require("@tensorflow/tfjs-node");
const cocoSsd = require("@tensorflow-models/coco-ssd");
const { createCanvas, loadImage } = require("canvas");
const Tesseract = require("tesseract.js");

async function detectObjects(imagePath) {
  const model = await cocoSsd.load();
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, image.width, image.height);
  const input = tf.browser.fromPixels(canvas);

  const predictions = await model.detect(input);
  input.dispose();
  return predictions;
}

async function extractText(imagePath, bbox) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, ...bbox, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL();
  console.log({ dataUrl });
  const result = await Tesseract.recognize(dataUrl, "eng");
  console.log({ result });
  return result.data.text.trim();
}

module.exports = { detectObjects, extractText };
