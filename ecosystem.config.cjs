module.exports = {
  apps: [
    {
      name: "portfolio-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/portfolio-frontend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
