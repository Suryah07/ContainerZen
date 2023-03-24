const Docker = require('dockerode');
const docker = new Docker();


// ---------------------------------------Images--------------------------------------------
async function createimage(image){
    const stream = await docker.pull(image);
    return new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });

    });
}

async function deleteimage(images){
    for (const imageName of images) {
      try {
        const image = docker.getImage(imageName);
        await image.remove({ force: true });
        console.log(`Deleted Docker image: ${imageName}`);
      } catch (error) {
        console.error(`Error deleting Docker image ${imageName}: ${error.message}`);
      }
    }
}

async function listimages(){
    const images = await docker.listImages();
    return images;
}


// ---------------------------------------Containers--------------------------------------------
async function startcontainer(containerids){
  for (const containername of containerids) {
    try {
      const image = docker.getContainer(containername);
      await image.start();
    } catch (error) {
      console.error(`Error starting Docker image ${containername}: ${error.message}`);
    }
  }
    return;
}

async function stopcontainer(containerids){
  for (const containername of containerids) {
    try {
      const image = docker.getContainer(containername);
      await image.stop();
    } catch (error) {
      console.error(`Error stoping Docker image ${containername}: ${error.message}`);
    }
}
};

async function listcontainers(){
    const containers = await docker.listContainers({ all: true });
    return containers
}

async function createContainer(containerName, imageName, networkName, hostvolume,containervolume, hostport,containerport,restartpolicy) {
  let image = await docker.getImage(imageName).inspect().catch(() => null);
  if (!image) {
    console.log(`Image '${imageName}' not found locally. Pulling from Docker Hub...`);
    const stream = await docker.pull(imageName);
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    image = await docker.getImage(imageName).inspect();
  }
  const portbindings = {
    [`${containerport}/tcp`]: [
      {
        HostPort: `${hostport}`,
      },]
  };

  // Create the container
  if(hostvolume && containervolume){
    console.log("edsf")
    const container = await docker.createContainer({
      Image: imageName,
      name: containerName,
      ExposedPorts:{containerport: {}},
      RestartPolicy: {
        Name: restartpolicy,
        MaximumRetryCount: 5,
      },
      HostConfig: {
        Binds: [`${hostvolume}:${containervolume}`],
        PortBindings: portbindings,
      },
      NetworkingConfig: {
        EndpointsConfig: {
          [networkName]: {}
        }
      }
    });
    await container.start();
    console.log(`Container '${containerName}' created and started`);  
    return container;
  }else{
    const container = await docker.createContainer({
      Image: imageName,
      name: containerName,
      ExposedPorts:{containerport: {}},
      RestartPolicy: {
        Name: restartpolicy,
        MaximumRetryCount: 5,
      },
      HostConfig: {
        PortBindings: portbindings,
      },
      NetworkingConfig: {
        EndpointsConfig: {
          [networkName]: {}
        }
      }
    });
    await container.start();
    console.log(`Container '${containerName}' created and started`);  
    return container;
  }
    
}

async function restartcontainer(containerids){
  for (const containername of containerids) {
    try {
      const image = docker.getContainer(containername);
      await image.restart();
    } catch (error) {
      console.error(`Error restarting Docker image ${containername}: ${error.message}`);
    }
}
}

async function removeContainer(containerId) {
  for (const containername of containerids) {
    try {
      const image = docker.getContainer(containername);
      await image.remove();
    } catch (error) {
      console.error(`Error removing Docker image ${containername}: ${error.message}`);
    }
}
}


async function getContainerStats(containerId) {
  try {
    const container = dockerClient.getContainer(containerId);
    const stats = await container.stats({ stream: false });
    const cpuUsage = stats.cpu_stats.cpu_usage.total_usage;
    const systemCpuUsage = stats.cpu_stats.system_cpu_usage;
    const cpuPercent = ((cpuUsage / systemCpuUsage) * 100).toFixed(2);
    const memoryUsage = stats.memory_stats.usage;
    const memoryLimit = stats.memory_stats.limit;
    const memoryPercent = ((memoryUsage / memoryLimit) * 100).toFixed(2);
    const timestamp = moment(stats.read).format('YYYY-MM-DD HH:mm:ss');

    return {
      containerId,
      cpuPercent,
      memoryUsage,
      memoryLimit,
      memoryPercent,
      timestamp,
    };
  } catch (err) {
    console.error(`Error getting stats for container ${containerId}: ${err}`);
    return null;
  }
}

async function fetchContainerStats() {
  const containers = await docker.listContainers();
  const containerStats = [];

  for (const container of containers) {
    const stats = await docker.getContainer(container.Id).stats({ stream: false });

    const cpuUsage = stats.cpu_stats.cpu_usage.total_usage;
    const systemCpuUsage = stats.cpu_stats.system_cpu_usage;
    const memoryUsage = stats.memory_stats.usage;

    const cpuPercent = ((cpuUsage / systemCpuUsage) * 100).toFixed(2);
    const memoryUsageMB = (memoryUsage / 1024 / 1024).toFixed(2);
    containerStats.push({
      id: container.Id,
      name: container.Names[0],
      cpuUsage: cpuPercent,
      memoryUsage: memoryUsageMB
    });
  }

  return containerStats;
}


// ---------------------------------------Volumes--------------------------------------------

async function createVolume(volumeName) {
    const volume = await docker.createVolume({
    Name: volumeName
    });
    console.log(`Created volume ${volumeName}`);
    return volume;
}

async function deleteVolume(volumeNames) {
    // await docker.getVolume(volumeName).remove();
    for (const volumeName of volumeNames) {
      const volume = docker.getVolume(volumeName);
      try {
        await volume.remove();
        console.log(`Volume ${volumeName} deleted.`);
      } catch (err) {
        console.error(`Error deleting volume ${volumeName}: ${err.message}`);
      }
    }
}

async function listvolumes(){
    const volumes = await docker.listVolumes();
    return volumes;
}


// ---------------------------------------Networks--------------------------------------------

async function createNetwork(networkName, driver="bridge") {
  try {
    const network = await docker.getNetwork(networkName).inspect();
    console.log(`Network ${networkName} already exists`);
    return network;
  } catch (error) {
    console.log(`Creating network ${networkName}`);
    const networkOptions = {
      Name: networkName,
      Driver: driver,
    };
    const network = await docker.createNetwork(networkOptions);
    console.log(`Created network ${networkName}`);
    return network;
  }
}

async function listnetworks(){
    const networks = await docker.listNetworks();
    return networks;
}


async function deleteNetwork(name) {
  try {
    const network = docker.getNetwork(name);
    await network.remove();
    console.log(`Network ${name} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting network ${name}: ${error}`);
    throw error;
  }
}





//---------------------------------------Exports--------------------------------------------

module.exports = {
    createimage,
    createContainer,
    listcontainers,
    startcontainer,
    stopcontainer,
    restartcontainer,
    removeContainer,
    createVolume,
    deleteVolume,
    getContainerStats,
    createNetwork,
    deleteimage,
    deleteNetwork,
    listvolumes,
    listnetworks,
    listimages,
    fetchContainerStats,
}
