import agenda from 'agenda';
import config from 'config';

const agendaConfig = config.get('agenda');

// or override the default collection name:
let agenda = new Agenda({ db: agendaConfig.db });

let jobTypes = agendaConfig.job_types ? agendaConfig.split(',') : [];

jobTypes.forEach(function (type) {
    require('./jobs/' + type)(agenda);
});

if (jobTypes.length) {
    agenda.on('ready', function () {
        agenda.start();
    });
}

function graceful() {
    agenda.stop(function () {
        process.exit(0);
    });
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;
