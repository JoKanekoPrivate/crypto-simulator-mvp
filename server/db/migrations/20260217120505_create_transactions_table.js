/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('coin_id', 20).notNullable();
    table.string('side', 4).notNullable();
    table.decimal('qty', 18, 8).notNullable();
    table.decimal('price', 18, 2).notNullable();
    // 取引日時は、レコード作成時のタイムスタンプを自動で設定
    // BEでawait knex('transactions').insert(...)→treated_atが自動的に設定
    table.timestamp('treated_at').notNullable().defaultTo(knex.fn.now());

    // （追加要件）CHECK制約が使えるかも、、、
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
