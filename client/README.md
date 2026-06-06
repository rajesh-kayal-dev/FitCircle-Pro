# FitCircle Pro - Premium Fitness SaaS Platform

A modern, minimalist SaaS fitness platform with a premium Blue and Steel Metallic design aesthetic, featuring real Indian fitness content and intelligently integrated AI features.

## 🎨 Design Principles

- **Clean & Premium**: Inspired by Notion and Stripe's card-based layouts
- **Blue & Steel Metallic**: Professional color palette
- **Light Mode Only**: Focused, distraction-free experience
- **Responsive**: Desktop sidebar, mobile bottom navigation

## 🚀 Key Features

### 1. Social Feed
- Real content from Indian fitness creators (Sachin Gokhale, Radhika Bose, Guru Mann, etc.)
- Video posts with play/pause controls
- Share functionality (Copy link, WhatsApp, Instagram)
- Like, comment, and bookmark features
- Stories/Spotlight section
- Interactive engagement metrics

### 2. Workout Library
- **Categories**: Strength, Hypertrophy, Cardio, Recovery
- Video thumbnails with play indicators
- Trainer information with verified badges
- Difficulty levels (Beginner, Intermediate, Advanced)
- Duration and calorie estimates
- Real Indian fitness trainers

### 3. Profile & Progress
- Cover image with avatar
- **Stats Dashboard**: Workouts, Streak, Hours, Calories
- **Tabs**:
  - Overview: Weekly progress, monthly goals
  - History: Complete workout history
  - Badges: Achievement system with progress tracking
- Recent activity feed

### 4. Smart Search (AI-Powered)
- Unified search for exercises, trainers, workouts, and food
- **Food Image Recognition**: Upload food photos for instant nutritional data
- Category filters (All, Exercises, Trainers, Food)
- Trending searches
- Structured results with nutritional information
- AI runs invisibly - no separate AI module

### 5. Diet Planner
- **Goal Selection**: Fat Loss, Muscle Gain, Maintenance
- **Activity Levels**: Sedentary to Very Active
- **Diet Preferences**: Vegetarian, Non-Vegetarian, Vegan
- Personalized meal plans:
  - Breakfast (7:00-9:00 AM)
  - Lunch (12:00-2:00 PM)
  - Snacks (4:00-5:00 PM)
  - Dinner (7:00-9:00 PM)
- Complete nutritional breakdown
- Indian cuisine focus

## 🎯 Core Principle: Invisible AI

AI is **NOT** a separate module. Instead:
- AI powers food recognition in Search (scan food images)
- AI generates personalized meal plans in Diet Planner
- AI suggests workouts based on goals (integrated into workout selection)
- The UI feels natural, not "AI-heavy"

## 🧩 Component Architecture

### Reusable Components
- `WorkoutCard`: Displays workout info with trainer, difficulty, duration
- `FoodCard`: Shows food with nutritional breakdown (calories, protein, carbs, fat)
- `VideoPlayer`: Video playback with controls (play/pause, mute, fullscreen)
- `Avatar`: User/trainer profile images
- `Card`, `Button`, `Input`: Design system components

### Layout
- `AppLayout`: Main app shell with sidebar and header
- Left sidebar navigation (desktop)
- Bottom navigation bar (mobile)
- Right panel for suggestions (desktop only)

## 📱 Responsive Design

- **Desktop**: Full sidebar + main content + right panel
- **Tablet**: Collapsible sidebar + main content
- **Mobile**: Bottom navigation + full-width content

## 🔐 Authentication

- Mock authentication for demo
- Protected routes (redirects to login if not authenticated)
- Token-based session management

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **React Router 7** - Routing (Data mode pattern)
- **Tailwind CSS v4** - Styling
- **Motion/React** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Radix UI** - Accessible components
- **Vite** - Build tool

## 🎨 Color Palette

```css
Primary Blue: #3b82f6
Secondary Steel: #64748b
Background: #f8fafc
Card: #ffffff
Accent: #dbeafe
```

## 📂 Project Structure

```
/src
  /app
    /components
      /ui - Design system components
      /shared - Reusable components (VideoPlayer, WorkoutCard, FoodCard)
      /layout - AppLayout
      /admin - Admin components
      /branding - Logo
  /pages
    /app - Main app pages (Feed, Workouts, Profile, Search, DietPlanner)
    /auth - Intro/Login
    /admin - Admin panel
  /context - React contexts (Auth, AI)
  /styles - Global styles and theme
```

## 🌟 Indian Fitness Content

Real-world content featuring:
- Sachin Gokhale (Fitness Coach)
- Radhika Bose (Yoga Expert)
- Guru Mann (Fitness Icon)
- Yash Anand (Pro Athlete)
- Virat Kohli (Cricket & Fitness)
- Abhinav Mahajan (Athlete)
- Rohit Khatri (Trainer)
- Manoj Smesh (Coach)

## 🎬 Video Features

- Play/Pause controls
- Mute/Unmute
- Fullscreen support
- Video thumbnails with overlays
- Smooth transitions and animations

## 📊 Nutrition Tracking

- Calories
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Portion sizes
- Food tags (Vegetarian, High Protein, Low Carb, etc.)

## 🏆 Gamification

- Workout streak tracking
- Achievement badges
- Progress bars
- Weekly/monthly goals
- Verified creator badges

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## 📝 Notes

- No TypeScript in pages - using .jsx for simplicity
- No Next.js - using Vite + React
- Light mode only - focused user experience
- Mock data for demo purposes
- Real Unsplash images for authenticity

---

Built with ❤️ for the Indian fitness community
