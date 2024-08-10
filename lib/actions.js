'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';
import { settingsSchema, transactionSchema } from './validation';
import { redirect } from 'next/dist/server/api-utils';

export async function createTransaction(formData) {
  const validated = transactionSchema.safeParse(formData);

  if (!validated.success) {
    throw new Error('invalid data');
  }

  const { error } = await createClient()
    .from('transactions')
    .insert(validated.data);

  if (error) {
    throw new Error('failed to create transaction');
  }

  revalidatePath('/dashboard');
}

export async function fetchTransactions(range, offset = 0, limit = 10) {
  const supabase = createClient();

  let { data, error } = await supabase.rpc('fetch_transactions', {
    limit_arg: limit,
    offset_arg: offset,
    range_arg: range,
  });
  if (error) throw new Error('we cant fetch transactions');

  return data;
}

export async function deleteTransaction(id) {
  const supabase = createClient();
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw new Error(`we cant delete transaction ${id}`);
  revalidatePath('/dashboard');
}

export async function updateTransaction(id, formData) {
  const validated = transactionSchema.safeParse(formData);

  if (!validated.success) {
    throw new Error('invalid data');
  }

  const { error } = await createClient()
    .from('transactions')
    .update(formData)
    .eq('id', id);

  if (error) {
    throw new Error('failed to update transaction');
  }

  revalidatePath('/dashboard');
}

export async function login(prevState, formData) {
  const supabase = createClient();
  const email = formData.get('email');
  const { error } = supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      error: true,
      message: 'error authenticating',
    };
  }

  return {
    message: `email sent to ${email}`,
  };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  redirect('/login');
}

export async function uploadAvatar(prevState, formData) {
  const supabase = createClient();
  const file = formData.get('file');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);
  if (error) {
    return {
      error: true,
      message: 'Error uploading avatar',
    };
  }

  const { data: userData, userError } = await supabase.auth.getUser();

  if (userError) {
    return {
      error: true,
      message: 'opaa shen vinxar',
    };
  }

  const avatar = userData.user.user_metadata.avatar;

  if (avatar) {
    const { error } = await supabase.storage.from('avatars').remove([avatar]);

    if (error) {
      return {
        error: true,
        message: 'avatar ver waishala',
      };
    }
  }

  const { error: dataUpdateError } = await supabase.auth.updateUser({
    data: {
      avatar: fileName,
    },
  });

  if (dataUpdateError) {
    return {
      error: true,
      message: 'Error associating the avatar with the user',
    };
  }

  return {
    message: 'updated the user avatar',
  };
}

export async function updateSettings(prevState, formData) {
  const validated = settingsSchema.safeParse({
    fullName: formData.get('fullName'),
    defaultView: formData.get('defaultView'),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      fullName: validated.data.fullName,
      defaultView: validated.data.defaultView,
    },
  });

  if (error) {
    return {
      error: true,
      message: 'Failed updating setting',
      errors: {},
    };
  }

  return {
    message: 'Updated user settings',
    errors: {},
  };
}
