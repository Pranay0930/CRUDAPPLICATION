module.exports = {
    apps: [
      {
        name: "crud-app",
        script: "server.js",
        instances: "1",
        exec_mode: "cluster",
        watch: true,
      },     
    ],
  };
  