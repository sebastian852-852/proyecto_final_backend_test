require('dotenv').config({path: '.env.example'});
const app=require('./app');
const connect=require('./database')

app.listen(app.get('port'),()=>{
    console.log(`Server is running on port ${app.get('port')}`);
    connect();
});