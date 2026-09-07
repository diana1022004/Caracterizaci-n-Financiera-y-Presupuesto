class Wizard {
  constructor({ section, onSave, showToast }) {
    this.section = section;
    this.onSave = onSave;
    this.showToast = showToast;
  }

  monthOptions() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    const options = [];
    for (let year = now.getFullYear() - 1; year <= now.getFullYear() + 1; year += 1) {
      months.forEach((month, index) => {
        const value = `${year}-${String(index + 1).padStart(2, '0')}`;
        const selected = year === now.getFullYear() && index === now.getMonth() ? ' selected' : '';
        options.push(`<option value="${value}"${selected}>${month} ${year}</option>`);
      });
    }
    return options.join('');
  }

  addFixedExpense(label, id) {
    const template = document.querySelector('#fixed-expense-template');
    const row = template.content.cloneNode(true);
    row.querySelector('.fixed-label').textContent = label;
    row.querySelector('.fixed-name').id = id;
    row.querySelector('.fixed-name').value = label;
    row.querySelector('.fixed-amount').id = `${id}-amount`;
    document.querySelector('#fixed-expenses').appendChild(row);
  }

  render() {
    document.querySelector('#month').innerHTML = this.monthOptions();
    document.querySelector('#fixed-expenses').innerHTML = '';
    this.addFixedExpense('Vivienda / arriendo', 'housing');
    this.addFixedExpense('Servicios públicos', 'utilities');
    this.addFixedExpense('Transporte', 'transport');
  }

  bind() {
    const form = document.querySelector('#setup-form');
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    document.querySelector('#add-fixed').addEventListener('click', () => this.addFixedExpense('Nuevo gasto fijo', `fixed-${Date.now()}`));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const income = Number(document.querySelector('#income').value);
      const fixedExpenses = [...document.querySelectorAll('[data-expense-row]')]
        .map(row => ({ name: row.querySelector('.fixed-name').value.trim(), amount: Number(row.querySelector('.fixed-amount').value) || 0 }))
        .filter(expense => expense.name && expense.amount > 0);
      const sharedName = document.querySelector('#shared-name').value.trim();
      const sharedAmount = Number(document.querySelector('#shared-amount').value) || 0;
      if (!income || income <= 0) {
        this.showToast('Ingresa un ingreso mensual válido.');
        return;
      }
      this.onSave({ income, month: document.querySelector('#month').value, fixedExpenses, sharedExpenses: sharedName && sharedAmount > 0 ? [{ name: sharedName, amount: sharedAmount }] : [], dailyExpenses: [] });
    });
  }
}
