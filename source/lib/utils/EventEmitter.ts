export type EventEmitterCallback<T> = (value: T) => void;

export default class EventEmitter<T> {
  handlers = new Set<EventEmitterCallback<T>>();
  onceHandlers = new Set<EventEmitterCallback<T>>();

  on = (handler: EventEmitterCallback<T>) => {
    this.handlers.add(handler);
    return () => this.off(handler);
  };

  off = (handler: EventEmitterCallback<T>) => {
    this.handlers.delete(handler);
  };

  once = (handler: EventEmitterCallback<T>) => {
    this.onceHandlers.add(handler);
  };

  emit = (value: T) => {
    this.handlers.forEach((handler) => handler(value));
    this.onceHandlers.forEach((handler) => handler(value));
    this.onceHandlers.clear();
  };
}
