import { execAsync } from '../../constants/repoIngest';

export async function startSandbox(taskId: string) {
    const containerName = `sandbox-exec-${taskId}`;
    await execAsync(`docker run -d --name ${containerName} --rm --workdir /app node:18-alpine tail -f /dev/null`);

    await execAsync(`docker exec ${containerName} apk add --no-cache git openssh-client`)

    return containerName;
}

export async function stopSandbox(containerName: string) {
    try {
        await execAsync(`docker stop ${containerName}`);
    } catch (e) {
        console.warn(`Failed to stop sandbox ${containerName}`, e);
    }
}

export async function runSandboxCommand(containerName: string, command: string) {
    const { stdout } = await execAsync(`docker exec ${containerName} sh -c "${command.replace(/"/g, '\\"')}"`);
    return stdout.trim();
}