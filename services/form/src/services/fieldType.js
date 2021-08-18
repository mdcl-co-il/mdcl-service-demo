const makeFieldType = () => {
    const fieldTypes = [
        {
            "id": 1,
            "name": "Text"
        },
        {
            "id": 2,
            "name": "Number"
        },
        {
            "id": 3,
            "name": "Date"
        },
        {
            "id": 6,
            "name": "Form Link"
        },
        {
            "id": 7,
            "name": "Open list ComboBox"
        }
    ];

    return Object.freeze({
        fieldTypes
    });
};

Object.assign(module.exports, {
    makeFieldType
});