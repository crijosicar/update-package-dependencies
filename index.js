'use strict';
const { set, has, pick, toPairs, get } = require('lodash');
const { sanitizeVersion, roundVersion, getJSONDataFromFile, writePackageJSONFile, getUpdateStrategyNotation } = require('./utils');
const { projectRootFolder, packageJsonRootPath } = require('./commander');
const chalk = require('chalk');
const log = console.log;

const shouldUpdateRootDependency = (dependencyVersionA, dependencyVersionB) => {
    const cleanedVersionA = roundVersion(sanitizeVersion(dependencyVersionA));
    const cleanedVersionB = roundVersion(sanitizeVersion(dependencyVersionB));

    return cleanedVersionA > cleanedVersionB;
}

(() => {
    log(chalk.blue.bgRed.bold('Process started\n'));

    const packageData = getJSONDataFromFile(packageJsonRootPath);
    const { dependencies, devDependencies } = pick(packageData, ['dependencies', 'devDependendies']);
    const mergedDependencies = { ...dependencies, ...devDependencies };

    for (const [dependency, version] of toPairs(mergedDependencies)) {
        const packageJsonNodeModulesPath = `${projectRootFolder}/node_modules/${dependency}/package.json`;
        const packageJsonNodeModulesData = getJSONDataFromFile(packageJsonNodeModulesPath);
        const packageJsonNodeModulesVersion = get(packageJsonNodeModulesData, 'version');

        //TODO: Should we validate if the version in dependency package is greater than version in root package ?
        if(shouldUpdateRootDependency(packageJsonNodeModulesVersion, version)){
            const dependencyFolder = has(dependencies, dependency) ? "dependencies" : "devDependencies";
            //TODO: Should we include the update strategy from root package ?
            const versionUpdated = `${getUpdateStrategyNotation(version)}${packageJsonNodeModulesVersion}`;

            set(packageData, `${dependencyFolder}.${dependency}`, versionUpdated);
            log(chalk.yellowBright(`Dependency ${chalk.green.bgBlack(dependency)} updated from version ${chalk.green.bgBlack(version)} to ${chalk.green.bgBlack(versionUpdated)}`));
        }
    }

    writePackageJSONFile(packageData);

    log(chalk.blue.bgRed.bold(`\nThe package ${projectRootFolder}/package.json has been updated.`))
    log(chalk.blue.bgRed.bold('\nProcess finished'));
})();