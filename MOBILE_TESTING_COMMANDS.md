# Mobile Testing Commands - Swipe Analytics Platform

## 🎯 **Quick Barcode Generation Commands**

### **Method 1: Clean Start (Recommended)**
```bash
# Kill all Node processes
taskkill /IM node.exe /F

# Navigate to project
cd C:\Users\Daniel\swipe\swipe-app

# Start Expo with tunnel mode
npx expo start --tunnel --port 9000
```

### **Method 2: Alternative Ports**
```bash
# If port 9000 is busy, try these:
npx expo start --tunnel --port 9001
npx expo start --tunnel --port 9002
npx expo start --tunnel --port 9003
```

### **Method 3: Clear Cache + Fresh Start**
```bash
# Kill processes
taskkill /IM node.exe /F

# Navigate to project
cd C:\Users\Daniel\swipe\swipe-app

# Clear cache and start
npx expo start --clear --tunnel --port 9000
```

### **Method 4: LAN Mode (Alternative)**
```bash
# If tunnel mode fails
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --lan --port 9000
```

## 📱 **What You'll See**

When successful, you'll see:
- **QR Code** in the terminal
- **"Metro waiting on exp://..."** line
- **Options** to press 'w', 'i', 'a' for different platforms

## 🔧 **Troubleshooting**

### **If Port Conflicts:**
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

### **If Still Failing:**
```bash
# Reset everything
taskkill /IM node.exe /F
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --clear --tunnel --port 9001
```

## 📋 **Workflow Integration**

### **When to Generate New Barcode:**
- **After code changes** to SwipeCard or SwipeDemoScreen
- **After adding new questions** or features
- **When testing new animations** or interactions
- **When troubleshooting** mobile-specific issues

### **Development Workflow:**
1. **Make code changes** in Cursor
2. **Save files** (auto-reload should work for web)
3. **For mobile testing**: Generate new barcode using commands above
4. **Scan QR code** with Expo Go app
5. **Test functionality** on mobile device

## 🎯 **Best Practices**

- **Always kill Node processes** before starting fresh
- **Use tunnel mode** for best compatibility
- **Try different ports** if conflicts occur
- **Clear cache** if you see old behavior
- **Test on both web and mobile** for full validation

## 📱 **Mobile Testing Setup**

1. **Install Expo Go** on your phone
2. **Ensure same WiFi** network as computer
3. **Scan QR code** from terminal
4. **Test swipe functionality** in all directions
5. **Verify animations** and analytics tracking

---

*These commands ensure you always get a fresh barcode with the latest code changes for mobile testing.*








