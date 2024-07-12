
exports.up = function(knex) {
    return knex.schema
    .createTable('topUpHistory', function (table) {
      table
      .integer("id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    
    });
};

exports.down = function(knex) {
  
};
