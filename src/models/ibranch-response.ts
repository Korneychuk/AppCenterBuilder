export interface IBranchResponse {
  branch: {
    name: string;
  }
  lastBuild: IBranchResponse;
}
