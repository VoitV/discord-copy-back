import knex from "knex";

const config = { 
    client: 'pg',
    connection: {
      database: 'discord',
      user:     'postgres',
      password: '23062003'
    },
    pool: {
      min: 2,
      max: 10
    },
};

export default knex(config);
