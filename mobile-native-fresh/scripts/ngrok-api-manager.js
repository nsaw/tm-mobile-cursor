#!/usr/bin/env { { { { node

// ngrok-api-manager.js & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
// Programmatic ngrok tunnel management using API

const htt{ { { { ps = require('https') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const NGROK_API_KEY = process.env.ngrok_api;
const NGROK_API_BASE = 'https://api.ngrok.com';

class NgrokAPIManager {
  constructor() {
    if (!NGROK_API_KEY) {
      throw new Error('ngrok_api key not found in environment variables');
    }
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.ngrok.com',
        port: 443,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${NGROK_API_KEY}`,
          'Content-Type': 'application/json',
          'Ngrok-Version': '2'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${body}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async listTunnels() {
    console.log('📡 Fetching tunnels from ngrok API...');
    try {
      const response = await this.makeRequest('/tunnels');
      return response.tunnels || [];
    } catch (error) {
      console.error('❌ Error fetching tunnels:', error.message);
      return [];
    }
  }

  async getTunnel(tunnelId) {
    try {
      const response = await this.makeRequest(`/tunnels/${tunnelId}`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching tunnel ${tunnelId}:`, error.message);
      return null;
    }
  }

  async createTunnel(config) {
    console.log('🚀 Creating tunnel via API...');
    try {
      const response = await this.makeRequest('/tunnels', 'POST', config);
      console.log('✅ Tunnel created successfully');
      return response;
    } catch (error) {
      console.error('❌ Error creating tunnel:', error.message);
      return null;
    }
  }

  async deleteTunnel(tunnelId) {
    console.log(`🗑️  Deleting tunnel ${tunnelId}...`);
    try {
      await this.makeRequest(`/tunnels/${tunnelId}`, 'DELETE');
      console.log('✅ Tunnel deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting tunnel:', error.message);
      return false;
    }
  }

  async listDomains() {
    console.log('🌐 Fetching domains from ngrok API...');
    try {
      const response = await this.makeRequest('/domains');
      return response.domains || [];
    } catch (error) {
      console.error('❌ Error fetching domains:', error.message);
      return [];
    }
  }

  async createDomain(name, region = 'us') {
    console.log(`🌐 Creating domain ${name}...`);
    try {
      const response = await this.makeRequest('/domains', 'POST', {
        name: name,
        region: region
      });
      console.log('✅ Domain created successfully');
      return response;
    } catch (error) {
      console.error('❌ Error creating domain:', error.message);
      return null;
    }
  }

  async listEndpoints() {
    console.log('🔗 Fetching endpoints from ngrok API...');
    try {
      const response = await this.makeRequest('/endpoints');
      return response.endpoints || [];
    } catch (error) {
      console.error('❌ Error fetching endpoints:', error.message);
      return [];
    }
  }

  async createEndpoint(config) {
    console.log('🔗 Creating endpoint via API...');
    try {
      const response = await this.makeRequest('/endpoints', 'POST', config);
      console.log('✅ Endpoint created successfully');
      return response;
    } catch (error) {
      console.error('❌ Error creating endpoint:', error.message);
      return null;
    }
  }

  async getAccountInfo() {
    console.log('👤 Fetching account information...');
    try {
      const response = await this.makeRequest('/account');
      return response;
    } catch (error) {
      console.error('❌ Error fetching account info:', error.message);
      return null;
    }
  }

  async getUsage() {
    console.log('📊 Fetching usage statistics...');
    try {
      const response = await this.makeRequest('/usage');
      return response;
    } catch (error) {
      console.error('❌ Error fetching usage:', error.message);
      return null;
    }
  }

  displayTunnels(tunnels) {
    console.log('\n📡 Active Tunnels:');
    console.log('==================');
    
    if (tunnels.length === 0) {
      console.log('No tunnels found');
      return;
    }

    tunnels.forEach((tunnel, index) => {
      console.log(`${index + 1}. ${tunnel.name || 'Unnamed'}`);
      console.log(`   ID: ${tunnel.id}`);
      console.log(`   URL: ${tunnel.public_url}`);
      console.log(`   Local: ${tunnel.config?.addr || 'N/A'}`);
      console.log(`   Status: ${tunnel.status || 'N/A'}`);
      console.log(`   Protocol: ${tunnel.proto || 'N/A'}`);
      console.log('');
    });
  }

  displayDomains(domains) {
    console.log('\n🌐 Domains:');
    console.log('==========');
    
    if (domains.length === 0) {
      console.log('No domains found');
      return;
    }

    domains.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain.name}`);
      console.log(`   ID: ${domain.id}`);
      console.log(`   Region: ${domain.region}`);
      console.log(`   Status: ${domain.status}`);
      console.log('');
    });
  }

  displayAccountInfo(account) {
    console.log('\n👤 Account Information:');
    console.log('======================');
    console.log(`Name: ${account.name}`);
    console.log(`Email: ${account.email}`);
    console.log(`Plan: ${account.plan}`);
    console.log(`Created: ${account.created_at}`);
    console.log('');
  }
}

// CLI interface
async function main() {
  const manager = new NgrokAPIManager();
  const command = process.argv[2] || 'tunnels';

  try {
    switch (command) {
      case 'tunnels':
        const tunnels = await manager.listTunnels();
        manager.displayTunnels(tunnels);
        break;

      case 'domains':
        const domains = await manager.listDomains();
        manager.displayDomains(domains);
        break;

      case 'account':
        const account = await manager.getAccountInfo();
        manager.displayAccountInfo(account);
        break;

      case 'usage':
        const usage = await manager.getUsage();
        console.log('📊 Usage Statistics:', JSON.stringify(usage, null, 2));
        break;

      case 'create-tunnel':
        const tunnelConfig = {
          name: process.argv[3] || 'api-tunnel',
          addr: process.argv[4] || '8080',
          proto: 'http'
        };
        const newTunnel = await manager.createTunnel(tunnelConfig);
        if (newTunnel) {
          console.log('✅ New tunnel created:', newTunnel.public_url);
        }
        break;

      case 'delete-tunnel':
        const tunnelId = process.argv[3];
        if (!tunnelId) {
          console.error('❌ Please provide tunnel ID');
          process.exit(1);
        }
        await manager.deleteTunnel(tunnelId);
        break;

      case 'create-domain':
        const domainName = process.argv[3];
        if (!domainName) {
          console.error('❌ Please provide domain name');
          process.exit(1);
        }
        const newDomain = await manager.createDomain(domainName);
        if (newDomain) {
          console.log('✅ New domain created:', newDomain.name);
        }
        break;

      default:
        console.log('Usage: { { { { node ngrok-api-manager.js [command]') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
        console.log('');
        console.log('Commands:');
        console.log('  tunnels        - List all tunnels');
        console.log('  domains        - List all domains');
        console.log('  account        - Show account information');
        console.log('  usage          - Show usage statistics');
        console.log('  create-tunnel [name] [addr] - Create new tunnel');
        console.log('  delete-tunnel [id] - Delete tunnel');
        console.log('  create-domain [name] - Create new domain');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = NgrokAPIManager; 