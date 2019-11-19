
module.exports = function(agenda) {
  agenda.define('check_xrp_task', async job => {
    const user = await User.get(job.attrs.data.userId);
    console.log(`check_xrp_task for ${user.email}`);
  });
};
