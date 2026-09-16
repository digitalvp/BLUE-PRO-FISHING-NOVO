(() => {
  const calendar = document.querySelector('[data-fishing-calendar]');
  if (!calendar) return;

  const tabs = Array.from(calendar.querySelectorAll('[data-month]'));
  const panel = calendar.querySelector('[data-month-panel]');
  const heading = calendar.querySelector('[data-month-title]');
  const currentLabel = calendar.querySelector('[data-current-month]');
  if (tabs.length !== 12 || !panel || !heading || !currentLabel) return;

  const today = new Date();
  const currentMonth = today.getMonth();
  const year = today.getFullYear();

  function selectMonth(index, focus = false) {
    const selected = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, position) => {
      const active = selected === position;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    heading.textContent = `${tabs[selected].textContent.trim()} de ${year}`;
    panel.setAttribute('aria-labelledby', tabs[selected].id);
    currentLabel.textContent = selected === currentMonth
      ? 'Mês atual selecionado.'
      : `Mês atual: ${tabs[currentMonth].textContent.trim().toLocaleLowerCase('pt-BR')} de ${year}.`;
    if (focus) tabs[selected].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectMonth(index));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectMonth(next, true);
    });
  });

  selectMonth(currentMonth);
})();
