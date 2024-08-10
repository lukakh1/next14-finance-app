import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config({ path: 'env.local' });

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.SUPABASE_SERVICE_ROLE}`
);

const categories = [
  'Housing',
  'Transport',
  'Health',
  'Food',
  'Education',
  'Other',
];

async function seedUsers() {
  for (let i = 0; i < 5; i++) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: faker.internet.email(),
        password: 'password',
      });
      if (error) {
        throw new Error(error);
      }

      console.log('user added');
    } catch (error) {
      console.error('error adding user');
    }
  }
}

async function seed() {
  await seedUsers();
  let transactions = [];

  const {
    data: { users },
    error: listUsersError,
  } = await supabase.auth.admin.listUsers();

  if (listUsersError) {
    console.error('cannot list users, aborting');
    return;
  }

  const userIds = users?.map((user) => user.id);

  for (let i = 0; i < 100; i++) {
    const created_at = faker.date.past();
    let type,
      category = null;
    const user_id = faker.helpers.arrayElement(userIds);

    const typeBias = Math.random();

    if (typeBias < 0.85) {
      type = 'Expense';
      category = faker.helpers.arrayElement(categories);
    } else if (typeBias < 0.85) {
      type = 'Income';
    } else {
      type = faker.helpers.arrayElement(['Saving', 'Investment']);
    }

    let amount;
    switch (type) {
      case 'Income':
        amount = faker.number.int({ min: 2000, max: 9000 });
        break;
      case 'Expense':
        amount = faker.number.int({ min: 10, max: 1000 });
        break;
      case 'Investment':
      case 'Saving':
        amount = faker.number.int({ min: 3000, max: 10000 });
        break;
    }

    transactions.push({
      created_at,
      amount,
      type,
      description: faker.lorem.sentence(),
      category,
      user_id,
    });
  }

  const { error } = await supabase.from('transactions').insert(transactions);

  if (error) {
    console.error('error at inserting data');
  } else {
    console.log('inserted data ', transactions.length);
  }
}

seed().catch(console.error);
