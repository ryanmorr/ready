module.exports = (api) => {
    api.cache(true);

    const presets = [
        ["@babel/preset-env", {
            modules: false
        }]
    ];

    return {
        presets
    };
};
