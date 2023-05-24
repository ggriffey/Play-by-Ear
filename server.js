const express = require("express");

const app = express();

const path = require("path");
const port = process.env.port || 8080;

// serve the files in Public
app.use(express.static(path.join(__dirname, "public")));

// serve the HTML
app.get("/", function (req, res) {
  res.sendFile(
    "/Users/ggriffey/Documents/VS Code/FUNCTIONAL WEBSITES/Play by Ear/public/index.html"
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
