const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.ts');

const fileContent = `export const environment = {
  production: true,
  apiKey: '${ process.env.GOOGLE_API_KEY }'
};
`;

fs.writeFileSync(envFilePath, fileContent);
