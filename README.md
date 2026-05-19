# Daily Fitness Tracker
**Written by Brian McCarthy**

A mobile-friendly web application designed to track daily physical activity and calculate calories burned based on user-specific metrics.

## Languages and Technologies
- **TypeScript & React**: Primary web application stack.
- **Java**: Native Android source code implementation.
- **Kotlin**: Modern Native Android source code implementation.
- **Tailwind CSS**: For high-performance, utility-first styling.
- **Motion (Framer Motion)**: For smooth, mobile-native screen transitions and animations.
- **Lucide React**: For modern, consistent iconography.

## App Functions
1. **Activity Progress Rings**: High-fidelity visual feedback inspired by modern health apps.
   - **Move (Red Ring)**: Tracks active minutes towards your daily goal.
   - **Exercise (Green Ring)**: Tracks intense activity/weight lifting minutes.
   - **Stand (Cyan Ring)**: Monitors standing hours to combat sedentary behavior.
2. **Comprehensive Metric Logging**:
   - **Steps & Stairs**: Traditional activity tracking.
   - **Sleep Tracking**: Monitors rest duration.
   - **Food Intake**: Direct integration of total calorie intake to calculate **Net Calories**.
3. **Daily History**: Persistent storage using local memory. View, track, and manage your fitness journey over time in the History tab.
4. **Intelligent Calculations**: Metabolic Equivalent (MET) based calorie burning logic adjusted for age and weight.
5. **Dynamic UI**: 
   - Real-time centered Clock and Date.
   - Themed Android mascot and fitness graphics.
   - Smooth navigation between Activity, Analysis, and History screens.

## How to Use the App
1. **Daily Dashboard**: On the primary screen, enter your Move minutes, Exercise minutes, and Stand hours to see the **Rings** fill up.
2. **Detailed Logging**: Input your total steps, flight of stairs, and sleep hours.
3. **Food Tracking**: Enter your total calorie intake for the day in the prominent Food Intake field.
4. **Analysis**: Click the arrow to proceed to the Calculation screen. Enter your weight and age to generate your final calorie burn and net balance.
5. **Persistent History**: Use "Log Day" to save your results. Click the history icon (top right) at any time to review your progress.

## Native Mobile Development
This project provides both a high-fidelity **PWA (Progressive Web App)** and **Native Android Source Code**. 

**Note on APK/IPA files:** As an AI assistant, I generate source code and web environments. I cannot provide compiled binary files (like `.apk` or `.ipa`) directly for download. However, you can use the provided source code to build them yourself.

### Android Native Source (Java & Kotlin)
Located in the `/mobile` directory:
- **Java**: `/mobile/java/`
- **Kotlin**: `/mobile/kotlin/`

To build your own APK:
1. Open **Android Studio**.
2. Create a new "Empty Activity" project.
3. Replace the system-generated files with the provided Java or Kotlin source code.
4. Build and Run on your device or emulator.

### iOS Development
The calculation logic in `CaloriesActivity` can be directly ported to **Swift** for iOS. Use the same MET values used in `calculateCalories()` to ensure consistency across platforms.

## Mobile Installation (PWA)
The easiest way to use this as an app is the "Add to Home Screen" feature:

### For Android (Chrome)
1. Open the **App URL** in Chrome.
2. Tap the **Menu icon** (three dots) in the top right.
3. Tap **Install app** (or "Add to Home screen").
4. The Fitness Tracker will now appear in your app drawer and on your home screen.

### For iPhone/iOS (Safari)
1. Open the **App URL** in Safari.
2. Tap the **Share button** (square with an upward arrow) at the bottom.
3. Scroll down and tap **Add to Home Screen**.
4. Confirm the name and tap **Add**.
5. The Fitness Tracker will now appear on your home screen just like a native app.
