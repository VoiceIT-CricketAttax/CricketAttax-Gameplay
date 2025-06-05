import { supabase } from '../supabase.js';

document.getElementById('join-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const { data, error } = await supabase.from('users').insert([{ name: username }]);
  if (!error) {
    localStorage.setItem('username', username);
    window.location.href = 'auction.html';
  }
});
