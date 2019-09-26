const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

connectDB();
// on the server it takes from PORT, on dev it takes 5000

//initialize middleware
app.use(express.json({extended: false}));

//routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

//static asset in production
if( process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(client/build));

    app.get( '*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));