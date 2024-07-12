module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      database: 'online_language_school',
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
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'wow_circle',
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
  },
};
