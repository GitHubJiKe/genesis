const utils = require("./utils");
const merge = require("lodash/merge");
const ora = require("ora");

module.exports = async function sync() {
  const spinner = ora();
  spinner.start("开始同步");
  const rootConf = await utils.readRootConfig();
  const curConfig = utils.readCurrentConfig();
  const conf = merge(curConfig, rootConf);
  await utils.writeConfig2Current(conf);
  await utils.copyConfig2Root();
  spinner.succeed("同步完成");
};
