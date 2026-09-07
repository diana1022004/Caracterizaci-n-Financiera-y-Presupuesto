class Storage {
  constructor(key) {
    this.key = key;
  }

  load() {
    try {
      const saved = localStorage.getItem(this.key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  }

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
