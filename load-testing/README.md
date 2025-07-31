# 🚀 Foreign Exploration Gallery Load Testing Suite

This isolated load testing system simulates 100 concurrent users connecting to your Foreign Exploration Gallery website and provides detailed analytics on how the system handles the load.

## 🎯 What It Does

- **Simulates 100 concurrent users** with different behavior patterns
- **Tests load balancing** between your two server instances
- **Measures response times** for all endpoints
- **Tracks server distribution** and performance
- **Analyzes user journeys** and interaction patterns
- **Captures real-time analytics** from your website
- **Provides detailed recommendations** for optimization

## 🏗️ User Behavior Patterns

The load tester simulates 5 different types of users:

1. **Casual Browser** (20%) - Just visits homepage, maybe checks photos
2. **Photo Explorer** (25%) - Views homepage, gets photos, explores individual photos
3. **Analytics Viewer** (15%) - Checks homepage then analytics dashboard
4. **API User** (20%) - Makes direct API calls for health, photos, analytics
5. **Heavy User** (20%) - Does everything multiple times in multiple rounds

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd load-testing
npm install
```

### 2. Make Sure Your Main Application is Running
```bash
# In the main project directory
sudo docker-compose up -d
```

### 3. Run the Load Test
```bash
npm test
```

### 4. Analyze Results (Optional)
```bash
npm run analyze
```

## 📊 What You'll See

### During the Test
- Real-time progress bar showing user simulation progress
- Live feedback on test execution

### After the Test
- **📈 Response Time Analysis** - Average, min, max response times
- **🖥️ Server Load Distribution** - How requests were balanced between servers
- **👤 User Behavior Analysis** - Breakdown by user type and session duration
- **📊 Current Analytics Data** - Real-time website analytics snapshot
- **💡 Recommendations** - Specific suggestions for optimization

## 📁 Generated Files

After running the test, you'll find:

- `test-results.json` - Complete detailed test results
- `analytics-snapshot.json` - Website analytics at test completion

## 🔍 Key Metrics Measured

### Performance Metrics
- **Response Times** - Average, min, max, 95th percentile
- **Success Rate** - Percentage of successful requests
- **Requests Per Second** - System throughput
- **Server Distribution** - Load balancing effectiveness

### User Experience Metrics
- **User Journey Patterns** - Most common navigation paths
- **Server Switching** - How often users hit different servers
- **Session Duration** - Time spent by different user types
- **Error Rates** - Failed requests and their causes

### System Health Metrics
- **Load Balancing Effectiveness** - Distribution quality score
- **Server Response Consistency** - Performance across instances
- **Analytics Impact** - How load test affected website metrics

## 🎯 Expected Results

With a properly configured system, you should see:

- ✅ **95%+ Success Rate** - Nearly all requests succeed
- ✅ **<500ms Average Response Time** - Fast response times
- ✅ **Even Load Distribution** - Requests balanced between servers
- ✅ **No Server Errors** - All instances handling load properly

## 🔧 Troubleshooting

### If Load Test Fails
1. **Check if main application is running**: `sudo docker-compose ps`
2. **Verify accessibility**: `curl http://localhost/api/health`
3. **Check for port conflicts**: Make sure port 80 is available

### If Results Show Poor Performance
1. **High Response Times** - Check server resources and database queries
2. **Load Balancing Issues** - Verify nginx configuration
3. **High Error Rates** - Check application logs for errors

## 📈 Interpreting Results

### Excellent Performance
- Success rate: 98%+
- Average response time: <300ms
- Load balancing deviation: <5%

### Good Performance
- Success rate: 95-98%
- Average response time: 300-500ms
- Load balancing deviation: 5-15%

### Needs Improvement
- Success rate: <95%
- Average response time: >500ms
- Load balancing deviation: >15%

## 🚀 Advanced Usage

### Custom User Count
Edit `load-tester.js` and change `this.totalUsers = 100` to your desired number.

### Custom Behavior Patterns
Modify the `userBehaviors` array and add new simulation methods.

### Extended Analytics
The system captures detailed metrics that can be used for further analysis or integration with monitoring tools.

---

**Ready to stress test your Foreign Exploration Gallery? Run `npm test` and see how your system performs under load!** 🎯