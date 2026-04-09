# Translation API - Replit Project

## Overview

This is a Flask-based web application that provides a translation API service using Google Translate. The application allows users to translate text from any language to English through both a web interface and REST API endpoints. It features a modern, responsive frontend with Bootstrap styling and provides both interactive testing capabilities and programmatic access.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla JavaScript with Bootstrap 5 (Dark Theme)
- **Structure**: Single-page application with HTML templates rendered by Flask
- **Styling**: Custom CSS with Bootstrap framework and Font Awesome icons
- **Interactivity**: Real-time character counting, form validation, and AJAX requests

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **API Design**: RESTful endpoints with JSON responses
- **Translation Service**: Google Translate API via `googletrans` library
- **Error Handling**: Comprehensive error responses with status codes
- **CORS**: Enabled for cross-origin requests

### Server Configuration
- **Host**: 0.0.0.0 (accessible from all interfaces)
- **Port**: 5000
- **Environment**: Development mode with debug enabled
- **Session Management**: Secret key configuration for session security

## Key Components

### Core Application Files
- `app.py`: Main Flask application with route definitions and translation logic
- `main.py`: Application entry point with server configuration
- `templates/index.html`: Frontend HTML template with API documentation and test interface
- `static/css/styles.css`: Custom styling for the application
- `static/js/app.js`: Client-side JavaScript for form handling and API communication

### API Endpoints
- `GET /`: Renders the main page with API documentation and test interface
- `POST /api/translate`: Accepts text input and returns English translation with metadata

### Translation Features
- **Input Validation**: Text length limits (5000 characters) and empty input checks
- **Format Support**: Accepts both JSON and form data submissions
- **Response Format**: JSON with success status, translated text, and error handling
- **Character Counting**: Real-time character count display with validation

## Data Flow

1. **User Input**: Text entered through web interface or API call
2. **Validation**: Input validated for length and presence
3. **Translation**: Text sent to Google Translate service
4. **Response**: Translated text returned with metadata
5. **Display**: Results shown in web interface or JSON response

### Request Flow
```
Client → Flask Route → Input Validation → Google Translate → Response Formation → Client
```

## External Dependencies

### Python Libraries
- `flask`: Web framework for routing and request handling
- `flask-cors`: Cross-origin resource sharing support
- `googletrans`: Google Translate API client library
- Standard library modules: `os`, `logging`, `json`

### Frontend Dependencies
- **Bootstrap 5**: UI framework with dark theme
- **Font Awesome 6**: Icon library for UI elements
- **Replit Bootstrap Theme**: Custom dark theme for Replit environment

### Translation Service
- **Google Translate**: Free translation service with automatic language detection
- **Rate Limits**: Subject to Google's usage policies and limitations

## Deployment Strategy

### Development Environment
- **Local Development**: Flask development server with debug mode
- **Hot Reload**: Automatic server restart on file changes
- **Error Debugging**: Detailed error messages in development mode

### Production Considerations
- **Secret Key**: Environment variable configuration for session security
- **CORS Policy**: Currently allows all domains (should be restricted in production)
- **Error Handling**: Comprehensive error responses for API reliability
- **Logging**: Debug-level logging configured for troubleshooting

### Replit Deployment
- **Entry Point**: `main.py` for Replit's Python runner
- **Static Files**: CSS and JavaScript served through Flask's static file handling
- **Template Rendering**: Jinja2 templates for dynamic content generation

## Recent Changes

```
Recent Changes:
- July 02, 2025: Updated proxy behavior to always-on when configured
  - Changed proxy from fallback to primary when TRANSLATION_PROXY_URL is set
  - All translation requests now use proxy consistently when configured
  - Updated documentation to reflect always-on proxy behavior
  - Improved corporate network compatibility

- July 02, 2025: Added speed optimizations and proxy support
  - Implemented performance monitoring with processing time tracking
  - Added proxy mechanism for reliable service
  - Enhanced error handling with detailed timing information
  - Added /api/status endpoint for configuration monitoring
  - Updated frontend to display performance metrics and proxy status
  - Improved caching with @lru_cache for translator instances
```

## Changelog

```
Changelog:
- July 02, 2025. Initial setup with translation API
- July 02, 2025. Added performance optimizations and proxy support
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Security Considerations
- Session secret key should be set via environment variable in production
- CORS configuration should be restricted to specific domains
- Input validation prevents common injection attacks

### Performance Considerations
- Google Translate API has rate limits and usage quotas
- Character limit of 5000 prevents excessive API usage
- Client-side validation reduces unnecessary server requests

### Extensibility
- Modular Flask structure allows easy addition of new endpoints
- Translation service can be swapped for alternative providers
- Frontend can be extended with additional languages and features