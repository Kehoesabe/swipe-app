# Mobile Barcode Troubleshooting - Expo Development Server

## 🚨 **Current Issue**
Unable to generate mobile barcode for testing. Multiple port conflicts preventing Expo development server from starting properly.

## 📋 **Current Status**
- **Web server**: Running successfully on port 8082 at `http://localhost:8082`
- **Mobile barcode**: Not generating due to port conflicts
- **Ports in use**: 8081, 8082, 8083 (possibly more)
- **Error**: "Port X is being used by another process"

## 🔧 **Troubleshooting Steps Needed**

### **1. Port Conflict Resolution**
**Problem**: Multiple ports (8081, 8082, 8083) are already in use
**Solution**: Find and kill existing processes or use different ports

**Commands to try:**
```bash
# Check what's using the ports
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083

# Kill processes using specific ports (replace PID with actual process ID)
taskkill /PID <process_id> /F

# Or use a completely different port
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --port 8089
```

### **2. Clear All Expo Processes**
**Problem**: Multiple Expo instances running
**Solution**: Clear all processes and start fresh

**Commands:**
```bash
# Stop all Expo processes
npx expo start --clear

# Or kill all Node.js processes
taskkill /IM node.exe /F

# Then start fresh
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --port 8089
```

### **3. Alternative Port Strategy**
**Problem**: Sequential ports are occupied
**Solution**: Use non-sequential ports

**Try these ports:**
- 8089, 8090, 8091, 8092
- 9000, 9001, 9002
- 3000, 3001, 3002

**Command:**
```bash
cd C:\Users\Daniel\swipe\swipe-app
npx expo start --port 9000
```

### **4. Network Configuration**
**Problem**: Local network issues
**Solution**: Check network configuration

**Commands:**
```bash
# Check if ports are accessible
telnet localhost 8081
telnet localhost 8082

# Check network interfaces
ipconfig /all
```

### **5. Expo Configuration Issues**
**Problem**: Expo configuration conflicts
**Solution**: Reset Expo configuration

**Commands:**
```bash
# Clear Expo cache
npx expo start --clear

# Reset Expo configuration
npx expo install --fix

# Check Expo version
npx expo --version
```

## 🎯 **Expected Output When Working**

When the mobile barcode command works, you should see:
```
Starting project at C:\Users\Daniel\swipe\swipe-app
Starting Metro Bundler
Waiting on http://localhost:XXXX
Logs for your project will appear below.

› Metro waiting on exp://192.168.x.x:XXXX
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

## 📱 **Mobile Testing Setup**

### **Prerequisites:**
1. **Install Expo Go** on your mobile device
2. **Ensure same network** - phone and computer on same WiFi
3. **Scan QR code** that appears in terminal
4. **App loads** on mobile device

### **Alternative Testing Methods:**
1. **Web testing**: `http://localhost:8082` (already working)
2. **iOS Simulator**: If you have Xcode installed
3. **Android Emulator**: If you have Android Studio installed

## 🔍 **Diagnostic Commands**

### **Check System Status:**
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Expo CLI version
npx expo --version

# Check if Expo is properly installed
npx expo doctor
```

### **Check Port Usage:**
```bash
# List all listening ports
netstat -ano | findstr LISTENING

# Check specific ports
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083
```

### **Check Process Status:**
```bash
# List all Node.js processes
tasklist | findstr node

# List all Expo processes
tasklist | findstr expo
```

## 🚀 **Recommended Solution**

### **Step 1: Clean Slate Approach**
```bash
# Kill all Node.js processes
taskkill /IM node.exe /F

# Navigate to project
cd C:\Users\Daniel\swipe\swipe-app

# Start with a high port number
npx expo start --port 9000
```

### **Step 2: If Step 1 Fails**
```bash
# Try different port
npx expo start --port 9001

# Or try
npx expo start --port 3000
```

### **Step 3: If Still Failing**
```bash
# Clear Expo cache
npx expo start --clear --port 9000

# Or reset everything
npx expo install --fix
npx expo start --port 9000
```

## 📋 **Success Criteria**

**The command is working when you see:**
- ✅ No port conflict errors
- ✅ QR code displayed in terminal
- ✅ Options to press 'w', 'i', 'a' for different platforms
- ✅ Metro bundler running successfully
- ✅ Development server accessible

## 🎯 **Next Steps**

1. **Try the clean slate approach** with port 9000
2. **If successful**, scan QR code with Expo Go app
3. **If still failing**, check system processes and network configuration
4. **Alternative**: Use web testing at `http://localhost:8082` for now

---

*This troubleshooting guide should resolve the mobile barcode generation issue and allow proper testing of the swipe functionality on mobile devices.*








