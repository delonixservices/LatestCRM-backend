const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');  
const config = require('./config/config');
const userRoutes = require('./src/route/userRoute');
const roleRoutes = require('./src/route/roleRoute');
const leadRoutes = require('./src/route/leadRoute');
const cors = require('cors');

const app = express();
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/leads', leadRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});