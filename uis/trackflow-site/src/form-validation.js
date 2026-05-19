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
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    this.form.addEventListener('reset', () => {
      setTimeout(() => this.clearFormState(), 0);
    });

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

      if (!field) return;

      if (fieldName === 'comentarios') {
        field.addEventListener('input', () => {
          this.updateCharacterCount(fieldName);
          this.validateField(fieldName);
        });
      } else if (fieldName === 'volumen') {
        field.addEventListener('change', () => {
          this.validateField(fieldName);
          this.checkVolumeWarning(fieldName);
        });
      } else if (fieldName === 'servicios' || fieldName === 'otro3pl') {
        this.form.querySelectorAll(`input[name="${fieldName}"]`).forEach((input) => {
          input.addEventListener('change', () => this.validateField(fieldName));
        });
      } else {
        field.addEventListener('blur', () => this.validateField(fieldName));
        field.addEventListener('input', () => this.validateField(fieldName));
      }
    });
  }

  updateCharacterCount(fieldName) {
  const field = this.form.elements[fieldName];
  const countElement = document.getElementById(`${fieldName}-count`);

  if (field && countElement) {
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

    const fieldsToValidate = [
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

    const isFormValid = fieldsToValidate
      .map((fieldName) => this.validateField(fieldName))
      .every(Boolean);

    if (isFormValid) {
      this.showSuccess();
      this.form.reset();
      this.clearFormState(false);
      this.successMessage.scrollIntoView({ behavior: 'smooth' });
    } else {
      const firstErrorFieldName = Object.keys(this.errors)[0];
      const firstErrorField = this.form.elements[firstErrorFieldName];

      if (firstErrorField) {
        if (typeof firstErrorField.focus === 'function') {
          firstErrorField.focus();
        } else {
          firstErrorField[0]?.focus();
        }

        const target =
          typeof firstErrorField.scrollIntoView === 'function'
            ? firstErrorField
            : firstErrorField[0];

        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  validateField(fieldName) {
    const field = this.form.elements[fieldName];
    if (!field) return true;

    const errorElement = document.getElementById(`error-${fieldName}`);
    let isValid = true;

    const value =
      fieldName === 'privacidad'
        ? field.checked
        : typeof field.value === 'string'
          ? field.value.trim()
          : '';

    switch (fieldName) {
      case 'empresa':
        isValid = value.length >= 2;
        break;

      case 'contacto':
        isValid = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/.test(value);
        break;

      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        break;

      case 'telefono':
        isValid = /^\+\d{1,3}[\s-]?\d[\d\s-]{6,16}$/.test(value);
        break;

      case 'sitio':
        isValid = value === '' || /^https?:\/\/.+\..+/.test(value);
        break;

      case 'pais':
      case 'producto':
      case 'volumen':
        isValid = value.length > 0;
        break;

      case 'servicios':
        isValid = this.form.querySelectorAll('input[name="servicios"]:checked').length > 0;
        break;

      case 'otro3pl':
        isValid = this.form.querySelector('input[name="otro3pl"]:checked') !== null;
        break;

      case 'comentarios':
        isValid = value.length <= 500;
        break;

      case 'privacidad':
        isValid = value === true;
        break;

      default:
        break;
    }

    if (isValid) {
      this.clearError(fieldName, field, errorElement);
    } else {
      this.showError(fieldName, field, errorElement);
    }

    return isValid;
  }

  showError(fieldName, field, errorElement) {
    this.errors[fieldName] = true;

    if (errorElement) {
      errorElement.classList.remove('hidden');
      errorElement.setAttribute('aria-hidden', 'false');
    }

    this.updateFieldStyling(field, false);
  }

  clearError(fieldName, field, errorElement) {
    delete this.errors[fieldName];

    if (errorElement) {
      errorElement.classList.add('hidden');
      errorElement.setAttribute('aria-hidden', 'true');
    }

    this.updateFieldStyling(field, true);
  }

  updateFieldStyling(field, isValid) {
    if (field instanceof RadioNodeList) {
      field.forEach((input) => {
        input.setAttribute('aria-invalid', String(!isValid));
      });
      return;
    }

    if (isValid) {
      field.classList.remove('border-red-600', 'bg-red-50');
      field.setAttribute('aria-invalid', 'false');
    } else {
      field.classList.add('border-red-600', 'bg-red-50');
      field.setAttribute('aria-invalid', 'true');
    }
  }

  clearFormState(hideSuccess = true) {
    this.errors = {};

    [
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
    ].forEach((fieldName) => {
      const field = this.form.elements[fieldName];
      const errorElement = document.getElementById(`error-${fieldName}`);

      if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.setAttribute('aria-hidden', 'true');
      }

      if (field) {
        this.updateFieldStyling(field, true);
      }
    });

    const warningElement = document.getElementById('warning-volumen');
    if (warningElement) {
      warningElement.classList.add('hidden');
    }

    this.updateCharacterCount('comentarios');

    if (hideSuccess && this.successMessage) {
      this.successMessage.classList.add('hidden');
      this.successMessage.textContent = '';
    }
  }

  showSuccess() {
    this.successMessage.textContent = '';

    const successTitle = document.createElement('strong');
    successTitle.textContent = '¡Gracias por tu interés en TrackFlow!';

    const successText = document.createElement('p');
    successText.className = 'mt-2 text-sm';
    successText.textContent =
      'Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará en las próximas 24-48 horas para agendar una llamada y conocer tus necesidades logísticas en detalle.';

    const urgentText = document.createElement('p');
    urgentText.className = 'mt-2 text-sm';
    urgentText.textContent =
      'Si tienes alguna consulta urgente, escríbenos directamente a comercial@trackflow.com';

    this.successMessage.appendChild(successTitle);
    this.successMessage.appendChild(successText);
    this.successMessage.appendChild(urgentText);
    this.successMessage.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FormValidator('contacto-form');
});