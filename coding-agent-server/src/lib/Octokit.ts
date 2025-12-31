import { Octokit } from "@octokit/rest";


const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
})


export function createOctokit(token?: string): Octokit {
    return new Octokit({
        auth: token || process.env.GITHUB_ACCESS_TOKEN
    });
}

export default octokit