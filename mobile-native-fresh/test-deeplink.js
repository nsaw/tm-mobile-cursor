// Test deep link parsing
const testUrls = [
  'thoughtmarks://home',
  'thoughtmarks://dashboard',
  'thoughtmarks://search',
  'thoughtmarks://thoughtmarks',
  'thoughtmarks://ai-tools',
  'thoughtmarks://create',
  'thoughtmarks://thoughtmark?id=123',
  'thoughtmarks://bin?id=456&name=Work',
  'thoughtmarks://tag?tag=important',
  'thoughtmarks://tasks',
  'thoughtmarks://settings',
  'thoughtmarks://premium'
];

console.log('Testing deep link parsing...\n');

testUrls.forEach(url => {
  console.log(`Testing URL: ${url}`);
  
  // Simulate the parsing logic similar to expo-linking
  try {
    // Extract path and query parameters
    const [schemeAndPath, queryString] = url.split('?');
    const path = schemeAndPath.replace('thoughtmarks://', '');
    const params = {};
    
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
    
    console.log(`  Path: ${path}`);
    console.log(`  Params:`, params);
    console.log(`  Full URL: ${url}`);
    console.log('');
  } catch (error) {
    console.log(`  Error parsing: ${error.message}\n`);
  }
});

console.log('Deep link test completed!'); 