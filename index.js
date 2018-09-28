const express = require('express');
const path = require('path');
const app = express();

const port = 3010;
const staticPath = path.dirname(__dirname);
app.use(express.static(`${staticPath}/MusicPlayer/public`));
app.get('/', (req, res) => res.sendFile(`${staticPath}/MusicPlayer/public/index.html`));
app.listen(port, () => console.log(`server running on port ${port}`));
