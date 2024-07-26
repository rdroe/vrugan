import { parseSemVer } from "semver-parser"
import { readFileSync, writeFileSync } from "fs"
import { execSync } from 'child_process'
import { formatInTimeZone } from "date-fns-tz"

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"))
const version = parseSemVer(packageJson.version)




function executeGitCommand(command) {
    return execSync(command)
        .toString('utf8')
        .replace(/[\n\r\s]+$/, '');
}

const BRANCH = executeGitCommand('git rev-parse --abbrev-ref HEAD');
const COMMIT_SHA = executeGitCommand('git rev-parse HEAD').slice(0, 5);
const dateStr = formatInTimeZone(new Date, "America/Los_Angeles", "yyyy.MM.dd")



const bumpedPackageJson = {
    ...packageJson
}

bumpedPackageJson.version = `${version.major}.${version.minor}.${version.patch}-nightly-${dateStr}-${COMMIT_SHA}`

writeFileSync("./package.json", JSON.stringify(bumpedPackageJson, null, 2, "utf8"))


