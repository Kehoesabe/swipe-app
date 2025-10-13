# 🚀 START HERE — Swipe App Development

**Quick start guide for beginning your work session in Cursor**

---

## ⚡ QUICK START (Every Session)

### Step 1: Open Project in Cursor
```bash
# Navigate to project
cd swipe-app

# Open in Cursor
cursor .
```

### Step 2: Check Status
**In Cursor's terminal (Ctrl + `):**
```bash
# Pull latest changes
git pull

# Check current branch
git branch

# Install any new dependencies
npm install

# Start dev server
npm start
```

### Step 3: Review Your Work
- Check `SESSION_SUMMARY.md` from last session
- Review `PROJECT_BRIEF.md` for current sprint goals
- Open `QUICK_REFERENCE.md` for common patterns

---

## 📊 CURRENT PROJECT STATUS

### App Status
```
Platform:         iOS / Android / Web
Expo SDK:         54
React Native:     0.81
TypeScript:       Strict Mode ✅
Tests:            [Update after running]
Build Status:     [Clean/Errors]
```

### Current Sprint
**Focus:** [Update with current feature/sprint]  
**Due Date:** [Update]  
**Progress:** [X]% complete

### Active Branches
```bash
# See all branches
git branch -a

# Current branch
git branch --show-current
```

---

## 🎯 TODAY'S WORK

### High Priority
1. [ ] [Task 1 - Update this each session]
2. [ ] [Task 2]
3. [ ] [Task 3]

### In Progress
- [ ] [Feature/bug you're working on]
- [ ] [Another item]

### Blocked/Waiting
- [ ] [Item waiting on something]

---

## 📋 QUICK COMMANDS

### Development
```bash
# Start Expo dev server
npm start

# Run on specific platform
npm run android    # Android emulator
npm run ios       # iOS simulator
npm run web       # Web browser

# Clear cache if needed
npm start -- --clear
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- UserProfile.test.tsx

# Check coverage
npm test -- --coverage
```

### Code Quality
```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Fix lint errors
npm run lint -- --fix

# Format code (if you have prettier)
npm run format
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feat/your-feature

# Check status
git status

# Stage changes
git add .

# Commit (use conventional commits)
git commit -m "feat: your feature description"

# Push branch
git push -u origin feat/your-feature
```

---

## 🤖 USING CURSOR AI

### Start Development with AI
**Open Cursor chat (Ctrl + L) and say:**

```
I'm working on [feature name]. 
Following .cursorrules and ARCHITECTURE.md, 
help me implement [specific task].
```

### Common AI Prompts
```
"Create a new screen component called [Name] following our patterns"

"Add tests for [Component] following TESTING.md"

"Fix this TypeScript error: [paste error]"

"Refactor this code to use our constants from @/constants"

"Generate a service for [API endpoint] following our patterns"
```

### Let Cursor Help With:
- ✅ Creating new components
- ✅ Writing tests
- ✅ Fixing TypeScript errors
- ✅ Refactoring code
- ✅ Generating boilerplate

---

## 📚 KEY DOCUMENTATION

**Quick Reference:**
- `QUICK_REFERENCE.md` - Daily patterns and commands
- `.cursorrules` - AI assistant patterns (auto-loaded by Cursor)
- `AGENTS.md` - Common AI mistakes to avoid

**Architecture:**
- `ARCHITECTURE.md` - Technical decisions and patterns
- `PROJECT_BRIEF.md` - Project goals and roadmap

**Workflows:**
- `CONTRIBUTING.md` - Git workflow and PR process
- `TESTING.md` - Testing strategies
- `PR_CREATION_CHECKLIST.md` - PR creation guide

**Operations:**
- `DEPLOYMENT.md` - Deployment procedures
- `SECURITY.md` - Security best practices

---

## 🔍 TROUBLESHOOTING

### App Won't Start
```bash
# Clear cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules
npm install

# Check for errors
npm run type-check
npm run lint
```

### Tests Failing
```bash
# Run specific failing test
npm test -- FailingTest.test.tsx

# Update snapshots if needed
npm test -- -u

# Check test output carefully
```

### TypeScript Errors
```bash
# Run type check
npm run type-check

# Ask Cursor AI to help fix
# Open chat (Ctrl + L) and paste the error
```

### Git Issues
```bash
# See what's changed
git status
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all changes (careful!)
git reset --hard HEAD
```

---

## ✅ END OF SESSION CHECKLIST

Before ending your session:

- [ ] **Update SESSION_SUMMARY.md** with what you did
- [ ] **Commit your work** with proper commit messages
- [ ] **Push branches** if ready for review
- [ ] **Run tests** to ensure nothing broke
- [ ] **Update this file** with tomorrow's priorities
- [ ] **Note any blockers** in SESSION_SUMMARY.md

---

## 🎯 NEXT SESSION PREP

**When you return:**
1. Read last `SESSION_SUMMARY.md`
2. Check any PRs for comments
3. Review "Today's Work" section above
4. Update priorities if needed
5. Start coding!

---

## 📱 PLATFORM-SPECIFIC NOTES

### iOS Development
```bash
# Requires macOS
npm run ios

# Or use Expo Go app on iPhone
# Scan QR code from npm start
```

### Android Development
```bash
# Requires Android Studio
npm run android

# Or use Expo Go app on Android
# Scan QR code from npm start
```

### Web Development
```bash
# Works on any OS
npm run web

# Opens in browser automatically
```

---

## 🆘 NEED HELP?

**Documentation:**
1. Check `QUICK_REFERENCE.md` first
2. Search relevant guides (ARCHITECTURE, TESTING, etc.)
3. Ask Cursor AI with context

**Cursor AI:**
```
Open chat (Ctrl + L) and provide context:
"According to our ARCHITECTURE.md, how should I [task]?"
```

**Issues:**
- Check GitHub issues
- Search closed PRs for similar problems
- Create new issue if needed

---

## 🎊 YOU'RE READY!

**Everything you need is set up:**
- ✅ Rock-solid foundation with 14 documentation files
- ✅ AI-ready with .cursorrules
- ✅ Type-safe TypeScript setup
- ✅ Complete testing infrastructure
- ✅ Clear workflow and patterns

**Just run `npm start` and start building!** 🚀

---

## 📝 SESSION NOTES

**Current Session:** [Date]  
**Working On:** [Feature/Task]  
**Status:** [Just Started / In Progress / Almost Done]

**Quick Notes:**
- [Note 1]
- [Note 2]
- [Reminder]

---

**Last Updated:** [Date]  
**Current Sprint:** [Sprint name/number]  
**Team Status:** [Your status]








