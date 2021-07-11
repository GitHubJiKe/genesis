const shell = require("shelljs");
const path = require("path");
const chalk = require("chalk");
const logSymbols = require("log-symbols");
const jsonfile = require("jsonfile");
const child_process = require("child_process");

exports.promisify = function (fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    return new Promise((resolve, reject) => {
      args.push((err, ...res) => {
        if (err) {
          reject(err);
          s;
          return;
        }
        resolve(res);
      });
      fn.apply(null, args);
    });
  };
};

const asyncExec = exports.promisify(child_process.exec);

exports.asyncExec = asyncExec;

exports.copyConfig2Root = async function () {
  await asyncExec(
    `cp ${path.resolve(__dirname, "./genesis.config.json")} ~/.genesis/`
  );
};

async function makeDirOfConfig() {
  const [st] = await asyncExec(`cd ~/. && ls -a`);
  if (st.includes(".genesis")) {
    return Promise.resolve(true);
  }
  await asyncExec("mkdir ~/.genesis");
}

function isConfigExistInRoot() {
  return isExistFile("~/.genesis/genesis.config.json");
}

function isExistFile(path) {
  return shell.test("-e", path);
}

exports.readRootConfig = async function () {
  if (!isConfigExistInRoot()) {
    await makeDirOfConfig();
    await exports.copyConfig2Root();
  }

  const tempFilePath = path.resolve(__dirname, "./config.temp.json");

  if (isExistFile(tempFilePath)) {
    shell.rm(tempFilePath);
  }

  await asyncExec(`cp ~/.genesis/genesis.config.json ${tempFilePath}`);

  const config = jsonfile.readFileSync(tempFilePath);

  return config;
};

exports.readCurrentConfig = function () {
  return jsonfile.readFileSync(
    path.resolve(__dirname, "./genesis.config.json")
  );
};

exports.writeConfig2Current = function (conf) {
  return jsonfile.writeFile(
    path.resolve(__dirname, "./genesis.config.json"),
    conf,
    {
      spaces: 2,
    }
  );
};

exports.logGreen = function (txt, withSymbol = false) {
  const greenTxt = chalk.green(txt);
  return withSymbol
    ? console.log(logSymbols.success, greenTxt)
    : console.log(greenTxt);
};

exports.logRed = function (txt, withSymbol = false) {
  const redTxt = chalk.red(txt);
  return withSymbol
    ? console.log(logSymbols.error, redTxt)
    : console.log(redTxt);
};

exports.stringify = function (obj) {
  return JSON.stringify(obj, null, 2);
};
