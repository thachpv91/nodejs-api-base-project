import eventEmitter from 'eventemitter2';
import exampleListener from './listeners/example.listener';

export const appEvent = new eventEmitter.EventEmitter2();
export const EVENTS = Object.freeze({
    EXAMPLE: 'example:event',
    USER: {
        NEW: 'user:new',
    },
});

appEvent.on(EVENTS.EXAMPLE, exampleListener);

appEvent.on(EVENTS.USER.NEW, async user => {
    // eslint-disable-next-line no-console
    console.log(`On event ${EVENTS.USER.NEW}: ${user}`);
    // await Mail.send('new.user', user, (message) => {
    //   message.to(user.email)
    //   message.from('from@email')
    // })
});
