module.exports ={
    apps: [
        {
            name: "Jtube",
            script: "./init.js",
            watch: true,
            ignore_watch: ["node_modules", "uploads/*"],     //모듈 수정 되도 재시작x
            interpreter: "./node_modules/.bin/babel-node",      //babel 사용하여 시작
            env: {
                "PORT": 8000,
                "MONGO_URL": "mongodb://localhost:27017/mydb",
                "NODEMAILER_USER": process.env.NODEMAILER_USER,
                "NODEMAILER_PASS": process.env.NODEMAILER_PASS,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 80,
                "MONGO_URL": "mongodb://localhost:27017/mydb",
                "NODEMAILER_USER": process.env.NODEMAILER_USER,
                "NODEMAILER_PASS": process.env.NODEMAILER_PASS,
                "NODE_ENV": "production"
            }
        }
    ]
};