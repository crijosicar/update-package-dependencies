'use strict';
const { set, has, pick, toPairs, get } = require('lodash');
const { getJSONDataFromFile, writePackageJSONFile } = require('./file');
const { projectRootFolder, packageJsonRootPath } = require('./commander');
const chalk = require('chalk');
const log = console.log;

const getNMDependencyVersion = (dependency) => {
    const packageJsonNodeModulesPath = `${projectRootFolder}/node_modules/${dependency}/package.json`;
    const packageJsonNodeModulesData = getJSONDataFromFile(packageJsonNodeModulesPath);

    return get(packageJsonNodeModulesData, 'version');
}

(() => {
    log(chalk.blue.bgRed.bold('Process started\n'));

    const packageData = getJSONDataFromFile(packageJsonRootPath);
    const { dependencies, devDependencies } = pick(packageData, ['dependencies', 'devDependencies']);
    const mergedDependencies = { ...dependencies, ...devDependencies };

    for (const [dependency, version] of toPairs(mergedDependencies)) {
        const packageJsonNMVersion = getNMDependencyVersion(dependency);
        const dependencyType = has(dependencies, dependency) ? "dependencies" : "devDependencies";

        set(packageData, `${dependencyType}.${dependency}`, `^${packageJsonNMVersion}`);
        log(chalk.yellowBright(`| ${chalk.black.bgGreen.bold(dependencyType)} | Dependecy ${chalk.green.bgBlack(dependency)} updated FROM version ${chalk.green.bgBlack(version)} TO => ${chalk.green.bgBlack(`^${packageJsonNMVersion}`)}`));
    }

    writePackageJSONFile(packageData);

    log(chalk.blue.bgRed.bold(`\nThe package ${projectRootFolder}/package.json has been updated.`))
    log(chalk.blue.bgRed.bold('\nProcess finished'));
})();