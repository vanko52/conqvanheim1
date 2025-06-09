{
    "name": "conq-backend",
    "version": "0.1.0",
    "type": "module",
    "main": "index.js",

    "scripts": {
    "start": "node index.js",

        // 👉 add these two lines
        "generate": "prisma generate",
        "postinstall": "npm run generate && chmod +x ./node_modules/.bin/prisma"
},

    "dependencies": {
    "@prisma/client": "^5.22.0",
        "bcryptjs": "^2.4.3",
        "cors": "^2.8.5",
        "express": "^4.19.2",
        "jsonwebtoken": "^9.0.2"
},
    "devDependencies": {
    "prisma": "^5.22.0"
}
}
