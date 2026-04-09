document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('translationForm');
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const translateBtn = document.getElementById('translateBtn');
    const detectBtn = document.getElementById('detectBtn');
    const resultsCard = document.getElementById('resultsCard');
    const translationResults = document.getElementById('translationResults');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    // Character counter
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 5000) {
            charCount.classList.add('text-danger');
            translateBtn.disabled = true;
            detectBtn.disabled = true;
        } else {
            charCount.classList.remove('text-danger');
            translateBtn.disabled = false;
            detectBtn.disabled = false;
        }
    });

    // Translation form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        translateText();
    });

    // Detect language button
    detectBtn.addEventListener('click', function() {
        detectLanguage();
    });

    function translateText() {
        const text = inputText.value.trim();
        
        if (!text) {
            showError('Please enter some text to translate.');
            return;
        }

        // Show loading state
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Translating...';
        translateBtn.disabled = true;
        hideError();
        hideResults();

        // Make API request
        fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showTranslationResults(data);
            } else {
                showError(data.message || 'Translation failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Network error occurred. Please try again.');
        })
        .finally(() => {
            // Reset button state
            translateBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Translate to English';
            translateBtn.disabled = false;
        });
    }

    function detectLanguage() {
        const text = inputText.value.trim();
        
        if (!text) {
            showError('Please enter some text to detect language.');
            return;
        }

        // Show loading state
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Detecting...';
        detectBtn.disabled = true;
        hideError();

        // Make API request
        fetch('/api/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showDetectionResults(data);
            } else {
                showError(data.message || 'Language detection failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Network error occurred. Please try again.');
        })
        .finally(() => {
            // Reset button state
            detectBtn.innerHTML = '<i class="fas fa-search me-2"></i>Detect Language';
            detectBtn.disabled = false;
        });
    }

    function showTranslationResults(data) {
        const proxyIndicator = data.proxy_used ? 
            '<span class="badge bg-info ms-2"><i class="fas fa-shield-alt me-1"></i>Proxy</span>' : '';
        
        const html = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="fw-bold text-muted">Original Text</h6>
                    <p class="border p-3 rounded bg-dark">${escapeHtml(data.original_text)}</p>
                    <small class="text-muted">
                        <i class="fas fa-flag me-1"></i>
                        Language: ${data.source_language.toUpperCase()}
                    </small>
                </div>
                <div class="col-md-6">
                    <h6 class="fw-bold text-success">Translated Text</h6>
                    <p class="border p-3 rounded bg-success bg-opacity-10">${escapeHtml(data.translated_text)}</p>
                    <small class="text-muted">
                        <i class="fas fa-flag me-1"></i>
                        Language: EN
                        ${data.confidence ? `| Confidence: ${Math.round(data.confidence * 100)}%` : ''}
                    </small>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <button class="btn btn-sm btn-outline-secondary" onclick="copyToClipboard('${escapeHtml(data.translated_text)}')">
                        <i class="fas fa-copy me-2"></i>
                        Copy Translation
                    </button>
                </div>
                <div class="col-md-6 text-end">
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        Processed in ${data.processing_time_ms}ms
                        ${proxyIndicator}
                    </small>
                </div>
            </div>
        `;
        
        translationResults.innerHTML = html;
        resultsCard.style.display = 'block';
        
        // Scroll to results
        resultsCard.scrollIntoView({ behavior: 'smooth' });
    }

    function showDetectionResults(data) {
        const proxyIndicator = data.proxy_used ? 
            '<span class="badge bg-info ms-2"><i class="fas fa-shield-alt me-1"></i>Proxy</span>' : '';
        
        const html = `
            <div class="alert alert-info">
                <h6 class="fw-bold">
                    <i class="fas fa-info-circle me-2"></i>
                    Language Detection Result
                    ${proxyIndicator}
                </h6>
                <p class="mb-2">
                    <strong>Detected Language:</strong> ${data.language_code.toUpperCase()}
                </p>
                <p class="mb-2">
                    <strong>Confidence:</strong> ${Math.round(data.confidence * 100)}%
                </p>
                <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>
                    Processed in ${data.processing_time_ms}ms
                </small>
            </div>
        `;
        
        translationResults.innerHTML = html;
        resultsCard.style.display = 'block';
        
        // Scroll to results
        resultsCard.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.style.display = 'block';
        
        // Scroll to error
        errorAlert.scrollIntoView({ behavior: 'smooth' });
    }

    function hideError() {
        errorAlert.style.display = 'none';
    }

    function hideResults() {
        resultsCard.style.display = 'none';
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Global function for copying text to clipboard
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success feedback
            const button = event.target.closest('button');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            button.classList.add('btn-success');
            button.classList.remove('btn-outline-secondary');
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
            showError('Failed to copy text to clipboard');
        });
    };
});
