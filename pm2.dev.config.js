module.exports = {
  apps: [
    {
      name: "imhof_dev",
      script: "./app.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_NAME: 'imhof_dev',
      },
      cwd: '/usr/local/share/website/dev.imhof-weine.ch/imhof_dev'
    }
  ],
};
