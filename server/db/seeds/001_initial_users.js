/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('transactions').del(); //本来はtransactionsで別のseedファイルを作るべきだが、今回は省略
  await knex('users').del();

  // 初期ユーザーをinsert（1000,000円）
  await knex('users').insert([
    { id: 1, initial_jpy_balance: 1000000 }
  ]);
};
