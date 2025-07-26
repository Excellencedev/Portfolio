# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Features interactive project showcases, functional contact form, and beautiful UI components.

## Features

- 🎨 **Modern Design** - Glass-morphism effects and smooth animations
- 📱 **Responsive Layout** - Perfect on all devices and screen sizes
- ⚡ **Fast Performance** - Optimized with Vite and modern React patterns
- 🎯 **Interactive Projects** - Live demos of real applications
- 📧 **Functional Contact Form** - EmailJS integration with validation
- 🔧 **Modern Tech Stack** - React 18, TypeScript, Tailwind CSS
- ✨ **UI Components** - Custom component library with shadcn/ui
- 🌙 **Theme Support** - Ready for dark/light mode implementation

## Live Projects

### 1. Task Manager
- Full CRUD operations with local storage
- Drag & drop functionality
- Priority levels and due dates
- Search and filtering capabilities

### 2. Weather App
- Real-time weather data integration
- Location-based forecasts
- Beautiful weather animations
- Responsive design

### 3. Recipe Finder
- Dual search modes (text + ingredients)
- Spoonacular API integration
- Advanced filtering options
- Detailed recipe information

### 4. Expense Tracker
- Personal finance management
- Category-based analytics
- Monthly trends and insights
- Data export/import functionality

## Contact Form

The contact form is fully functional with:
- ✅ **EmailJS Integration** - Real email sending capability
- ✅ **Form Validation** - Client-side validation with error messages
- ✅ **Spam Protection** - Built-in validation and rate limiting
- ✅ **User Feedback** - Success/error notifications
- ✅ **Demo Mode** - Works without API keys for development

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repository-url>
cd portfolio
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and add your API keys:

```env
# Weather App (Optional)
VITE_WEATHER_API_KEY=your_openweathermap_key

# Recipe Finder (Optional)
VITE_SPOONACULAR_API_KEY=your_spoonacular_key

# Contact Form (Required for production)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. EmailJS Setup (Contact Form)
1. Create account at [EmailJS.com](https://www.emailjs.com/)
2. Add email service (Gmail recommended)
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Add to `.env` file

See `EMAILJS_SETUP.md` for detailed instructions.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in project settings
3. Deploy automatically on push

### Netlify
1. Connect GitHub repository
2. Add environment variables in site settings
3. Deploy automatically on push

### Other Platforms
- Ensure environment variables are set
- Build command: `npm run build`
- Output directory: `dist`

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React
- **APIs**: OpenWeatherMap, Spoonacular, EmailJS
- **Storage**: Local Storage for data persistence
- **Deployment**: Vercel/Netlify ready

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── projects/     # Project components
│   │   └── ...           # Other components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── pages/            # Page components
├── public/               # Static assets
└── ...                   # Config files
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - feel free to use this code for your own portfolio!

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
