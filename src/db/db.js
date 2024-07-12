import knex from "knex";

const config = { 
    client: 'pg',
    connection: {
      database: 'bee-farm',
      user:     'postgres',
      password: '23062003'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};

export default knex(config);