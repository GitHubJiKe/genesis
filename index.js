#!/usr/local/bin/node

const Command = require("commander").Command;
const utils = require("./utils");
const pkg = require("./package.json");
const sync = require("./sync");
const create = require("./create");
const getOperates = require("./getOperates");
const setOperates = require("./setOperates");

const program = new Command();

program
  .version(pkg.version)
  .option("-v, --version", "查看版本号")
  .option("-h, --help", "查看帮助")
  .parse(process.argv);

program
  .command("sync")
  .description("同步配置信息")
  .action(() => sync());

program
  .command("new")
  .description("基于模板创建项目")
  .action(() => create());

program
  .command("get")
  .description("查看配置")
  .argument("[field]", "配置项")
  .argument("[name]", "模板名")
  .action(async (field, name) => {
    const conf = await utils.readRootConfig();
    const validFields = Object.keys(conf);
    if (field) {
      if (validFields.includes(field)) {
        if (field === "templates") {
          getOperates.checkTemplates(conf.templates, name);
        }
      } else {
        utils.logRed(`您查询的配置项不存在，请重新输入`);
      }
    } else {
      utils.logGreen(utils.stringify(conf));
    }
  });

program
  .command("set")
  .description("更新配置项")
  .argument("[field]", "配置项")
  .action(async (field) => {
    const conf = await utils.readRootConfig();
    const validFields = Object.keys(conf);
    if (!field) {
      utils.logRed("请输入要设置的配置项");
    } else if (!validFields.includes(field)) {
      utils.logRed(`您输入的配置项不存在`, true);
      utils.logGreen(`已知配置项：\n${validFields.join("\n")}`);
    } else if (field === "templates") {
      setOperates.setTemplates();
    }
  });

program.parse();
