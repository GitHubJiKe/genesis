const inquirer = require("inquirer");
const utils = require("./utils");

async function setTemplates() {
  const conf = await utils.readRootConfig();
  const templates = conf.templates;
  const { name, field } = await askTemplateNameAndField(templates);
  const target = templates.find((v) => v.name === name);
  const { value } = await askFieldValue(field);
  if (field === "branchs") {
    target[field] = value.split(",");
  } else {
    target[field] = value;
  }

  await utils.writeConfig2Current(conf);
  await utils.copyConfig2Root();
  utils.logGreen(`设置成功`, true);
}

async function askTemplateNameAndField(templates) {
  const questions = [
    {
      name: "name",
      type: "list",
      message: "请选择你要设置的模板",
      choices: templates.map((v) => v.name),
    },
    {
      name: "field",
      type: "list",
      message: "请选择你要配置的字段",
      choices: Object.keys(templates[0]),
    },
  ];

  return inquirer.prompt(questions);
}

async function askFieldValue(field) {
  const question = {
    name: "value",
    type: "input",
  };
  let message = "";
  switch (field) {
    case "url":
      message = "请输入新的url";
      break;
    case "name":
      message = "请输入新的名称";
      break;
    case "branchs":
      message = "请输入新的分支名，如果多个，请用英文逗号隔开";
      break;
  }

  question.message = message;

  return inquirer.prompt([question]);
}

module.exports = {
  setTemplates,
};
