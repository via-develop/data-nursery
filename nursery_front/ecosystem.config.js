module.exports = {
  apps: [
    {
      name: "data-nursery-farmhouse",
      exec_mode: "cluster",
      instances: "0", // Or a number of instances , 0으로 설정 시 최대 수로 구동
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      env_local: {
        APP_ENV: "local", // APP_ENV=local
      },
      env_development: {
        APP_ENV: "dev", // APP_ENV=dev
      },
      env_production: {
        APP_ENV: "prod", // APP_ENV=prod
      },
    },
  ],
};
