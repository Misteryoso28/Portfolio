// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mobile navigation toggle with accessibility
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  // Toggle menu on button click
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when navigation link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Close menu when ESC key is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }
  });
}

// Lazy load observer for scroll-triggered reveal animations
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Contact form submission handler with silent submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    if (submitButton) {
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', true);

      try {
        // Send form data to Formspree
        const response = await fetch('https://formspree.io/f/xppzwnrg', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show success notification
          showNotification('Message sent successfully!', 'success');
          contactForm.reset();
          submitButton.textContent = 'Message Sent';
          
          // Reset button after 2 seconds
          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
          }, 2000);
        } else {
          showNotification('Something went wrong. Please try again.', 'error');
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
        }
      } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
}

// Notification function
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.textContent = message;
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}
