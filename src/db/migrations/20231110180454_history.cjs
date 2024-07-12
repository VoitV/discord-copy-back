
exports.up = function(knex) {
      return knex.schema
      .createTable('shopItems', function (table) {
        table.increments('id');
        table.string('itemName').notNullable();
        table.string('itemPrice').notNullable();
        table.string('itemUrlImg').notNullable();
    
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('shopItems')

};
