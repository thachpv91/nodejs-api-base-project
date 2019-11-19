/* eslint-disable no-console */
// Read more https://dev.to/usamaashraf/using-events-in-nodejs-the-right-way-449b

const exampleListener = data => {
    setImmediate(() => {
        console.log('Processing example event', data);
    });
};
export default exampleListener;
