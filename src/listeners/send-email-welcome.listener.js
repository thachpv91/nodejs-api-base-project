/* eslint-disable no-console */
// Read more https://dev.to/usamaashraf/using-events-in-nodejs-the-right-way-449b

const sendWelcomeEmail = data => {
    setImmediate(() => {
        console.log('Processing example event', data);
    });
};
export default sendWelcomeEmail;
