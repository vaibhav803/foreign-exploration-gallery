const axios = require('axios');
const fs = require('fs-extra');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

class ExplorationGalleryLoadTester {
    constructor() {
        this.baseUrl = 'http://localhost';
        this.totalUsers = 100;
        this.results = [];
        this.serverStats = {};
        this.errors = [];
        this.startTime = Date.now();
        
        // User simulation patterns
        this.userBehaviors = [
            'casual_browser',    // Just visits homepage
            'photo_explorer',    // Views multiple photos
            'analytics_viewer',  // Checks analytics dashboard
            'api_user',         // Makes API calls directly
            'heavy_user'        // Does everything multiple times
        ];
    }

    async runLoadTest() {
        console.log(chalk.blue.bold('🚀 Starting Load Test for Foreign Exploration Gallery'));
        console.log(chalk.gray('=' .repeat(60)));
        console.log(chalk.yellow(`📊 Simulating ${this.totalUsers} concurrent users`));
        console.log(chalk.yellow(`🎯 Target: ${this.baseUrl}`));
        console.log(chalk.yellow(`⏰ Started at: ${new Date().toLocaleTimeString()}`));
        console.log('');

        // Create progress bar
        const progressBar = new cliProgress.SingleBar({
            format: 'Progress |{bar}| {percentage}% | {value}/{total} Users | ETA: {eta}s',
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true
        });

        progressBar.start(this.totalUsers, 0);

        // Create array of user simulation promises
        const userPromises = [];
        for (let i = 1; i <= this.totalUsers; i++) {
            const behavior = this.userBehaviors[Math.floor(Math.random() * this.userBehaviors.length)];
            userPromises.push(this.simulateUser(i, behavior, progressBar));
        }

        // Execute all users concurrently
        await Promise.allSettled(userPromises);
        
        progressBar.stop();
        
        // Generate and display results
        await this.generateReport();
        await this.analyzeServerPerformance();
    }

    async simulateUser(userId, behavior, progressBar) {
        const userSession = {
            userId,
            behavior,
            startTime: Date.now(),
            requests: [],
            serversHit: new Set(),
            errors: []
        };

        try {
            switch (behavior) {
                case 'casual_browser':
                    await this.casualBrowsingPattern(userSession);
                    break;
                case 'photo_explorer':
                    await this.photoExplorationPattern(userSession);
                    break;
                case 'analytics_viewer':
                    await this.analyticsViewingPattern(userSession);
                    break;
                case 'api_user':
                    await this.apiUserPattern(userSession);
                    break;
                case 'heavy_user':
                    await this.heavyUserPattern(userSession);
                    break;
            }
        } catch (error) {
            userSession.errors.push({
                message: error.message,
                timestamp: Date.now()
            });
            this.errors.push(`User ${userId}: ${error.message}`);
        }

        userSession.endTime = Date.now();
        userSession.duration = userSession.endTime - userSession.startTime;
        
        // Convert Set to Array for JSON serialization
        userSession.serversHitArray = [...userSession.serversHit];
        
        this.results.push(userSession);
        
        progressBar.increment();
    }

    async casualBrowsingPattern(userSession) {
        // Casual user: visits homepage, maybe checks a photo
        await this.makeRequest(userSession, 'GET', '/', 'Homepage Visit');
        await this.randomDelay(500, 2000);
        
        if (Math.random() > 0.5) {
            await this.makeRequest(userSession, 'GET', '/api/photos', 'Photos API');
        }
    }

    async photoExplorationPattern(userSession) {
        // Photo explorer: visits homepage, gets photos, views individual photos
        await this.makeRequest(userSession, 'GET', '/', 'Homepage Visit');
        await this.randomDelay(300, 1000);
        
        await this.makeRequest(userSession, 'GET', '/api/photos', 'Photos API');
        await this.randomDelay(500, 1500);
        
        // View 2-4 individual photos
        const photoCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 1; i <= photoCount; i++) {
            const photoId = Math.floor(Math.random() * 4) + 1;
            await this.makeRequest(userSession, 'GET', `/api/photos/${photoId}`, `Photo ${photoId} View`);
            await this.randomDelay(200, 800);
        }
    }

    async analyticsViewingPattern(userSession) {
        // Analytics viewer: checks homepage, then analytics dashboard
        await this.makeRequest(userSession, 'GET', '/', 'Homepage Visit');
        await this.randomDelay(1000, 2000);
        
        await this.makeRequest(userSession, 'GET', '/analytics.html', 'Analytics Dashboard');
        await this.randomDelay(500, 1000);
        
        await this.makeRequest(userSession, 'GET', '/api/analytics', 'Analytics API');
    }

    async apiUserPattern(userSession) {
        // API user: makes direct API calls
        await this.makeRequest(userSession, 'GET', '/api/health', 'Health Check');
        await this.randomDelay(100, 300);
        
        await this.makeRequest(userSession, 'GET', '/api/photos', 'Photos API');
        await this.randomDelay(200, 500);
        
        await this.makeRequest(userSession, 'GET', '/api/analytics', 'Analytics API');
    }

    async heavyUserPattern(userSession) {
        // Heavy user: does everything multiple times
        for (let round = 1; round <= 3; round++) {
            await this.makeRequest(userSession, 'GET', '/', `Homepage Visit ${round}`);
            await this.makeRequest(userSession, 'GET', '/api/photos', `Photos API ${round}`);
            
            // View random photos
            for (let i = 1; i <= 4; i++) {
                await this.makeRequest(userSession, 'GET', `/api/photos/${i}`, `Photo ${i} View ${round}`);
                await this.randomDelay(100, 300);
            }
            
            await this.makeRequest(userSession, 'GET', '/api/analytics', `Analytics API ${round}`);
            await this.randomDelay(200, 600);
        }
    }

    async makeRequest(userSession, method, path, description) {
        const startTime = Date.now();
        
        try {
            const response = await axios({
                method,
                url: `${this.baseUrl}${path}`,
                timeout: 10000,
                headers: {
                    'User-Agent': `LoadTester-User-${userSession.userId}`,
                    'X-Load-Test': 'true'
                }
            });

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            // Extract server info if available
            let serverId = 'unknown';
            if (response.data && typeof response.data === 'object' && response.data.server) {
                serverId = response.data.server;
                userSession.serversHit.add(serverId);
            }

            const requestData = {
                method,
                path,
                description,
                status: response.status,
                responseTime,
                serverId,
                timestamp: startTime,
                success: true
            };

            userSession.requests.push(requestData);

            // Track server stats
            if (!this.serverStats[serverId]) {
                this.serverStats[serverId] = {
                    requests: 0,
                    totalResponseTime: 0,
                    errors: 0
                };
            }
            this.serverStats[serverId].requests++;
            this.serverStats[serverId].totalResponseTime += responseTime;

        } catch (error) {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const requestData = {
                method,
                path,
                description,
                status: error.response ? error.response.status : 0,
                responseTime,
                serverId: 'error',
                timestamp: startTime,
                success: false,
                error: error.message
            };

            userSession.requests.push(requestData);
            userSession.errors.push(error.message);

            // Track error in server stats
            if (this.serverStats.errors) {
                this.serverStats.errors++;
            } else {
                this.serverStats.errors = 1;
            }
        }
    }

    randomDelay(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async generateReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;

        console.log('');
        console.log(chalk.green.bold('📊 LOAD TEST RESULTS'));
        console.log(chalk.gray('=' .repeat(60)));

        // Basic stats
        const totalRequests = this.results.reduce((sum, user) => sum + user.requests.length, 0);
        const successfulRequests = this.results.reduce((sum, user) => 
            sum + user.requests.filter(req => req.success).length, 0);
        const failedRequests = totalRequests - successfulRequests;

        console.log(chalk.blue(`⏱️  Total Test Duration: ${(totalDuration / 1000).toFixed(2)}s`));
        console.log(chalk.blue(`👥 Total Users Simulated: ${this.totalUsers}`));
        console.log(chalk.blue(`📡 Total Requests Made: ${totalRequests}`));
        console.log(chalk.green(`✅ Successful Requests: ${successfulRequests} (${((successfulRequests/totalRequests)*100).toFixed(1)}%)`));
        console.log(chalk.red(`❌ Failed Requests: ${failedRequests} (${((failedRequests/totalRequests)*100).toFixed(1)}%)`));

        // Response time stats
        const allResponseTimes = this.results.flatMap(user => 
            user.requests.filter(req => req.success).map(req => req.responseTime));
        
        if (allResponseTimes.length > 0) {
            const avgResponseTime = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;
            const minResponseTime = Math.min(...allResponseTimes);
            const maxResponseTime = Math.max(...allResponseTimes);
            
            console.log('');
            console.log(chalk.yellow.bold('⚡ RESPONSE TIME ANALYSIS'));
            console.log(chalk.yellow(`📈 Average Response Time: ${avgResponseTime.toFixed(2)}ms`));
            console.log(chalk.yellow(`🚀 Fastest Response: ${minResponseTime}ms`));
            console.log(chalk.yellow(`🐌 Slowest Response: ${maxResponseTime}ms`));
        }

        // Server distribution
        console.log('');
        console.log(chalk.cyan.bold('🖥️  SERVER LOAD DISTRIBUTION'));
        Object.entries(this.serverStats).forEach(([serverId, stats]) => {
            if (serverId !== 'errors') {
                const avgResponseTime = stats.totalResponseTime / stats.requests;
                console.log(chalk.cyan(`${serverId}: ${stats.requests} requests (avg: ${avgResponseTime.toFixed(2)}ms)`));
            }
        });

        // User behavior analysis
        console.log('');
        console.log(chalk.magenta.bold('👤 USER BEHAVIOR ANALYSIS'));
        const behaviorStats = {};
        this.results.forEach(user => {
            if (!behaviorStats[user.behavior]) {
                behaviorStats[user.behavior] = { count: 0, totalRequests: 0, avgDuration: 0 };
            }
            behaviorStats[user.behavior].count++;
            behaviorStats[user.behavior].totalRequests += user.requests.length;
            behaviorStats[user.behavior].avgDuration += user.duration;
        });

        Object.entries(behaviorStats).forEach(([behavior, stats]) => {
            const avgRequests = (stats.totalRequests / stats.count).toFixed(1);
            const avgDuration = (stats.avgDuration / stats.count / 1000).toFixed(2);
            console.log(chalk.magenta(`${behavior}: ${stats.count} users, avg ${avgRequests} requests, avg ${avgDuration}s session`));
        });

        // Save detailed results to file
        const reportData = {
            testSummary: {
                totalUsers: this.totalUsers,
                totalRequests,
                successfulRequests,
                failedRequests,
                totalDuration,
                timestamp: new Date().toISOString()
            },
            serverStats: this.serverStats,
            behaviorStats,
            userSessions: this.results,
            errors: this.errors
        };

        await fs.writeJson('./test-results.json', reportData, { spaces: 2 });
        console.log('');
        console.log(chalk.green('💾 Detailed results saved to: ./test-results.json'));
    }

    async analyzeServerPerformance() {
        console.log('');
        console.log(chalk.blue.bold('🔍 FETCHING CURRENT ANALYTICS DATA'));
        console.log(chalk.gray('-'.repeat(40)));

        try {
            const analyticsResponse = await axios.get(`${this.baseUrl}/api/analytics`);
            const analyticsData = analyticsResponse.data;

            console.log(chalk.green('📊 Current Website Analytics:'));
            console.log(chalk.white(`   Total Page Views: ${analyticsData.overview.totalPageViews}`));
            console.log(chalk.white(`   Unique Visitors: ${analyticsData.overview.uniqueVisitors}`));
            console.log(chalk.white(`   Total Requests: ${analyticsData.overview.totalRequests}`));
            console.log(chalk.white(`   Server Uptime: ${Math.floor(analyticsData.overview.serverUptime / 60)}m ${analyticsData.overview.serverUptime % 60}s`));
            console.log(chalk.white(`   Active Sessions: ${analyticsData.overview.activeSessions}`));

            if (analyticsData.photoStats.mostViewedPhotos.length > 0) {
                console.log(chalk.green('🖼️  Most Popular Photos:'));
                analyticsData.photoStats.mostViewedPhotos.forEach((photo, index) => {
                    console.log(chalk.white(`   ${index + 1}. ${photo.title}: ${photo.views} views`));
                });
            }

            // Save analytics snapshot
            await fs.writeJson('./analytics-snapshot.json', analyticsData, { spaces: 2 });
            console.log(chalk.green('💾 Analytics snapshot saved to: ./analytics-snapshot.json'));

        } catch (error) {
            console.log(chalk.red(`❌ Failed to fetch analytics: ${error.message}`));
        }
    }
}

// Run the load test
const loadTester = new ExplorationGalleryLoadTester();
loadTester.runLoadTest().catch(console.error);