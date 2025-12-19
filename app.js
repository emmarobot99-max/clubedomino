async function main() {
  let id = new URLSearchParams(window.location.search).get('id');

  // Se quiser aceitar também hash (#2025-0001) além de ?id=...
  if (!id && window.location.hash) {
    id = window.location.hash.replace('#', '').trim();
  }

  const statusEl = document.getElementById('status');
  const contentEl = document.getElementById('content');
  const notfoundEl = document.getElementById('notfound');
  const missingIdEl = document.getElementById('missingId');

  if (!id) {
    statusEl.className = 'status bad';
    statusEl.textContent = 'Identificador ausente na URL. Use ?id=XXXX.';
    notfoundEl.classList.remove('hidden');
    missingIdEl.textContent = 'Exemplo: https://SEUUSUARIO.github.io/buchuda/?id=2025-0001';
    return;
  }

  try {
    const res = await fetch('./certificados.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao carregar base');

    const db = await res.json();
    const item = db[id];

    if (!item) {
      statusEl.className = 'status bad';
      statusEl.textContent = 'Registro inválido ou não localizado.';
      notfoundEl.classList.remove('hidden');
      missingIdEl.textContent = `ID consultado: ${id}`;
      return;
    }

    // Render OK
    statusEl.className = 'status ok';
    statusEl.textContent = 'Autenticidade confirmada. Registro localizado e válido.';

    document.getElementById('nome').textContent = item.nome;
    document.getElementById('titulo').textContent = item.titulo;
    document.getElementById('ano').textContent = item.ano;
    document.getElementById('clube').textContent = item.clube;
    document.getElementById('local').textContent = item.local;
    document.getElementById('emissao').textContent = item.emissao;
    document.getElementById('id').textContent = id;

    contentEl.classList.remove('hidden');
  } catch (e) {
    statusEl.className = 'status bad';
    statusEl.textContent = 'Erro ao validar. Tente novamente mais tarde.';
    notfoundEl.classList.remove('hidden');
    missingIdEl.textContent = `ID consultado: ${id}`;
  }
}

main();
