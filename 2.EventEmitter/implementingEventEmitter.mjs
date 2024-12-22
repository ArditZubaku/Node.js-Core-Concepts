export class EventEmitter {
  listeners = new Map();

  addListener(eventName, fn) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(fn);
    return this;
  }

  removeListener(eventName, fn) {
    const listeners = this.listeners.get(eventName);

    if (!listeners) {
      return this;
    }

    // Iterate from the end to avoid index issues while removing
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === fn) {
        listeners.splice(i, 1);
        break;
      }
    }

    // Clean up empty event arrays
    if (listeners.length === 0) {
      this.listeners.delete(eventName);
    }

    return this;
  }

  on(eventName, fn) {
    return this.addListener(eventName, fn);
  }

  once(eventName, fn) {
    const onceWrapper = (...args) => {
      fn(...args);
      this.removeListener(eventName, onceWrapper);
    };
    return this.addListener(eventName, onceWrapper);
  }

  off(eventName, fn) {
    return this.removeListener(eventName, fn);
  }

  emit(eventName, ...args) {
    const functions = this.listeners.get(eventName);

    if (!functions) {
      return false;
    }

    for (const f of functions) {
      f(...args);
    }

    return true;
  }

  listenerCount(eventName) {
    const functions = this.listeners.get(eventName) || [];
    return functions.length;
  }

  rawListeners(eventName) {
    return this.listeners.get(eventName) || [];
  }
}
