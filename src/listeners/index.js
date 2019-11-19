/* eslint-disable no-console */

import { appEvent , EVENTS } from '../event';

appEvent.on(EVENTS.USER.NEW, async (user) => {
    console.log(`On event ${EVENTS.USER.NEW}: ${user}`)
    // await Mail.send('new.user', user, (message) => {
    //   message.to(user.email)
    //   message.from('from@email')
    // })
})
