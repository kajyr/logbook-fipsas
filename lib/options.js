const options = {};

module.exports = {
    getOptions: () => options,
    set: (prop, value) => {
        options[prop] = value;
    }
};
