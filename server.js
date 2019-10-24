const express = require('express');


const app = express();

// app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.send('helloworld');
});

app.listen(5000);
console.log('Open http://localhost:5000/ in Browser to start');
