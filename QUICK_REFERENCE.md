# Quick Reference - Swipe Analytics Platform

## 🎯 **Mobile Testing Commands**

### **Generate New Barcode (After Code Changes)**
```bash
# Kill all Node processes
taskkill /IM node.exe /F

# Navigate to project
cd C:\Users\Daniel\swipe\swipe-app

# Start Expo with tunnel mode
npx expo start --tunnel --port 9000
```

### **Alternative Ports (If 9000 is busy)**
```bash
npx expo start --tunnel --port 9001
npx expo start --tunnel --port 9002
npx expo start --tunnel --port 9003
```

### **Clear Cache + Fresh Start**
```bash
taskkill /IM node.exe /F
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --clear --tunnel --port 9000
```

## 📱 **Testing Workflow**

### **When to Generate New Barcode:**
- ✅ After code changes to SwipeCard or SwipeDemoScreen
- ✅ After adding new questions or features
- ✅ When testing new animations or interactions
- ✅ When troubleshooting mobile-specific issues

### **Development Process:**
1. **Make code changes** in Cursor
2. **Save files** (web auto-reloads)
3. **For mobile testing**: Run barcode command above
4. **Scan QR code** with Expo Go app
5. **Test functionality** on mobile device

## 🔧 **Troubleshooting**

### **Port Conflicts:**
```bash
# Check what's using ports
netstat -ano | findstr :9000
netstat -ano | findstr :9001

# Kill specific processes
taskkill /PID <process_id> /F
```

### **If Tunnel Fails:**
```bash
# Try LAN mode instead
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --lan --port 9000
```

## 📋 **Current Features**

### **Swipe Functionality:**
- **4-directional swiping** (Yes, No, YES!, NO!)
- **Smooth animations** (cards animate off-screen)
- **Rotation effects** during swipe gestures
- **Per-question analytics** tracking

### **Questions with Icons:**
- ⚽ "Do you like football?"
- 👨‍🍳 "Do you enjoy cooking?"
- 🎵 "Do you like music?"
- 📚 "Do you enjoy reading?"
- ✈️ "Do you like traveling?"

### **Analytics Dashboard:**
- **Real-time totals** for each swipe direction
- **Per-question results table** with borders
- **Recent swipes history** (last 10 swipes)
- **Compact results display** for test data

## 🎯 **Next Development Steps**

1. **Database setup** for persistent data storage
2. **User authentication** system
3. **Admin interface** for content management
4. **AI content generation** integration
5. **Advanced analytics** dashboard

---

*This quick reference provides the essential commands and workflow for mobile testing the Swipe Analytics Platform.*