import os
import logging
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from googletrans import Translator
import json
from functools import lru_cache
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Enable CORS for all domains
CORS(app)

# Configuration for proxy support
PROXY_URL = os.environ.get("http://wpMGv1CzNFU3ji6:eHIM4IiDBDgQTX2@92.113.81.151:48397", None)  # Optional proxy for metadata reserve

# Initialize Google Translator with proxy support
def get_translator():
    """Get translator instance with proxy configuration if available."""
    if PROXY_URL:
        app.logger.info(f"Configuring translator with proxy: {PROXY_URL}")
        # Set environment variables for proxy usage - this affects all HTTP requests
        os.environ['HTTP_PROXY'] = PROXY_URL
        os.environ['HTTPS_PROXY'] = PROXY_URL
        os.environ['http_proxy'] = PROXY_URL  # lowercase variants for compatibility
        os.environ['https_proxy'] = PROXY_URL
        app.logger.info("Proxy environment variables set - all translations will use proxy")
    else:
        app.logger.info("No proxy configured - using direct connection")
        # Clear any existing proxy environment variables
        for env_var in ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']:
            if env_var in os.environ:
                del os.environ[env_var]
    
    return Translator()

# Cache translator instance for performance
@lru_cache(maxsize=1)
def get_cached_translator():
    """Get cached translator instance for better performance."""
    try:
        return get_translator()
    except Exception as e:
        app.logger.error(f"Failed to initialize translator: {str(e)}")
        # Fallback to basic translator
        return Translator()

translator = get_cached_translator()

@app.route('/')
def index():
    """Render the main page with API documentation and test interface."""
    return render_template('index.html')

@app.route('/api/translate', methods=['POST'])
def translate_text():
    """
    Translate text from any language to English.
    
    Accepts JSON payload or form data with 'text' field.
    Returns JSON response with translated text and metadata.
    """
    start_time = time.time()
    
    try:
        # Get text from request (support both JSON and form data)
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '').strip()
        else:
            text = request.form.get('text', '').strip()
        
        # Validate input
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided',
                'message': 'Please provide text to translate'
            }), 400
        
        # Check text length (Google Translate has limits)
        if len(text) > 5000:
            return jsonify({
                'success': False,
                'error': 'Text too long',
                'message': 'Text must be less than 5000 characters'
            }), 400
        
        # Perform translation with proxy priority
        app.logger.info(f"Translating text: {text[:100]}...")
        
        # Use translator (which will use proxy if configured)
        result = translator.translate(text, dest='en')
        
        # Calculate processing time for performance monitoring
        processing_time = round((time.time() - start_time) * 1000, 2)  # in milliseconds
        
        # Prepare response with performance metadata
        response_data = {
            'success': True,
            'original_text': text,
            'translated_text': result.text,
            'source_language': result.src,
            'target_language': 'en',
            'confidence': getattr(result, 'confidence', None),
            'processing_time_ms': processing_time,
            'proxy_used': PROXY_URL is not None
        }
        
        app.logger.info(f"Translation successful: {result.src} -> en (took {processing_time}ms)")
        return jsonify(response_data), 200
        
    except Exception as e:
        processing_time = round((time.time() - start_time) * 1000, 2)
        app.logger.error(f"Translation error after {processing_time}ms: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Translation failed',
            'message': f'An error occurred during translation: {str(e)}',
            'processing_time_ms': processing_time
        }), 500

@app.route('/api/detect', methods=['POST'])
def detect_language():
    """
    Detect the language of the provided text.
    
    Accepts JSON payload or form data with 'text' field.
    Returns JSON response with detected language information.
    """
    start_time = time.time()
    
    try:
        # Get text from request
        if request.is_json:
            data = request.get_json()
            text = data.get('text', '').strip()
        else:
            text = request.form.get('text', '').strip()
        
        # Validate input
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided',
                'message': 'Please provide text to detect language'
            }), 400
        
        # Detect language with proxy priority
        app.logger.info(f"Detecting language for text: {text[:100]}...")
        
        # Use translator (which will use proxy if configured)
        result = translator.detect(text)
        
        # Calculate processing time
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        # Prepare response with performance metadata
        response_data = {
            'success': True,
            'text': text,
            'language_code': result.lang,
            'confidence': result.confidence,
            'processing_time_ms': processing_time,
            'proxy_used': PROXY_URL is not None
        }
        
        app.logger.info(f"Language detection successful: {result.lang} (took {processing_time}ms)")
        return jsonify(response_data), 200
        
    except Exception as e:
        processing_time = round((time.time() - start_time) * 1000, 2)
        app.logger.error(f"Language detection error after {processing_time}ms: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Detection failed',
            'message': f'An error occurred during language detection: {str(e)}',
            'processing_time_ms': processing_time
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint with performance information."""
    start_time = time.time()
    
    # Test translator initialization
    try:
        test_translator = get_cached_translator()
        translator_status = 'operational'
    except Exception as e:
        translator_status = f'error: {str(e)}'
    
    processing_time = round((time.time() - start_time) * 1000, 2)
    
    return jsonify({
        'success': True,
        'status': 'healthy',
        'message': 'Translation API is running',
        'translator_status': translator_status,
        'proxy_configured': PROXY_URL is not None,
        'proxy_url': PROXY_URL if PROXY_URL else 'None',
        'health_check_time_ms': processing_time
    }), 200

@app.route('/api/status', methods=['GET'])
def api_status():
    """Get API status and configuration information."""
    return jsonify({
        'success': True,
        'api_version': '1.1',
        'features': {
            'translation': True,
            'language_detection': True,
            'proxy_support': True,
            'performance_monitoring': True
        },
        'limits': {
            'max_text_length': 5000,
            'supported_languages': 'all_google_translate_supported'
        },
        'configuration': {
            'proxy_enabled': PROXY_URL is not None,
            'caching_enabled': True
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        'success': False,
        'error': 'Method not allowed',
        'message': 'The requested method is not allowed for this endpoint'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    app.logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
