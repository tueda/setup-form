"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
function installForm(version) {
    return __awaiter(this, void 0, void 0, function* () {
        // In the GitHub releases, we have
        //   - 4.2.1
        //   - 4.2.0
        //   - 4.1.0 (= 4.1)
        //   - 4.0.0 (= 4.0-20120410)
        // at least for x86_64-linux. Note that each of these "stable" versions is
        // known to have specific critical bugs. Be careful!
        let semanticVersion;
        let downloadVersion;
        let tagVersion;
        if (version === '4.0' || version === '4.0.0') {
            semanticVersion = '4.0.0';
            downloadVersion = '4.0-20120410';
            tagVersion = 'v4.0-20120410';
        }
        else if (version === '4.1' || version === '4.1.0') {
            semanticVersion = '4.1.0';
            downloadVersion = '4.1';
            tagVersion = 'v4.1-20131025';
        }
        else {
            semanticVersion = normalizeVersion(version);
            downloadVersion = semanticVersion;
            tagVersion = `v${semanticVersion}`;
        }
        core.debug(`FORM version = ${version}`);
        core.debug(`FORM semanticVersion = ${semanticVersion}`);
        core.debug(`FORM downloadVersion = ${downloadVersion}`);
        core.debug(`FORM tagVersion = ${tagVersion}`);
        // First, check cache. Note that the caching utility accept only semantic
        // versions.
        let toolPath = tc.find('form', semanticVersion);
        if (!toolPath) {
            // Download from the GitHub releases.
            let arch = 'unknown';
            if (process.platform === 'linux') {
                arch = 'x86_64-linux';
            }
            else if (process.platform === 'darwin') {
                arch = 'x86_64-osx';
            }
            else if (process.platform === 'win32') {
                arch = 'x86_64-win32';
            }
            const downloadUrl = `https://github.com/vermaseren/form/releases/download/${tagVersion}/form-${downloadVersion}-${arch}.tar.gz`;
            let downloadPath;
            try {
                downloadPath = yield tc.downloadTool(downloadUrl);
            }
            catch (error) {
                core.debug(error);
                throw `Failed to download version ${version}: ${error}`;
            }
            // Extract and install into the tool cache.
            const extPath = yield tc.extractTar(downloadPath);
            const toolRoot = path.join(extPath, `form-${downloadVersion}-${arch}`);
            toolPath = yield tc.cacheDir(toolRoot, 'form', semanticVersion);
        }
        // Add it to the PATH.
        core.addPath(toolPath);
        return toolPath;
    });
}
exports.installForm = installForm;
function normalizeVersion(version) {
    const versionPart = version.split(".");
    if (versionPart[1] == null) {
        return `${version}.0.0`;
    }
    else if (versionPart[2] == null) {
        return `${version}.0`;
    }
    else {
        return version;
    }
}
