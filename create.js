const inquirer = require("inquirer");
const jsonfile = require("jsonfile");
const path = require("path");
const utils = require("./utils");
const ora = require("ora");

async function create() {
  // 1. 选择模板
  const { url } = await chooseTemplate();
  // 2.选择分支
  const { branch } = await chooseBranch(url);
  // 3.输入项目名称
  const { name } = await inputProjectName();
  // 4.拉取项目
  const spinner = ora();
  try {
    spinner.start("开始克隆仓库到本地");
    const successed = await clone(url, branch, name);
    // 5.修改项目名称
    if (successed) {
      spinner.succeed("仓库克隆成功");
      modifyProjectName(name);
      // 6.提示成功
      utils.logGreen(`恭喜您，项目创建成功`, true);
    }
  } catch (error) {
    spinner.fail("仓库克隆失败");
    utils.logRed(
      `git 拉取仓库失败，请检查是否配置了SSH KEY,错误信息如下：\n${error}`,
      true
    );
  }
}

async function getTemplatesFromRootConfig() {
  try {
    const conf = await utils.readRootConfig();
    return conf.templates;
  } catch (error) {
    utils.logRed(error, true);
  }
}

async function chooseTemplate() {
  const templates = await getTemplatesFromRootConfig();
  const question = {
    name: "url",
    type: "list",
    message: "请选择你要使用的模板",
    choices: templates.map((v) => v.url),
  };

  return inquirer.prompt([question]);
}

async function chooseBranch(url) {
  const templates = await getTemplatesFromRootConfig();
  const question = {
    name: "branch",
    type: "list",
    message: "请选择你要使用的分支",
    choices: templates.find((v) => v.url === url).branchs,
  };

  return inquirer.prompt([question]);
}

async function inputProjectName() {
  const question = {
    name: "name",
    type: "input",
    message: "请输入项目名称",
    default: "genesis-demo",
  };
  return inquirer.prompt([question]);
}

async function clone(url, branch, name) {
  await utils.asyncExec(`git clone -b ${branch} ${url} ${name}`);
}

function modifyProjectName(name) {
  const pkgPath = path.resolve(process.cwd(), `./${name}/package.json`);
  const pkg = jsonfile.readFileSync(pkgPath);
  pkg.name = name;
  jsonfile.writeFileSync(pkgPath, pkg, { spaces: 2 });
}

module.exports = create;
