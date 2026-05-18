/**
 * Form Validation for TrackFlow Contact Form
 * Handles client-side validation with accessibility and error messaging.
 */

class FormValidator {
  constructor(formId = 'contacto-form') {
    this.form = document.getElementById(formId);
    this.successMessage = document.getElementById('form-success');
    this.errors = {};

    if (!this.form) {
      console.warn(`Form with id "${formId}" not found.`);
      return;
    }

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation and character counter
    const countableFields = ['comentarios'];
    const validableFields = [
      'empresa',
      'contacto',
      'email',
      'telefono',
      'sitio',
      'pais',
      'producto',
      'volumen',
      'servicios',
      'otro3pl',
      'comentarios',
      'privacidad'
    ];

    validableFields.forEach((fieldName) => {
      const field = this.form.elements[fieldName];
      if (field) {
        if (fieldName === 'comentarios') {
          field.addEventListener('input', () => this.updateCharacterCount(fieldName));
          field.addEventListener('blur', () => this.validateField(fieldName));
        } else if (fieldName === 'volumen') {
          field.addEventListener('change', () => {
            this.validateField(fieldName);
            this.checkVolumeWarning(fieldName);
          });
        } else {
          field.addEventListener('blur', () => this.validateField(fieldName));
        }
      }
    });
  }

  updateCharacterCount(fieldName) {
    const field = this.form.elements[fieldName];
    const countElement = document.getElementById(`${fieldName}-count`);
    if (countElement) {
      countElement.textContent = field.value.length;
    }
  }

  checkVolumeWarning(fieldName) {
    const field = this.form.elements[fieldName];
    const warningElement = document.getElementById('warning-volumen');
    if (field.value === '0-100' && warningElement) {
      warningElement.classList.remove('hidden');
    } else if (warningElement) {
      warningElement.classList.add('hidden');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.errors = {};

    // Validate all fields
    this.validateField('empresa');
    this.validateField('contacto');
    this.validateField('email');
    this.validateField('telefono');
    this.validateField('sitio');
    this.validateField('pais');
    this.validateField('producto');
    this.validateField('volumen');
    this.validateField('servicios');
    this.validateField('otro3pl');
    this.validateField('comentarios');
    this.validateField('privacidad');

    // Check if there are any errors
    if (Object.keys(this.errors).length === 0) {
      this.showSuccess();
      // Optionally reset form and scroll to success message
      this.form.reset();
      this.successMessage.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Focus on first error field
      const firstErrorField = this.form.elements[Object.keys(this.errors)[0]];
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  validateField(fieldName) {
    const field = this.form.elements[fieldName];
    if (!field) return true;

    const errorElement = document.getElementById(`error-${fieldName}`);
    let isValid = true;
    let value = fieldName === 'privacidad' ? field.checked : field.value.trim();

    switch (fieldName) {
      case 'empresa':
        isValid = value.length >= 2;
        break;

      case 'contacto':
        // At least two words (name and surname)
        isValid = value.split(/\s+/).length >= 2 && value.length > 0;
        break;

      case 'email':
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        break;

      case 'telefono':
        // Must start with + followed by country code and at least 9 digits total
        const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
        isValid = phoneRegex.test(value.replace(/[\s\-()]/g, ''));
        break;

      case 'sitio':
        // If provided, must start with http:// or https://
        if (value.length > 0) {
          isValid = value.startsWith('http://') || value.startsWith('https://');
        }
        break;

      case 'pais':
        isValid = value.length > 0;
        break;

      case 'producto':
        isValid = value.length > 0;
        break;

      case 'volumen':
        isValid = value.length > 0;
        break;

      case 'servicios':
        isValid = value.length > 0;
        break;

      case 'otro3pl':
        // Check if any radio is selected
        isValid = this.form.querySelector('input[name="otro3pl"]:checked') !== null;
        break;

      case 'comentarios':
        // Optional but max 500 characters
        isValid = value.length <= 500;
        break;

      case 'privacidad':
        // Must be checked
        isValid = value === true;
        break;

      default:
        break;
    }

    if (isValid) {
      if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.setAttribute('aria-hidden', 'true');
      }
      delete this.errors[fieldName];
    } else {
      this.errors[fieldName] = true;
      if (errorElement) {
        errorElement.classList.remove('hidden');
        errorElement.setAttribute('aria-hidden', 'false');
      }
    }

    // Update field styling
    this.updateFieldStyling(field, isValid);

    return isValid;
  }

  updateFieldStyling(field, isValid) {
    if (isValid) {
      field.classList.remove('border-red-600', 'bg-red-50');
      field.setAttribute('aria-invalid', 'false');
    } else {
      field.classList.add('border-red-600', 'bg-red-50');
      field.setAttribute('aria-invalid', 'true');
    }
  }

  showSuccess() {
    this.successMessage.textContent = '';
    const successTitle = document.createElement('strong');
    successTitle.textContent = '¡Solicitud enviada correctamente!';
    const successText = document.createElement('p');
    successText.className = 'mt-2 text-sm';
    successText.textContent = 'Gracias por contactar con TrackFlow. Nos pondremos en contacto en las próximas 24 horas con una propuesta personalizada para tu operación logística.';
    
    this.successMessage.appendChild(successTitle);
    this.successMessage.appendChild(successText);
    this.successMessage.classList.remove('hidden');

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.successMessage.classList.add('hidden');
    }, 8000);
  }
}

// Initialize form validator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('contacto-form');
});
