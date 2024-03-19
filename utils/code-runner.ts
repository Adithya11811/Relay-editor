import Docker from "dockerode";

const docker = new Docker();

const imageName = "nodejs-api";
const imageTag = "latest";
const fullImageName = `${imageName}:${imageTag}`