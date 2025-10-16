const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://gabrieldosaas_db_user:0jNkAFGD7UBSpwxM@cluster0.wt7xarj.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectToDb;