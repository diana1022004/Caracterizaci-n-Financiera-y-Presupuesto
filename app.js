class App {
  constructor() {
    this.storage = new Storage('clara_finanzas_v1');
    this.state = this.storage.load();
    this.wizardSection = document.querySelector('#wizard-section');
    this.dashboardSection = document.querySelector('#dashboard-section');
    this.resetButton = document.querySelector('#reset-app');
    this.toast = document.querySelector('#toast');
    this.toastTimer = null;
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add('visible');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('visible'), 2800);
  }

  render() {
    const hasState = Boolean(this.state);
    this.wizardSection.classList.toggle('d-none', hasState);
    this.dashboardSection.classList.toggle('d-none', !hasState);
    this.resetButton.classList.toggle('d-none', !hasState);

    if (hasState) {
      const dashboard = new Dashboard({
        state: this.state,
        section: this.dashboardSection,
        onChange: (state, message) => {
          this.state = state;
          this.storage.save(state);
          this.render();
          this.showToast(message);
        },
        onReset: () => this.reset(),
        showToast: message => this.showToast(message)
      });
      dashboard.render();
      dashboard.bind();
      return;
    }

    const wizard = new Wizard({
      section: this.wizardSection,
      onSave: state => {
        this.state = state;
        this.storage.save(state);
        this.render();
        this.showToast('Configuración guardada. Tu dashboard está listo.');
      },
      showToast: message => this.showToast(message)
    });
    wizard.render();
    wizard.bind();
  }

  reset() {
    this.storage.clear();
    this.state = null;
    this.render();
    this.showToast('Datos eliminados. Puedes comenzar de nuevo.');
  }
}

document.addEventListener('DOMContentLoaded', () => new App().render());
