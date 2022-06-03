import { IBuildResponse } from "../models/ibuild-response";
import { AppCenterWrapper } from "./app-center-wrapper";
import * as config from '../config/config.json';
import { format } from "util";

export class AppCenterProcessor {

    public appCenterWrapper = new AppCenterWrapper(); // can be mocked for tests

    public async startProcessing() {
        const branchList = await this.appCenterWrapper.getBranchList();
        for (const branchResponse of branchList) {
            const branchName = branchResponse.branch.name;
            this.buildBranch(branchName).then(build => this.printOutput(build, branchName));
        }
    }

    private async buildBranch(branchName: string): Promise<IBuildResponse> {
        const buildId = await this.appCenterWrapper.buildBranch(branchName);

        const timeoutMs = 1000;
        let resultedBuild: IBuildResponse;
        await new Promise<void>(resolve => {
            const interval = setInterval(async () => { // there might be a websocket or sse
                const builds = await this.appCenterWrapper.getBranchBuildList(branchName);
                resultedBuild = builds.find(build => build.id === buildId);
                if (!resultedBuild)
                    throw new Error(`Can't find build with id: ${buildId}`);
                if (resultedBuild.status == "completed") { // there should be a break at some point
                    clearInterval(interval);
                    resolve();
                }
            }, timeoutMs);
        });
        return resultedBuild;
    }

    private printOutput(build: IBuildResponse, branchName: string) {
        const diffSecs = Math.ceil((new Date(build.finishTime).getTime() - new Date(build.startTime).getTime()) / 1000);
        const appCenterConf = config.AppCenter;
        const logUrl = format(appCenterConf.build_log_url, appCenterConf.owner_name, appCenterConf.app_name, branchName, build.id);
        console.log(`Branch ${branchName} ${build.result} in ${diffSecs} seconds. Link to build logs: ${logUrl}`);
    }
}

export const appCenterProcessor = new AppCenterProcessor();
