module.exports = {
  apps: [
    {
      name: "imhof",
      script: "./app.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      cwd: '/usr/local/share/website/www.imhof-weine.ch/imhof'
    }
  ],
};
