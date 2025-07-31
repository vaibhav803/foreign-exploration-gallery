const fs = require('fs-extra');
const chalk = require('chalk');

class LoadTestAnalyzer {
    constructor() {
        this.resultsFile = './test-results.json';
        this.analyticsFile = './analytics-snapshot.json';
    }

    async analyzeResults() {
        console.log(chalk.blue.bold('🔬 DETAILED LOAD TEST ANALYSIS'));
        console.log(chalk.gray('=' .repeat(60)));

        try {
            const results = await fs.readJson(this.resultsFile);
            const analytics = await fs.readJson(this.analyticsFile);

            await this.analyzeLoadBalancing(results);
            await this.analyzeResponseTimes(results);
            await this.analyzeUserJourneys(results);
            await this.analyzeServerImpact(results, analytics);
            await this.generateRecommendations(results);

        } catch (error) {
            console.log(chalk.red(`❌ Error analyzing results: ${error.message}`));
            console.log(chalk.yellow('💡 Make sure to run the load test first!'));
        }
    }

    async analyzeLoadBalancing(results) {
        console.log(chalk.cyan.bold('⚖️  LOAD BALANCING ANALYSIS'));
        console.log(chalk.gray('-'.repeat(40)));

        const serverHits = {};
        const serverResponseTimes = {};

        results.userSessions.forEach(session => {
            session.requests.forEach(request => {
                if (request.success && request.serverId !== 'unknown') {
                    if (!serverHits[request.serverId]) {
                        serverHits[request.serverId] = 0;
                        serverResponseTimes[request.serverId] = [];
                    }
                    serverHits[request.serverId]++;
                    serverResponseTimes[request.serverId].push(request.responseTime);
                }
            });
        });

        const totalHits = Object.values(serverHits).reduce((a, b) => a + b, 0);

        console.log(chalk.cyan('📊 Request Distribution:'));
        Object.entries(serverHits).forEach(([serverId, hits]) => {
            const percentage = ((hits / totalHits) * 100).toFixed(1);
            const avgResponseTime = serverResponseTimes[serverId].reduce((a, b) => a + b, 0) / serverResponseTimes[serverId].length;
            
            console.log(chalk.white(`   ${serverId}: ${hits} requests (${percentage}%) - Avg: ${avgResponseTime.toFixed(2)}ms`));
        });

        // Load balancing effectiveness
        const serverCount = Object.keys(serverHits).length;
        const idealPercentage = 100 / serverCount;
        const deviations = Object.values(serverHits).map(hits => 
            Math.abs(((hits / totalHits) * 100) - idealPercentage)
        );
        const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;

        console.log(chalk.cyan(`🎯 Load Balancing Effectiveness: ${(100 - avgDeviation).toFixed(1)}%`));
        if (avgDeviation < 5) {
            console.log(chalk.green('✅ Excellent load distribution!'));
        } else if (avgDeviation < 15) {
            console.log(chalk.yellow('⚠️  Good load distribution with minor imbalance'));
        } else {
            console.log(chalk.red('❌ Poor load distribution - check load balancer configuration'));
        }
    }

    async analyzeResponseTimes(results) {
        console.log('');
        console.log(chalk.yellow.bold('⚡ RESPONSE TIME DEEP DIVE'));
        console.log(chalk.gray('-'.repeat(40)));

        const endpointStats = {};

        results.userSessions.forEach(session => {
            session.requests.forEach(request => {
                if (request.success) {
                    if (!endpointStats[request.path]) {
                        endpointStats[request.path] = {
                            requests: 0,
                            totalTime: 0,
                            minTime: Infinity,
                            maxTime: 0,
                            times: []
                        };
                    }
                    
                    const stats = endpointStats[request.path];
                    stats.requests++;
                    stats.totalTime += request.responseTime;
                    stats.minTime = Math.min(stats.minTime, request.responseTime);
                    stats.maxTime = Math.max(stats.maxTime, request.responseTime);
                    stats.times.push(request.responseTime);
                }
            });
        });

        console.log(chalk.yellow('📈 Endpoint Performance:'));
        Object.entries(endpointStats).forEach(([endpoint, stats]) => {
            const avgTime = stats.totalTime / stats.requests;
            
            // Calculate 95th percentile
            const sortedTimes = stats.times.sort((a, b) => a - b);
            const p95Index = Math.floor(sortedTimes.length * 0.95);
            const p95Time = sortedTimes[p95Index];

            console.log(chalk.white(`   ${endpoint}:`));
            console.log(chalk.white(`     Requests: ${stats.requests}`));
            console.log(chalk.white(`     Avg: ${avgTime.toFixed(2)}ms | Min: ${stats.minTime}ms | Max: ${stats.maxTime}ms`));
            console.log(chalk.white(`     95th percentile: ${p95Time}ms`));
        });
    }

    async analyzeUserJourneys(results) {
        console.log('');
        console.log(chalk.magenta.bold('👥 USER JOURNEY ANALYSIS'));
        console.log(chalk.gray('-'.repeat(40)));

        const journeyPatterns = {};
        const serverSwitching = { users: 0, totalSwitches: 0 };

        results.userSessions.forEach(session => {
            // Analyze journey pattern
            const journey = session.requests.map(req => req.path).join(' → ');
            if (!journeyPatterns[journey]) {
                journeyPatterns[journey] = 0;
            }
            journeyPatterns[journey]++;

            // Analyze server switching
            const servers = session.serversHitArray || [];
            if (servers.length > 1) {
                serverSwitching.users++;
                serverSwitching.totalSwitches += servers.length - 1;
            }
        });

        console.log(chalk.magenta('🛤️  Most Common User Journeys:'));
        const sortedJourneys = Object.entries(journeyPatterns)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        sortedJourneys.forEach(([journey, count], index) => {
            console.log(chalk.white(`   ${index + 1}. ${journey} (${count} users)`));
        });

        console.log(chalk.magenta('🔄 Server Switching Analysis:'));
        console.log(chalk.white(`   Users who hit multiple servers: ${serverSwitching.users}/${results.testSummary.totalUsers}`));
        if (serverSwitching.users > 0) {
            const avgSwitches = serverSwitching.totalSwitches / serverSwitching.users;
            console.log(chalk.white(`   Average server switches per user: ${avgSwitches.toFixed(1)}`));
        }
    }

    async analyzeServerImpact(results, analytics) {
        console.log('');
        console.log(chalk.green.bold('🖥️  SERVER IMPACT ANALYSIS'));
        console.log(chalk.gray('-'.repeat(40)));

        const beforeTest = {
            // These would be baseline metrics if we had them
            pageViews: 0,
            requests: 0
        };

        const afterTest = {
            pageViews: analytics.overview.totalPageViews,
            requests: analytics.overview.totalRequests
        };

        console.log(chalk.green('📊 Website Analytics Impact:'));
        console.log(chalk.white(`   Page Views Generated: ${afterTest.pageViews}`));
        console.log(chalk.white(`   Total Requests Processed: ${afterTest.requests}`));
        console.log(chalk.white(`   Unique Visitors Recorded: ${analytics.overview.uniqueVisitors}`));
        console.log(chalk.white(`   Active Sessions: ${analytics.overview.activeSessions}`));

        if (analytics.photoStats.mostViewedPhotos.length > 0) {
            console.log(chalk.green('🖼️  Photo Engagement:'));
            analytics.photoStats.mostViewedPhotos.forEach(photo => {
                console.log(chalk.white(`   "${photo.title}": ${photo.views} views`));
            });
        }

        // Calculate requests per second during test
        const testDurationSeconds = results.testSummary.totalDuration / 1000;
        const rps = results.testSummary.totalRequests / testDurationSeconds;
        
        console.log(chalk.green('⚡ Performance Metrics:'));
        console.log(chalk.white(`   Requests per second: ${rps.toFixed(2)} RPS`));
        console.log(chalk.white(`   Success rate: ${((results.testSummary.successfulRequests / results.testSummary.totalRequests) * 100).toFixed(1)}%`));
    }

    async generateRecommendations(results) {
        console.log('');
        console.log(chalk.blue.bold('💡 RECOMMENDATIONS'));
        console.log(chalk.gray('-'.repeat(40)));

        const recommendations = [];

        // Check success rate
        const successRate = (results.testSummary.successfulRequests / results.testSummary.totalRequests) * 100;
        if (successRate < 95) {
            recommendations.push('🔧 Investigate failed requests - success rate is below 95%');
        } else {
            recommendations.push('✅ Excellent success rate - system handled load well');
        }

        // Check response times
        const allResponseTimes = results.userSessions.flatMap(session => 
            session.requests.filter(req => req.success).map(req => req.responseTime));
        const avgResponseTime = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;

        if (avgResponseTime > 1000) {
            recommendations.push('⚡ Consider optimizing response times - average is above 1 second');
        } else if (avgResponseTime > 500) {
            recommendations.push('⚡ Good response times, but could be optimized further');
        } else {
            recommendations.push('✅ Excellent response times - under 500ms average');
        }

        // Check load balancing
        const serverHits = {};
        results.userSessions.forEach(session => {
            session.requests.forEach(request => {
                if (request.success && request.serverId !== 'unknown') {
                    serverHits[request.serverId] = (serverHits[request.serverId] || 0) + 1;
                }
            });
        });

        const serverCount = Object.keys(serverHits).length;
        if (serverCount >= 2) {
            recommendations.push('✅ Load balancing is working - multiple servers detected');
        } else {
            recommendations.push('⚖️ Only one server detected - check load balancer configuration');
        }

        recommendations.forEach(rec => {
            console.log(chalk.blue(rec));
        });

        console.log('');
        console.log(chalk.green.bold('🎯 OVERALL ASSESSMENT'));
        if (successRate >= 95 && avgResponseTime <= 500 && serverCount >= 2) {
            console.log(chalk.green('🏆 EXCELLENT - Your system handled the load test perfectly!'));
        } else if (successRate >= 90 && avgResponseTime <= 1000) {
            console.log(chalk.yellow('👍 GOOD - System performed well with minor areas for improvement'));
        } else {
            console.log(chalk.red('⚠️  NEEDS ATTENTION - Several areas require optimization'));
        }
    }
}

// Run the analysis
const analyzer = new LoadTestAnalyzer();
analyzer.analyzeResults().catch(console.error);