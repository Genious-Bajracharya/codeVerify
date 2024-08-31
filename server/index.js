// server/index.js
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.post("/api/verify", (req, res) => {
  const { code } = req.body;

  if (isNaN(code) || code.length !== 6 || code[5] === "7") {
    return res.status(400).json({ message: "Invalid code" });
  }

  res.status(200).json({ message: "Code verified successfully" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
