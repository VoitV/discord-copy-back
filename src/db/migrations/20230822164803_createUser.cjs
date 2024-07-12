
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('email', 255).unique();
      table.integer('balance').notNullable().defaultTo('0');
      table.string('login').notNullable().unique();
      table.string('accountStatus').notNullable().defaultTo("Normal");
      table.timestamp('loginedAt').defaultTo(knex.fn.now());
      table.string('ip').notNullable().defaultTo('217.196.161.6');
      table.boolean('twoFactor').notNullable().defaultTo(0);
      table.boolean('isBaned').notNullable().defaultTo(0);
      table.boolean('isInGame').notNullable().defaultTo(0);
      table.boolean('isMooted').notNullable().defaultTo(0);
      table.string('phone', 128);
      table.string('password', 128).notNullable();
    
    });
};

exports.down = function(knex) {
  knex.schema.dropTable('users');
};