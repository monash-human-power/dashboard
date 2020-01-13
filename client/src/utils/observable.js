import { useState, useEffect } from 'react';

/**
 * Simple observable
 */
export class Observable {
  #subscribers;

  #value;

  /**
   * Create an observable
   *
   * @param {any} initialValue Initial value
   */
  constructor(initialValue = null) {
    this.#subscribers = [];
    this.#value = initialValue;
  }

  /**
   * Subscribe to this observable
   *
   * @param {function(any)} f Callback when value changes
   * @returns {function()} Unsubscribe
   */
  subscribe(f) {
    this.#subscribers.push(f);
    return () => {
      this.#subscribers = this.#subscribers.filter((sub) => sub !== f);
    };
  }

  /**
   * Publish a value to this observable
   *
   * @param {any} value New value
   * @returns {void}
   */
  next(value) {
    this.#value = value;
    this.#subscribers.forEach((sub) => sub(value));
  }

  /**
   * Get current value of the observable
   *
   * @returns {any} Current value
   */
  get() {
    return this.#value;
  }
}

/**
 * Use an observable value
 *
 * @param {Observable} observable Observable to monitor
 * @returns {any} Current value
 */
export function useObservable(observable) {
  const [value, setValue] = useState(observable.get());

  useEffect(() => {
    const unsubscribe = observable.subscribe((newValue) => {
      setValue(newValue);
    });
    return () => {
      unsubscribe();
    };
  }, [observable]);

  return value;
}
