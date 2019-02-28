
exports.up = function(knex, Promise) {
    return knex.schema.alterTable("users", function(table) {
        table.timestamp("deletedAT")
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable("users", function(table) {
        table.dropColumn("deletedAT")
    })
};
