import dotenv from 'dotenv';

dotenv.config();

const config = {
    database:process.env.DB_DATATABASE,
    user:process.env.DB_USER,
    pass:process.env.DB_PASS,
    host:process.env.DB_HOST,
    dialect:process.env.DB_DIALECT,
    port:process.env.PORT
}

export default config
