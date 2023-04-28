import pg from "pg";
const { Pool } = pg;

export const db = new Pool({
    user: "postgres",
    password: "23062003",
    host: "localhost",
    port: 5432,
    database: "testWiki"
  });

  
  db.connect().catch((error) => {
    console.log('Failed connect to the database ', error);
  });
  