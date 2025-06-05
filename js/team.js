import { supabase } from '../supabase.js';

async function loadTeam() {
  const username = localStorage.getItem('username');
  const { data } = await supabase.from('players').select('*').eq('sold_to', username);
  const teamList = document.getElementById('team-list');
  data.forEach(player => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${player.name}</strong> (OVR: ${player.ovr}) - ${player.sold_for}`;
    teamList.appendChild(div);
  });
}

loadTeam();
