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
            "name": "Password"
        },
        {
            "id": 4,
            "name": "TextBox"
        },
        {
            "id": 5,
            "name": "ComboBox"
        },
        {
            "id": 6,
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