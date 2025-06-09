{
    "name": "conq-backend",
    "version": "0.1.0",
    "type": "module",
    "main": "index.js",

    "scripts": {
    "preinstall": "true",                       // placeholder, keep npm happy

        "postinstall": "chmod +x ./node_modules/.bin/prisma && npm install --prefix frontend && chmod +x ./frontend/node_modules/.bin/vite && npx prisma generate && npm --prefix frontend run build",


        "generate": "npx prisma generate",
        "build":    "npm --prefix frontend run build",
        "start":    "node index.js"
}



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
