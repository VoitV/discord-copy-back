import pg from "pg";
const { Pool } = pg;

export const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  });

  
  db.connect().catch((error) => {
    console.log('Failed connect to the database ', error);
  });
  