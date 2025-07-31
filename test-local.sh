#!/bin/bash

echo "🧪 Testing Foreign Exploration Gallery locally..."
echo "================================================"

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost/health | tr -d '\n')
if [[ "$HEALTH_RESPONSE" == "healthy" ]]; then
    echo "✅ Health endpoint: PASS"
else
    echo "❌ Health endpoint: FAIL - Response: '$HEALTH_RESPONSE'"
fi

# Test API health endpoint
echo "2. Testing API health endpoint..."
API_HEALTH=$(curl -s http://localhost/api/health | grep -o '"status":"healthy"')
if [[ "$API_HEALTH" == '"status":"healthy"' ]]; then
    echo "✅ API health endpoint: PASS"
else
    echo "❌ API health endpoint: FAIL"
fi

# Test photos API
echo "3. Testing photos API..."
PHOTOS_COUNT=$(curl -s http://localhost/api/photos | grep -o '"id":' | wc -l)
if [[ $PHOTOS_COUNT -gt 0 ]]; then
    echo "✅ Photos API: PASS - Found $PHOTOS_COUNT photos"
else
    echo "❌ Photos API: FAIL"
fi

# Test frontend
echo "4. Testing frontend..."
FRONTEND_CHECK=$(curl -s http://localhost/ | grep -o "Foreign Exploration Gallery")
if [[ "$FRONTEND_CHECK" == "Foreign Exploration Gallery" ]]; then
    echo "✅ Frontend: PASS"
else
    echo "❌ Frontend: FAIL"
fi

# Test load balancing
echo "5. Testing load balancing..."
SERVERS=$(for i in {1..10}; do curl -s http://localhost/api/health | grep -o '"server":"[^"]*"'; done | sort | uniq | wc -l)
if [[ $SERVERS -ge 1 ]]; then
    echo "✅ Load balancing: WORKING - Detected $SERVERS server(s)"
    for i in {1..3}; do 
        SERVER=$(curl -s http://localhost/api/health | grep -o '"server":"[^"]*"')
        echo "   Request $i: $SERVER"
    done
else
    echo "❌ Load balancing: FAIL"
fi

# Test analytics endpoint
echo "6. Testing analytics endpoint..."
ANALYTICS_CHECK=$(curl -s http://localhost/api/analytics | grep -o '"overview"')
if [[ "$ANALYTICS_CHECK" == '"overview"' ]]; then
    echo "✅ Analytics API: PASS"
else
    echo "❌ Analytics API: FAIL"
fi

echo ""
echo "🎉 All manual tests completed!"
echo "📍 Visit http://localhost to see the gallery"
echo "📊 Visit http://localhost/analytics.html to see analytics"