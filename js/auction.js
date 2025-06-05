import { supabase } from '../supabase.js';

let currentPlayer = null;

async function fetchNextPlayer() {
  const { data } = await supabase.from('players').select('*').eq('sold_to', null).limit(1);
  if (data.length) {
    currentPlayer = data[0];
    document.getElementById('player-info').innerHTML = `
      <h2>${currentPlayer.name}</h2>
      <img src="${currentPlayer.image_url}" width="150" />
      <p>OVR: ${currentPlayer.ovr}</p>
      <p>Base Price: ${currentPlayer.base_price}</p>
    `;
    document.getElementById('current-bid').textContent = 'Current Bid: ' + currentPlayer.base_price;
  }
}

document.getElementById('bid-btn').addEventListener('click', async () => {
  const amount = Number(document.getElementById('bid-amount').value);
  const username = localStorage.getItem('username');
  if (amount && currentPlayer) {
    await supabase.from('bids').insert([{ player_id: currentPlayer.id, amount, user_name: username }]);
  }
});

supabase
  .channel('bids')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'bids' }, (payload) => {
    document.getElementById('current-bid').textContent = 'Current Bid: ' + payload.new.amount + ' by ' + payload.new.user_name;
  })
  .subscribe();

fetchNextPlayer();
```
