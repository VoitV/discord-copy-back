
exports.up = async function(knex) {
    return  knex.schema.createTable('shopHistory', table => {
        table.increments('id').notNullable().primary().unique();
        table.integer('user_id').
        notNullable().
        references('id').
        inTable('users').
        onDelete('CASCADE').
        onUpdate('CASCADE');
        table.integer('item_id').
        notNullable().
        references('id').
        inTable('shopItems').
        onDelete('CASCADE').
        onUpdate('CASCADE');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('shopHistory')

};