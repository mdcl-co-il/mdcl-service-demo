const seq_url = process.env.SEQ_URL || "http://localhost:8081/seq";
const structuredLog = require('structured-log');
const {SeqSinkFactory} = require('./seq-sink');
const {makeLogger} = require('./logger');

const mockSink = {
    emit: (events, done) => {
        lastEvent = events;
        if (done)
            done();
    }
};

const levelSwitch = new structuredLog.DynamicLevelSwitch("info");
const seqSink = SeqSinkFactory({
    url: seq_url,
    levelSwitch: levelSwitch
});

Object.assign(module.exports, {
    Logger: makeLogger(structuredLog, levelSwitch, mockSink)
});