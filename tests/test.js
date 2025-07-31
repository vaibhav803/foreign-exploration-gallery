const axios = require('axios');

class ExplorationTester {
    constructor() {
        this.baseUrl = 'http://load-balancer';
        this.testResults = [];
    }

    async runTests() {
        console.log('🧪 Starting Foreign Exploration Gallery Tests...\n');
        
        // Wait for services to be ready
        await this.waitForServices();
        
        await this.testHealthEndpoint();
        await this.testPhotosEndpoint();
        await this.testLoadBalancing();
        await this.testFrontend();
        
        this.printResults();
    }

    async waitForServices() {
        console.log('⏳ Waiting for services to be ready...');
        const maxRetries = 30; // 30 seconds max wait
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                const response = await axios.get(`${this.baseUrl}/health`, {
                    timeout: 2000,
                    headers: { 'User-Agent': 'ExplorationTester/1.0' }
                });
                
                if (response.status === 200) {
                    console.log('✅ Services are ready!');
                    return;
                }
            } catch (error) {
                retries++;
                console.log(`⏳ Attempt ${retries}/${maxRetries} - Services not ready yet...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        console.log('⚠️ Services may not be fully ready, proceeding with tests...');
    }

    async testHealthEndpoint() {
        try {
            console.log('Testing health endpoint...');
            console.log(`Attempting to connect to: ${this.baseUrl}/api/health`);
            
            // Add timeout and retry logic
            const response = await axios.get(`${this.baseUrl}/api/health`, {
                timeout: 10000, // 10 second timeout
                headers: { 'User-Agent': 'ExplorationTester/1.0' }
            });
            
            console.log(`Response status: ${response.status}`);
            console.log(`Response data:`, response.data);
            
            if (response.status === 200 && response.data.status === 'healthy') {
                this.testResults.push({ test: 'Health Endpoint', status: '✅ PASS' });
                console.log(`✅ Health check passed - Server: ${response.data.server}`);
            } else {
                this.testResults.push({ test: 'Health Endpoint', status: '❌ FAIL' });
                console.log('❌ Health check failed - Invalid response format');
            }
        } catch (error) {
            this.testResults.push({ test: 'Health Endpoint', status: '❌ FAIL', error: error.message });
            console.log('❌ Health check failed:', error.message);
            if (error.code) console.log(`Error code: ${error.code}`);
            if (error.response) {
                console.log(`HTTP Status: ${error.response.status}`);
                console.log(`Response data:`, error.response.data);
            }
        }
    }

    async testPhotosEndpoint() {
        try {
            console.log('Testing photos API endpoint...');
            const response = await axios.get(`${this.baseUrl}/api/photos`);
            
            if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
                this.testResults.push({ test: 'Photos API', status: '✅ PASS' });
                console.log(`✅ Photos API working - Found ${response.data.length} photos`);
            } else {
                this.testResults.push({ test: 'Photos API', status: '❌ FAIL' });
            }
        } catch (error) {
            this.testResults.push({ test: 'Photos API', status: '❌ FAIL', error: error.message });
            console.log('❌ Photos API failed:', error.message);
        }
    }

    async testLoadBalancing() {
        try {
            console.log('Testing load balancing...');
            const servers = new Set();
            
            // Make multiple requests to see if we hit different servers
            for (let i = 0; i < 10; i++) {
                const response = await axios.get(`${this.baseUrl}/api/health`);
                if (response.data.server) {
                    servers.add(response.data.server);
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (servers.size >= 2) {
                this.testResults.push({ test: 'Load Balancing', status: '✅ PASS' });
                console.log(`✅ Load balancing working - Hit servers: ${Array.from(servers).join(', ')}`);
            } else {
                this.testResults.push({ test: 'Load Balancing', status: '⚠️ PARTIAL' });
                console.log(`⚠️ Load balancing partial - Only hit: ${Array.from(servers).join(', ')}`);
            }
        } catch (error) {
            this.testResults.push({ test: 'Load Balancing', status: '❌ FAIL', error: error.message });
            console.log('❌ Load balancing test failed:', error.message);
        }
    }

    async testFrontend() {
        try {
            console.log('Testing frontend...');
            const response = await axios.get(this.baseUrl);
            
            if (response.status === 200 && response.data.includes('Foreign Exploration Gallery')) {
                this.testResults.push({ test: 'Frontend', status: '✅ PASS' });
                console.log('✅ Frontend loading correctly');
            } else {
                this.testResults.push({ test: 'Frontend', status: '❌ FAIL' });
            }
        } catch (error) {
            this.testResults.push({ test: 'Frontend', status: '❌ FAIL', error: error.message });
            console.log('❌ Frontend test failed:', error.message);
        }
    }

    printResults() {
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        
        this.testResults.forEach(result => {
            console.log(`${result.test}: ${result.status}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        const passed = this.testResults.filter(r => r.status.includes('✅')).length;
        const total = this.testResults.length;
        
        console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 All tests passed! The Foreign Exploration Gallery is working perfectly!');
        } else {
            console.log('⚠️ Some tests failed. Please check the application setup.');
        }
    }
}

// Run tests with proper error handling and exit codes
const tester = new ExplorationTester();
tester.runTests()
    .then(() => {
        // Check if all tests passed
        const passed = tester.testResults.filter(r => r.status.includes('✅')).length;
        const total = tester.testResults.length;
        
        if (passed === total) {
            console.log('\n🎉 All tests completed successfully!');
            process.exit(0); // Success
        } else {
            console.log('\n⚠️ Some tests failed.');
            process.exit(1); // Failure
        }
    })
    .catch(error => {
        console.error('❌ Test suite failed to run:', error);
        process.exit(1); // Failure
    });