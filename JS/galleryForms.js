const geometricItems = [
  { title: 'Cubo', id: 'cube', icon: 'box' },
  { title: 'Paralelepípedo', id: 'parallelepiped', icon: 'package' },
  { title: 'Pirâmide', id: 'pyramid', icon: 'triangle' },
  { title: 'Esfera', id: 'sphere', icon: 'circle-dot' },
  { title: 'Cilindro', id: 'cylinder', icon: 'cylinder' },
  { title: 'Cone', id: 'cone', icon: 'cone' }
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById('grid');
  const tpl = document.getElementById('cardTpl');

  if (!grid || !tpl) return;

  geometricItems.forEach(item => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    
    node.querySelector('.title').textContent = item.title;
    
    const previewIcon = node.querySelector('.preview-icon');
    previewIcon.setAttribute('data-lucide', item.icon);
    
    node.addEventListener("click", () => {
      window.switchView(true);
      if (window.loadSolidViewer) {
        window.loadSolidViewer(item.id, item.title, item.icon);
      }
    });

    grid.appendChild(node);
  });
  
  lucide.createIcons();
});