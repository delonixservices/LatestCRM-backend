const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');  

const userRoutes = require('./src/route/userRoute');
roleRoutes = require('./src/route/roleRoute');

const app = express();
mongoose.connect('mongodb://localhost:27017/crm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});