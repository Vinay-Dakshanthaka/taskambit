const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.query("CREATE DATABASE IF NOT EXISTS testDB", (err, results)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Database created successfully ", results)
    }
})

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database.');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./userModel.js')(sequelize, DataTypes);

module.exports = db;

// const dbConfig = require('../config/dbConfig.js');
// const { Sequelize, DataTypes } = require('sequelize');

// const sequelizeWithDB = new Sequelize(
//     '',
//     dbConfig.USER,
//     dbConfig.PASSWORD, {
//         host: dbConfig.HOST,
//         dialect: dbConfig.dialect,
//         operatorsAliases: false,
//         pool: {
//             max: dbConfig.pool.max,
//             min: dbConfig.pool.min,
//             acquire: dbConfig.pool.acquire,
//             idle: dbConfig.pool.idle
//         }
//     }
// );

// async function initializeDatabase() {
//     try {
//         await sequelizeWithDB.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\`;`);
//         console.log(`Database ${dbConfig.DB} created successfully or already exists`);

//         await sequelizeWithDB.close();

//         const sequelize = new Sequelize(
//             dbConfig.DB,
//             dbConfig.USER,
//             dbConfig.PASSWORD, {
//                 host: dbConfig.HOST,
//                 dialect: dbConfig.dialect,
//                 operatorsAliases: false,
//                 pool: {
//                     max: dbConfig.pool.max,
//                     min: dbConfig.pool.min,
//                     acquire: dbConfig.pool.acquire,
//                     idle: dbConfig.pool.idle
//                 }
//             }
//         );

//         await sequelize.authenticate();
//         console.log('Connected to the database.');

//         const db = {};
//         db.Sequelize = Sequelize;
//         db.sequelize = sequelize;

//         db.User = require('./userModel.js')(sequelize, DataTypes);

//         return db;
//     } catch (error) {
//         console.error('Error initializing database:', error);
//         throw error;
//     }
// }

// module.exports = initializeDatabase;
