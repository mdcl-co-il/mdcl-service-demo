const should = require('should');
require('assert');
const {makeUtils} = require('../lib/utils')

describe('Utils tests', () => {
    const utils = makeUtils();

    describe('Utils.deepFind tests', () => {
        const testObj = {
            "00": {
                "10": "value10",
                "11": {
                    "20": "value20",
                    "21": {
                        "30": "value30"
                    }
                }
            }
        };

        it('Find value in first level', () => {
            const path = "00.10";
            const value = utils.deepFind(testObj, path);
            should(value).be.exactly("value10");
        });

        it('Find value in 2nd level', () => {
            const path = "00.11.20";
            const value = utils.deepFind(testObj, path);
            should(value).be.exactly("value20");
        });

        it('Find value in 3nd level', () => {
            const path = "00.11.21.30";
            const value = utils.deepFind(testObj, path);
            should(value).be.exactly("value30");
        });

        it('Find obj value', () => {
            const path = "00.11";
            const value = utils.deepFind(testObj, path);
            value.should.have.property("20", "value20");
        });

        it('Find with bad path', () => {
            const path = "00.22";
            const value = utils.deepFind(testObj, path);
            should(value).be.exactly(undefined);
        });
    });

    describe('Utils.mergeDeep tests', () => {
        const mergeToObj = {
            "00": {
                "10": "value10",
                "11": {
                    "20": "value20",
                    "21": {
                        "30": "value30"
                    }
                }
            }
        };

        it('Merge source object with new branch', () => {
            const newBranch = {
                "01": "value01"
            };
            const mergedObj = utils.mergeDeep(JSON.parse(JSON.stringify(mergeToObj)), newBranch);
            mergedObj.should.have.property("00").which.have.property("10", "value10");
            mergedObj.should.have.property("01", "value01");
        });

        it('Merge source object with new object branch', () => {
            const newBranch = {
                "01": {
                    "011": "value011"
                }
            };
            const mergedObj = utils.mergeDeep(JSON.parse(JSON.stringify(mergeToObj)), newBranch);
            mergedObj.should.have.property("01").which.have.property("011", "value011");
            mergedObj.should.have.property("00").which.have.property("11").which.have.property("20", "value20");
        });


        it('Merge source object with override branch', () => {
            const newBranch = {
                "00": {
                    "10": "value10-new"
                }
            };
            const mergedObj = utils.mergeDeep(mergeToObj, newBranch);
            mergedObj.should.have.property("00").which.have.property("10", "value10-new");
            mergedObj.should.have.property("00").which.have.property("11").which.have.property("20", "value20");
        });


        it('Merge source object with bad obj', () => {
            const mergedObj = utils.mergeDeep(JSON.parse(JSON.stringify(mergeToObj)), "some string");
            JSON.stringify(mergedObj).should.be.exactly(JSON.stringify(mergeToObj));
        });

    });

    describe('Utils.isObject tests', () => {

        it('Validate object', () => {
            utils.isObject({"a": 1}).should.be.exactly(true);
        });

        it('Validate non objects', () => {
            utils.isObject("a").should.be.exactly(false);
            utils.isObject(1).should.be.exactly(false);
            utils.isObject(false).should.be.exactly(false);
            utils.isObject(["a", "1"]).should.be.exactly(false);
        });

    });

    describe('Utils.buildObjFromArr tests', () => {

        it('Build object from 3 levels array', () => {
            const obj = utils.buildObjFromArr(["00", "01", "02"]);
            obj.should.have.property("00").which.have.property("01").which.have.property("02", 1);
        });
    });

    describe('Utils.getValuePathFromColPath tests', () => {
        it('Build object from 3 levels array', () => {
            const colPath = "11___path1___22___path2___33___path3";
            const valuePath = utils.getValuePathFromColPath(colPath);
            valuePath.should.be.exactly("path1.path2.path3");
        });
    });

    describe('Utils.formatDateString tests', () => {
        it('Format date test1', () => {
            const formatted = utils.formatDateString("1/1/1970")
            formatted.should.be.exactly("01-Jan-1970")
        });
    });

    describe('Utils.GenerateGuid tests', () => {
        it('Generate new Guid', () => {
            const guid = utils.GenerateGuid();
            should(guid).be.a.String();
            guid.length.should.be.exactly(36);
        });
    });

    describe('Utils.formatTimeStampToString tests', () => {
        it('Format timestamp', () => {
            const dateAsString = utils.formatTimeStampToString(1624353471);
            dateAsString.should.be.exactly("Tuesday, June 22, 2021, 12:17")
        });
    });

    describe('Utils.GetCurrentUnixTime tests', () => {
        it('GetCurrentUnixTime should return number', () => {
            const unixTime = utils.GetCurrentUnixTime();
            unixTime.should.be.Number();
        });
    });

    describe('Utils.normalizeMongoId tests', () => {
        it('normalizeMongoId should return normalized object', () => {
            const normalizedObject = utils.normalizeMongoId({
                _id: "my_id"
            });
            normalizedObject.should.have.property('id', 'my_id')
        });
    });

});