const express = require('express');

const app = express();

app.get('/api/route', (req, res) => {
  console.log(req);
  res.status(200).json({
    data: [],
    message: 'data retrieved',
  });
});

app.post('/', (req, res) => {
  res.status(200).json({
    data: [],
    message: 'data retrieved',
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App runing in port  ${port}`);
});
