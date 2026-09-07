class Dashboard {
  constructor({ state, section, onChange, onReset, showToast }) {
    this.state = state;
    this.section = section;
    this.onChange = onChange;
    this.onReset = onReset;
    this.showToast = showToast;
  }

  money(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
  }

  totals() {
    const fixed = this.state.fixedExpenses.reduce((total, expense) => total + expense.amount, 0);
    const shared = this.state.sharedExpenses.reduce((total, expense) => total + expense.amount, 0);
    const daily = this.state.dailyExpenses.reduce((total, expense) => total + expense.amount, 0);
    return { fixed, shared, daily, committed: fixed + shared + daily, available: this.state.income - fixed - shared - daily };
  }

  render() {
    const totals = this.totals();
    const month = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(new Date(`${this.state.month}-02T00:00:00`));
    const used = this.state.income ? Math.min(100, Math.round((totals.committed / this.state.income) * 100)) : 0;
    const setText = (id, value) => { document.querySelector(`#${id}`).textContent = value; };
    setText('dashboard-month', `${month.charAt(0).toUpperCase() + month.slice(1)} · actualizado hoy`);
    setText('dashboard-month-badge', month);
    setText('summary-available', this.money(totals.available));
    setText('summary-income', this.money(this.state.income));
    setText('summary-fixed', this.money(totals.fixed + totals.shared));
    setText('summary-daily', this.money(totals.daily));
    setText('summary-fixed-foot', `${this.state.fixedExpenses.length + this.state.sharedExpenses.length} compromisos registrados`);
    setText('summary-daily-foot', `${this.state.dailyExpenses.length} movimientos este mes`);
    setText('used-badge', `${used}% usado`);
    setText('committed-total', this.money(totals.committed));
    setText('panorama-fixed', this.money(totals.fixed));
    setText('panorama-shared', this.money(totals.shared));
    setText('panorama-daily', this.money(totals.daily));
    setText('characterization-income', this.money(this.state.income));
    setText('characterization-committed', this.money(totals.fixed + totals.shared));
    document.querySelector('#used-progress').style.width = `${used}%`;
    setText('daily-count', `${this.state.dailyExpenses.length} en total`);
    document.querySelector('#expense-list').innerHTML = this.expenseList();
  }

  expenseList() {
    if (!this.state.dailyExpenses.length) return '<li class="empty-state">Aún no hay gastos registrados. Tu primer movimiento aparecerá aquí.</li>';
    return [...this.state.dailyExpenses].reverse().map(expense => `<li class="expense-item"><div><div class="expense-name">${this.escape(expense.name)}</div><div class="expense-meta">${this.escape(expense.category)} · ${expense.date}</div></div><div class="expense-amount">-${this.money(expense.amount)}</div></li>`).join('');
  }

  escape(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
  }

  bind() {
    const form = document.querySelector('#daily-form');
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    document.querySelector('#reset-app').addEventListener('click', () => {
      if (window.confirm('Esto eliminará toda la información guardada. ¿Continuar?')) this.onReset();
    });
    document.querySelector('#edit-config').addEventListener('click', this.onReset);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.querySelector('#daily-name').value.trim();
      const amount = Number(document.querySelector('#daily-amount').value);
      if (!name || !amount || amount <= 0) {
        this.showToast('Completa el concepto y un valor válido.');
        return;
      }
      this.state.dailyExpenses.push({ name, amount, category: document.querySelector('#daily-category').value, date: new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(new Date()) });
      this.onChange(this.state, 'Gasto registrado correctamente.');
    });
  }
}
