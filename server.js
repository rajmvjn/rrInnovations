const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();
const PORT = process.env.PORT || 5000; // on the server it takes from PORT, on dev it takes 5000

//initialize middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('App running'));

//routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));