const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.ts');

const fileContent = `export const environment =  {
  production: false,
  googleMapsApiKey: '${ process.env.GOOGLE_API_KEY }',
  placesApiUrl: 'https://failteireland.azure-api.net/opendata-api/v2/attractions'
};
`;

fs.writeFileSync(envFilePath, fileContent);
