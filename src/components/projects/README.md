# Portfolio Projects

This folder contains actual working projects that are showcased in the portfolio.

## Task Manager Pro

A fully functional task management application built with React and TypeScript.

### Features

- ✅ Add, edit, and delete tasks
- 🎯 Priority levels (Low, Medium, High)
- 📊 Real-time statistics
- 🔍 Filter tasks (All, Active, Completed)
- 💾 Local storage persistence
- 📱 Responsive design
- ✨ Smooth animations and transitions

### Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Local Storage API

### Live Demo

Visit: `/projects/task-manager`

### Usage

1. Add new tasks using the input field
2. Click the priority badge to cycle through priority levels
3. Use the checkbox to mark tasks as complete
4. Edit tasks by clicking the edit icon
5. Delete tasks using the trash icon
6. Filter tasks using the filter buttons
7. Clear all completed tasks with the "Clear Completed" button

### Future Enhancements

- Drag and drop reordering
- Due dates and reminders
- Categories and tags
- Export/import functionality
- Cloud synchronization
- Collaboration features

## Weather App

A beautiful and functional weather application with real-time data and forecasting.

### Features

- 🌤️ Current weather conditions
- 📍 Location-based weather (geolocation)
- 🔍 City search functionality
- 📊 Detailed weather metrics (humidity, wind, pressure, visibility)
- 📅 5-day weather forecast
- 🎨 Beautiful weather icons
- 📱 Responsive design
- ✨ Smooth animations and transitions
- 🌈 Dynamic background gradients

### Technologies Used

- React 18
- TypeScript
- Weather API integration
- Geolocation API
- Tailwind CSS
- Lucide React Icons

### Live Demo

Visit: `/projects/weather-app`

### Usage

1. Search for any city using the search bar
2. Use "Current Location" to get weather for your location
3. View current conditions with detailed metrics
4. Check the 5-day forecast
5. Enjoy the responsive design on any device

### Future Enhancements

- Real weather API integration (OpenWeatherMap, AccuWeather)
- Hourly forecast
- Weather alerts and notifications
- Multiple location favorites
- Weather maps and radar
- Historical weather data

## Recipe Finder

A comprehensive recipe search and discovery application with advanced filtering capabilities.

### Features

- 🔍 **Advanced Recipe Search** with text queries
- 🥕 **Ingredients-Based Search** - Find recipes using ingredients you have
- 🍽️ **Smart Filtering** by diet, cuisine, meal type, cooking time
- 📊 **Nutritional Information** and health scores
- 💰 **Price Per Serving** calculations
- ⏱️ **Cooking Time** and serving information
- 🏷️ **Recipe Categories** and dietary tags
- 📱 **Responsive Design** with beautiful recipe cards
- 🖼️ **High-Quality Images** from Spoonacular API
- 📋 **Detailed Recipe View** with full information
- ✨ **Loading States** and error handling
- 🎯 **Dual Search Modes** - Text search or ingredients search

### Technologies Used

- React 18
- TypeScript
- Spoonacular Recipe API
- Advanced Search & Filtering
- Tailwind CSS
- Lucide React Icons

### Live Demo

Visit: `/projects/recipe-finder`

### Usage

#### Text Search Mode:
1. **Search Recipes**: Enter dish names, cuisines, or cooking styles
2. **Apply Filters**: Use diet, cuisine, type, time, and health filters
3. **Browse Results**: View recipe cards with key information

#### Ingredients Search Mode:
1. **Add Ingredients**: Enter ingredients you have at home
2. **Build Your List**: Add multiple ingredients (chicken, tomatoes, pasta, etc.)
3. **Find Recipes**: Get recipes that use your available ingredients
4. **Remove Ingredients**: Click X on any ingredient to remove it

#### General:
5. **View Details**: Click any recipe for full details and instructions
6. **Filter Management**: Clear filters or switch search modes
7. **Smart Suggestions**: Get helpful tips for better search results

### API Integration

- **Spoonacular API**: Real recipe data with 150 free requests/day
- **Complex Search**: Advanced filtering and sorting options
- **Recipe Details**: Complete nutritional and cooking information
- **Demo Mode**: Fallback to sample data when API unavailable

### Future Enhancements

- Recipe favorites and collections
- Meal planning and shopping lists
- Nutritional tracking and goals
- Recipe reviews and ratings
- Cooking timer and step-by-step mode
- Ingredient substitution suggestions
- Social sharing and recipe collections

## Expense Tracker

A comprehensive personal finance management application with advanced analytics and insights.

### Features

- 💰 **Transaction Management** - Add, edit, and delete income/expense transactions
- 📊 **Real-time Analytics** - Live calculations of income, expenses, and net amount
- 🏷️ **Category Tracking** - Predefined categories for expenses and income
- 📈 **Monthly Trends** - Track financial patterns over time
- 🔍 **Advanced Filtering** - Filter by type, month, and category
- 📱 **Responsive Design** - Works perfectly on all devices
- 💾 **Data Persistence** - Local storage with export/import functionality
- 📋 **Category Breakdown** - Visual percentage breakdown of expense categories
- 📅 **Date Management** - Flexible date selection and monthly filtering
- ✨ **Modern UI** - Clean, intuitive interface with smooth animations

### Technologies Used

- React 18
- TypeScript
- Local Storage API
- Data Analytics & Visualization
- Tailwind CSS
- Lucide React Icons

### Live Demo

Visit: `/projects/expense-tracker`

### Usage

#### Adding Transactions:
1. **Click "Add Transaction"** to open the form
2. **Select Type**: Choose income or expense
3. **Enter Details**: Amount, category, description, and date
4. **Save**: Transaction appears in the list immediately

#### Analytics & Insights:
1. **Summary Cards**: View total income, expenses, net amount, and transaction count
2. **Category Breakdown**: See which categories consume most of your budget
3. **Monthly Trends**: Track your financial patterns over the last 6 months
4. **Filtering**: Filter by transaction type or specific month

#### Data Management:
1. **Export Data**: Download your transactions as JSON file
2. **Import Data**: Upload previously exported data
3. **Edit Transactions**: Click edit icon to modify any transaction
4. **Delete Transactions**: Remove unwanted transactions

### Key Features

#### Smart Categories
- **Expense Categories**: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel
- **Income Categories**: Salary, Freelance, Business, Investments, Gifts
- **Dynamic Forms**: Category options change based on transaction type

#### Visual Analytics
- **Progress Bars**: Visual representation of category spending
- **Color Coding**: Green for income, red for expenses, contextual colors for net amounts
- **Percentage Breakdown**: See what percentage each category represents
- **Monthly Comparison**: Compare income vs expenses across months

#### Data Persistence
- **Local Storage**: All data saved automatically in browser
- **Export/Import**: JSON format for data portability
- **Real-time Updates**: All calculations update instantly
- **Data Validation**: Ensures data integrity and prevents errors

### Future Enhancements

- Budget setting and tracking
- Recurring transaction templates
- Advanced charts and graphs
- Receipt photo attachments
- Multi-currency support
- Cloud synchronization
- Financial goal tracking
- Spending alerts and notifications

## Adding New Projects

To add a new project:

1. Create a new component in this folder
2. Add the route in `App.tsx`
3. Update the project data in `Projects.tsx`
4. Add project images to the assets folder
5. Update this README with project details
