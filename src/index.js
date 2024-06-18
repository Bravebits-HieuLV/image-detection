const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { detectObjects, extractText } = require("./utils/object-detection");

const app = express();
app.use(bodyParser.json());

app.post("/analyze", async (req, res) => {
  const { imageName } = req.body;
  const imagePath = path.resolve(__dirname, "../images", imageName);

  try {
    const predictions = await detectObjects(imagePath);
    const results = [];

    for (const prediction of predictions) {
      console.log({ prediction });
      const bbox = [
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2] - prediction.bbox[0],
        prediction.bbox[3] - prediction.bbox[1],
      ];
      const text = await extractText(imagePath, bbox);
      results.push({ class: prediction.class, text });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
