const express = require('express');
const cors = require('cors');
const connectToDb = require('./db/connectToDb');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json({limit: "50mb"}));
app.use('/api', routes);

connectToDb();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});