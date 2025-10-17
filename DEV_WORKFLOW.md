# Development Workflow

## 🚀 Quick Start Commands

### Preflight Check (Optional)
```bash
npm run predev
```
Checks if Metro is reachable before starting development.

### Start Development Server
```bash
# Clear cache and start with tunnel (recommended)
npm run dev:clear

# Start with tunnel (no cache clear)
npm run dev:tunnel

# Start with LAN (for local network access)
npm run dev:lan
```

## 🔧 Troubleshooting

### If Metro isn't reachable:
1. **Kill existing processes**: `taskkill /IM node.exe /F 2>NUL`
2. **Clear cache**: `npm run dev:clear`
3. **Check firewall**: Allow Node.js on Private networks

### Mobile Testing:
- **Don't use localhost** on your phone
- **Use the tunnel URL** from terminal output
- **Or use LAN**: `exp://<your-IPv4>:9000` in Expo Go

### Fast Refresh Issues:
- Keep Fast Refresh ON
- Use "Reload" from dev menu after major changes
- Clear cache with `--clear` flag if updates don't appear

## 📱 Testing URLs

When Metro starts, look for:
```
› Metro waiting on http://localhost:9000
```

**For mobile**: Use the tunnel URL or `exp://<IPv4>:9000`
**For web**: Use `http://localhost:9000`






