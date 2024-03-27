
import { NextRequest, NextResponse } from "next/server";
import Dockerode from "dockerode";

// Define constants for rate limiting
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Maximum requests allowed per window

// Create a map to track request counts for each IP address
const requestCounts = new Map();

export async function POST(request: NextRequest) {
    let { code, language } = await request.json();
    const docker = new Dockerode();

    try {
        // Check if the IP address has exceeded the rate limit
        const clientIP = request?.remoteAddr!;
        const currentTimestamp = Date.now();
        const windowStart = currentTimestamp - RATE_LIMIT_WINDOW_MS;

        // Get the request count for the current IP address within the window
        const count = requestCounts.get(clientIP) || 0;

        // If the request count exceeds the limit, return a rate limit error
        if (count >= MAX_REQUESTS_PER_WINDOW) {
            return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }

        // Increment the request count for the current IP address
        requestCounts.set(clientIP, count + 1);

        // Schedule the reset of the request count for the current IP address after the window
        setTimeout(() => {
            requestCounts.delete(clientIP);
        }, RATE_LIMIT_WINDOW_MS);

        let image;
        let command;

        // Determine Docker image and command based on language
        switch (language.value) {
            case 'python':
                image = 'python:latest';
                command = ['python', '-c', code];
                break;
            case 'javascript':
            case 'typescript':
                image = 'node:latest';
                
                command = ['node', '-e', code];
                console.log(command)
                break;
            case 'c':
                code = removeCommentsCpp(code);
                image = 'gcc:latest';
                command = ['bash', '-c', `echo '${code}' > /tmp/code.c && gcc /tmp/code.c -o /tmp/code && /tmp/code`];
                console.log(command)
                break;
           case 'cpp':
                case 'cpp':
    code = removeCommentsCpp(code);
    image = 'gcc:latest';
    command = [
        'bash',
        '-c',
        `echo '${code.replace(/'/g, "\\'")}' > /tmp/code.cpp && g++ /tmp/code.cpp -o /tmp/code && /tmp/code`
    ];
    break;

            default:
                return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }

        // Create Docker container
        const container = await docker.createContainer({
            Image: image,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: command,
            OpenStdin: false,
            StdinOnce: false
        });

        // Start the Docker container
        await container.start();

        // Wait for the container to finish execution
        await container.wait();

        // Get the container's logs
        const logStream = await container.logs({ stdout: true, stderr: true });
        const output = logStream.toString(); // Convert logs to string
        console.log(output)
        // Separate output and error messages
        const lines = output.split('\n');
        const errorMessages = lines.filter(line => line.toLowerCase().includes('error'));
        let standardOutput = lines.filter(line => !line.toLowerCase().includes('error')).join('\n');
        standardOutput = removeAnsiEscapeSequences(standardOutput);
        // Stop and remove the container
        await container.remove();

        if (errorMessages.length !== 0) {
            return NextResponse.json({
                error: {
                    status: {
                        statusId: 1,
                        description: standardOutput
                    }
                }
            }, {
                status: 400
            });
        }

        return NextResponse.json({
            data: {
                output: standardOutput,
                status: {
                    statusId: 2,
                    description: "Successful"
                }
            }
        });
    } catch (error) {
        console.error("Error executing code:", error);
        return NextResponse.json({ error: "Failed to execute code" }, { status: 500 });
    }
}
function removeAnsiEscapeSequences(input: string) {
    // Regular expression to match ANSI escape sequences
    const ansiRegex = /(\u001B\[[0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g;
    return input.replace(ansiRegex, '');
}
function removeCommentsCpp(code: string): string {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '');

    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');

    return code;
}