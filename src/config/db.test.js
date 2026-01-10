require('dotenv').config();
console.log('PASSWORD:', process.env.DB_PASSWORD);

require('./db');
