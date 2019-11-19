import eventEmitter from 'eventemitter2';

export const appEvent = new eventEmitter.EventEmitter2();
export const EVENTS = Object.freeze({
     USER: {
         NEW: 'user:new',
     }
});
