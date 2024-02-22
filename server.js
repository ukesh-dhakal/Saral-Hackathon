const express = require('express');
const os = require("os");
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql2');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      for (const info of interfaceInfo) {
          if (info.family === 'IPv4' && !info.internal) {
              return info.address;
          }
      }
  }
  return null;
};

app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'ecomart', 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    connection.query('SELECT * FROM items', (err, rows) => {
      if (err) {
        console.error('Error querying votes from MySQL:', err);
      } else {
        rows.forEach((row) => {
          items[row.sn - 1].cart = row.cart;
        });
        io.emit('updateVotes', items);
      }
    });
  }
});

const items = [
  { name: '100% Desi Ghee',price: 'Rs.300',img: 'ghee.jpg' ,description:'Embrace tradition, savor purity: Taste the richness of desi ghee...',item_no: 1, cart: 0 },
  { name: 'Himalayan Yak Chhurpi', price: 'Rs.300',img: "chhurpi.jpg" ,description:'Savor Himalayan heritage: Experience the essence of Chhurpi..',item_no: 2, cart: 0 },
  { name: 'Homemade Gundruk', price: 'Rs.300',img: 'gundruk.jpg' ,description:'Preserving tradition, nurturing flavor: Discover the tang of Gundruk.', item_no: 3, cart: 0 },
  { name: 'Homemade Hing',  price: 'Rs.300',img: 'hing.jpg' ,description:'Unlocking aroma, enhancing taste: Delight in the essence of Hing.',item_no: 4, cart: 0 },
  { name: 'Fresh Vegetable',   price: 'Rs.300',img: '1.jpg' ,description:'Handpicked veggies from your local farmers..', item_no: 5, cart: 0 },
  { name: 'Homemade pickle', price: 'Rs.300',img: 'https://www.thegundruk.com/wp-content/uploads/2016/11/Tomato-pickle-with-radish-seeds-and-spices-under-sunlight-for-fermentation.jpg' ,description:'Hand made pickles made from radish and chillies...', item_no: 6, cart: 0 },
  { name: 'Lumbini Academy Gyandeep Sikshya',item_no: 7, cart: 0 },
  { name: 'Mnemonc Modern Academy',item_no: 8, cart: 0 },
  { name: 'St. Lawrence College',item_no: 9, cart: 0 },
  { name: 'MerryLand English School',item_no: 10, cart: 0 },
  { name: 'Mokshda School',item_no: 11, cart: 0 },
  { name: 'New Sunshine School',item_no: 12, cart: 0 },
  { name: 'St. Lawrence Secondary School',item_no: 13, cart: 0 },
  { name: 'Mission Public School',item_no: 14, cart: 0 },
  { name: 'Texas Secondary School',item_no: 15, cart: 0 },
  { name: 'VS.Niketan School',item_no: 16, cart: 0 },
  { name: 'Tri-Jyoti Secondary School',item_no: 17, cart: 0 },
  { name: 'The Celebration Co-Ed',item_no: 18, cart: 0 },
  { name: 'Anmol Jyotui SEB School',item_no: 19, cart: 0 },
  { name: 'Southwestern State Secondary School',item_no: 20, cart: 0 },
  { name: 'Candidate 1',item_no: 21, cart: 0 },
  { name: 'Candidate 2',item_no: 22, cart: 0 },
  { name: 'Candidate 1',item_no: 23, cart: 0 },
  { name: 'Candidate 2',item_no: 24, cart: 0 },
  { name: 'Candidate 1',item_no: 25, cart: 0 },
  { name: 'Candidate 2',item_no: 26, cart: 0 }
];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('updateItems', items);

  socket.on('cart', (Index) => {
    
    const candidate = items[Index - 1];
    connection.query(
      'UPDATE items SET cart = cart + 1 WHERE sn = ?',
      [candidate.item_no],
      (err, results) => {
        if (err) {
          console.error('Error updating items in MySQL:', err);
        } else {
          connection.query('SELECT * FROM items', (err, rows) => {
            if (err) {
              console.error('Error querying items from MySQL:', err);
            } else {
              rows.forEach((row) => {
                items[row.sn - 1].cart = row.cart;
              });

              io.emit('updateItems', items);
            }
          });
        }
      }
    );
  });

  socket.on('uncart', (Index) => {
    
    const candidate = items[Index - 1];
    connection.query(
      'UPDATE items SET cart = 0 WHERE sn = ?',
      [candidate.item_no],
      (err, results) => {
        if (err) {
          console.error('Error updating items in MySQL:', err);
        } else {
          connection.query('SELECT * FROM items', (err, rows) => {
            if (err) {
              console.error('Error querying items from MySQL:', err);
            } else {
              rows.forEach((row) => {
                items[row.sn - 1].cart = row.cart;
              });

              io.emit('updateItems', items);
            }
          });
        }
      }
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
server.listen(port, () => {
  try {
      
      const localIP = getLocalIP();
      console.log("\n\nServer started on port\n\n\tlocal:", `http://localhost:${port}`);
      if (localIP) {
          console.log("\texternal:", `http://${localIP}:${port}`);
      } else {
          console.log("Local IP not available.");
      }
  } catch (err) {
      console.log(err);
  }
});