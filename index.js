const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;
const db = require('mysql2');

const dbc = db.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'wst'
});
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  let data = dbc.query('SELECT * FROM pesan', (err, results) => {
    if (err) {
      res.status(500).send('Kesalahan sisi server');
    } else {
      res.render(__dirname + '/index.ejs', { dataPesan: results });
    }
  });
});
io.on('connection', (socket) => {
  socket.on('send data', (pesan) => {
    const query = 'INSERT INTO pesan (username, pesan) VALUES (?, ?)';
    dbc.query(query, [pesan.username, pesan.pesan]);
    io.emit('send data', (pesan));
  });
});
server.listen(port, () => {
  console.log('berjalan');
});
