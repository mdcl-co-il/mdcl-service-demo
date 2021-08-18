require('should');
require('assert');
const structuredLog = require('structured-log');
const levelSwitch = new structuredLog.DynamicLevelSwitch("info");
const {makeLogger} = require('../lib/logger');


describe('logger tests', () => {
    let lastEvent;
    const mockSink = {
        emit: (events, done) => {
            lastEvent = events;
            done();
        }
    };
    const logger = makeLogger(structuredLog, levelSwitch, mockSink).init({"some-extra": "extra value"});

    const eventWait = async () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 0)
        });
    };

    it('logger should send the right content message', async () => {
        logger.info("test");
        await eventWait();
        lastEvent[0].messageTemplate.should.have.property('raw', "test");
    });

    it('logger should send the right enrich data', async () => {
        logger.info("test");
        await eventWait();
        lastEvent[0].properties.should.have.property('some-extra', "extra value");
    });

    it('logger.info should send info event', async () => {
        logger.info("test");
        await eventWait();
        lastEvent[0].should.have.property('level', 15);
    });

    it('logger.debug should send debug event', async () => {
        logger.debug("test");
        await eventWait();
        lastEvent[0].should.have.property('level', 31);
    });

    it('logger.warn should send warn event', async () => {
        logger.warn("test");
        await eventWait();
        lastEvent[0].should.have.property('level', 7);
    });

    it('logger.error should send error event', async () => {
        logger.error("test");
        await eventWait();
        lastEvent[0].should.have.property('level', 3);
    });
});