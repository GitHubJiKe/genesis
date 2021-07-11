const utils = require("./utils");

exports.checkTemplates = async function (templates, name) {
  if (name) {
    const template = templates.find((v) => v.name === name);
    if (template) {
      utils.logGreen(utils.stringify(template));
    } else {
      utils.logRed(`未查找到您查询的模板，请检查输入是否正确`, true);
      utils.logGreen(
        `存在的模板名：\n${templates.map((v) => v.name).join("\n")}`
      );
    }
  } else {
    utils.logGreen(utils.stringify(templates));
  }
};
