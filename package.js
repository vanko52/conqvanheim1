"scripts": {
    "start": "node index.js",
        "generate": "prisma generate",
        "postinstall": "npm run generate && chmod +x ./node_modules/.bin/prisma"
}
