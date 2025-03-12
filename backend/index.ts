import { addMakeSentence } from './make-sentence';

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from "url";
import * as path from "path";

const app = express();
const port = 3000;

// Middleware to parse JSON body content
app.use(cors());
app.use(express.json());

addMakeSentence(app);

app.use(express.static('static'));
app.get("*", (req, res) => {
  res.sendFile(
    path.dirname(fileURLToPath(import.meta.url)) + "/static/index.html",
  );
});

app.listen(port, () => {
  console.log(`Chinse-learn listening on port ${port}!`);
});
