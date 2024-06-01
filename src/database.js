const mongoose = require('mongoose');

const connect = async () => {
        try {
                const connection = await mongoose.connect(process.env.MONGO_URI || '', {
                        dbName: process.env.MONGO_DBNAME || '',
                });
                console.log('Database connected');
                return connection;
        } catch (err) {
                console.error(err);
        }
};

module.exports = connect;