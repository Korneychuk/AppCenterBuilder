import { RequestOptions } from "https";
import { makeRequest } from "../helpers/http-helper";
import * as config from '../config/config.json';
import { format } from "util";
import { IBranchResponse } from "..//models/ibranch-response";
import { IBuildResponse } from "../models/ibuild-response";

export class AppCenterWrapper {

    private static _ownerName = config.AppCenter.owner_name;
    private static _appName = config.AppCenter.app_name;
    private static _host = config.AppCenter.host;
    private static _apiToken = config.AppCenter.api_token; // not secure

    public async getBranchList(): Promise<IBranchResponse[]> {

        let result = <IBranchResponse[]>[];
        const url = format(config.AppCenter.get_branches, AppCenterWrapper._ownerName, AppCenterWrapper._appName);
        const options: RequestOptions = {
            host: AppCenterWrapper._host,
            path: url,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-Token': AppCenterWrapper._apiToken,
            },
        };
        const response = await makeRequest(options);
        if (response.status == 200 || response.status == 204) {
            result = <IBranchResponse[]>JSON.parse(response.body); // there should be a mapping instead of casting
        } // else handle error

        return result;
    }

    public async buildBranch(branchName: string): Promise<number> {
        let buildId: number | undefined;
        const url = format(config.AppCenter.branch_builds, AppCenterWrapper._ownerName, AppCenterWrapper._appName, branchName);
        const options: RequestOptions = {
            host: AppCenterWrapper._host,
            path: url,
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'X-API-Token': AppCenterWrapper._apiToken,
            },
        };
        const response = await makeRequest(options);
        if (response.status == 200 || response.status == 204) {
            buildId = JSON.parse(response.body).id;
        } // else handle error
        return buildId!;
    }

    public async getBranchBuildList(branchName: string): Promise<IBuildResponse[]> {

        let result = <IBuildResponse[]>[];
        const url = format(config.AppCenter.branch_builds, AppCenterWrapper._ownerName, AppCenterWrapper._appName, branchName);
        const options: RequestOptions = {
            host: AppCenterWrapper._host,
            path: url,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-Token': AppCenterWrapper._apiToken,
            },
        };
        const response = await makeRequest(options);
        if (response.status == 200 || response.status == 204) {
            result = <IBuildResponse[]>JSON.parse(response.body); // there should be a mapping instead of casting
        } // else handle error

        return result;
    }
}