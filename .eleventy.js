const CleanCSS = require("clean-css");
const { minify } = require("terser");
module.exports = function (eleventyConfig) {
    eleventyConfig.setTemplateFormats(["md", "jpeg", "png", "pdf"]);
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });
    eleventyConfig.addNunjucksAsyncFilter(
        "jsmin",
        async function (code, callback) {
            try {
                const minified = await minify(code);
                callback(null, minified.code);
            } catch (err) {
                console.error("Terser error: ", err);
                // Fail gracefully.
                callback(null, code);
            }
        }
    );
    return {
        passthroughFileCopy: true,
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
    };
};
