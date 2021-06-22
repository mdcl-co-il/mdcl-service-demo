const should = require('should');
require('assert');
const {makeDataTreeFlatten} = require('../lib/makeDataTreeFlatten')

describe('DataTreeFlatten tests', () => {
    const dataTreeFlatten = makeDataTreeFlatten();

    describe('DataTreeFlatten.flattenMyObject tests', () => {
        const testObj = {
            "_id": 2,
            "date": "2020-12-18T00:00:00.000Z",
            "610": [],
            "640": [
                {
                    "standNumberId": 640,
                    "packingDetail": [
                        {
                            "workerName1": " טלאל אבן נסיר"
                        }
                    ],
                    "materialType": 52,
                    "packingType": 3
                },
                {
                    "standNumberId": 640,
                    "packingDetail": [
                        {
                            "workerName1": " אחמד סדאן"
                        }
                    ],
                    "materialType": 53,
                    "packingType": 2
                },
                {
                    "standNumberId": 640,
                    "packingDetail": [
                        {
                            "workerName1": " אחמד סדאן"
                        }
                    ],
                    "materialType": 53,
                    "packingType": 2
                }
            ],
            "651": [
                {
                    "standNumberId": 651,
                    "packingDetail": [
                        {
                            "workerName1": " אחמד אבו נוריה"
                        }
                    ],
                    "materialType": 60,
                    "packingType": 3
                },
                {
                    "standNumberId": 651,
                    "packingDetail": [
                        {
                            "workerName1": " פואד אבו כפיף"
                        },
                        {
                            "workerName1": " אחמד אבו נוריה"
                        }
                    ],
                    "materialType": 60,
                    "packingType": 3
                },
                {
                    "standNumberId": 651,
                    "packingDetail": [
                        {
                            "workerName1": " ראג'י אלדוגי"
                        }
                    ],
                    "materialType": 60,
                    "packingType": 3
                },
                {
                    "standNumberId": 651,
                    "packingDetail": [
                        {
                            "workerName1": " פואד אבו כפיף"
                        },
                        {
                            "workerName1": " ראג'י אלדוגי"
                        }
                    ],
                    "materialType": 60,
                    "packingType": 2
                },
                {
                    "standNumberId": 651,
                    "packingDetail": [
                        {
                            "workerName1": " יאסר דוגי"
                        }
                    ],
                    "materialType": 16
                }
            ]
        };

        it('Flat complex object with 2 levels - check flat object values', () => {
            const flatObject = dataTreeFlatten.flattenMyObject(testObj);

            should(flatObject.length).be.exactly(10);

            flatObject[0].should.have.property("610", null);
            flatObject[0].should.have.property("651", null);
            flatObject[0].should.have.property("date", "2020-12-18T00:00:00.000Z");
            flatObject[0].should.have.property("640.standNumberId", 640);
            flatObject[0].should.have.property("640.materialType", 52);
            flatObject[0].should.have.property("640.packingType", 3);
            flatObject[0].should.have.property("640.packingDetail.workerName1", " טלאל אבן נסיר");
        });
    });


});