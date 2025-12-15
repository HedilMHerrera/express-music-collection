document.addEventListener('DOMContentLoaded', function(){
  var menuBtn = document.getElementById('menuBtn');
  var overlay = document.getElementById('overlaySidebar');
  var overlayClose = document.getElementById('overlayClose');
  var backdrop = null;

  function createBackdrop(){
    backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.inset = '0';
    backdrop.style.background = 'rgba(0,0,0,0.45)';
    backdrop.style.zIndex = '1999';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', closeOverlay);
  }

  function openOverlay(){
    if(!overlay) return;
    overlay.classList.add('open');
    createBackdrop();
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay(){
    if(!overlay) return;
    overlay.classList.remove('open');
    if(backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    backdrop = null;
    document.body.style.overflow = '';
  }

  if(menuBtn) menuBtn.addEventListener('click', openOverlay);
  if(overlayClose) overlayClose.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeOverlay(); });
});
