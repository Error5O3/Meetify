const express = require('express');
const path = require('path');
const app = express();
const port = 8080; // app port

// uses files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Meetify page listening at http://localhost:${port}`);
});
