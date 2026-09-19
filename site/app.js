const owner = 'HelloOjasMutreja', repo = 'universe-mosaic';
const hash = s => [...s].reduce((n, c) => ((n * 31) + c.charCodeAt(0)) >>> 0, 7);
const load = async () => {
  const [target, files] = await Promise.all([fetch('art/target.json').then(r => r.json()), fetch(`https://api.github.com/repos/${owner}/${repo}/contents/cells`).then(r => r.json())]);
  const cells = files.filter(f => !f.name.startsWith('_') && f.name.endsWith('.json'));
  const mosaic = document.querySelector('#mosaic');
  target.coordinates.forEach((_, i) => { const el = document.createElement('div'); el.className = 'cell'; el.dataset.index = i; mosaic.append(el); });
  const used = new Set();
  for (const file of cells.sort((a,b) => a.name.localeCompare(b.name))) { try { const c = await fetch(file.download_url).then(r => r.json()); if (typeof c.username !== 'string' || typeof c.color !== 'string' || !Object.prototype.hasOwnProperty.call(target.palette, c.color)) continue; let i = hash(c.username) % target.coordinates.length; while (used.has(i)) i = (i + 1) % target.coordinates.length; used.add(i); const el = mosaic.querySelector('[data-index="' + i + '"]'); el.classList.add('lit'); el.style.background = target.palette[c.color]; el.style.color = target.palette[c.color]; } catch {} }
  document.querySelector('#count').textContent = used.size + ' / ' + target.coordinates.length + ' pixels lit';
}; load().catch(() => document.querySelector('#count').textContent = 'Unable to load the mosaic right now.');
