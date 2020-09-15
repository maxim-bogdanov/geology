const _ = require("lodash");
const read = require("../utils/read");
const toCamelCase = require("../utils/toCamelCase");

module.exports = function templates(type) {
  const template = _.template(
    read(`scripts/templates/template.${type}.lodash`)
  );

  return function templates(componentName, appDir, relative) {
    const relativePath = relative(
      "/components/framework/jquery/plugins/plugins"
    );

    return template({
      author: JSON.stringify(require("../gulp/config").author()),
      package: JSON.stringify(componentName),
      description: JSON.stringify(`${componentName} - описание`),
      componentName,
      camelCase: toCamelCase(componentName),
      className: toCamelCase(componentName, true),
      relativePath,
      relativePathNoExt: relativePath.replace(/\.[^./]+$/, "")
    });
  }
};
