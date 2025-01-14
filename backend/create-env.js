const fs = require('fs');
const path = require('path');

const envContent = `DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=kilitsugu123
DB_DATABASE=ai_navigation
JWT_SECRET=your_secret_key_here
PORT=3000
`;

fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');
console.log('.env 文件已创建'); 