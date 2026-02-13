const form = document.getElementById('hotelBookingForm');
const formMessage = document.getElementById('formMessage');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const backToTopButton = document.getElementById('backToTop');
const scrollTriggers = document.querySelectorAll('[data-scroll-target]');

const today = new Date().toISOString().split('T')[0];
checkInInput.min = today;
checkOutInput.min = today;

checkInInput.addEventListener('change', () => {
  checkOutInput.min = checkInInput.value || today;
  if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
    checkOutInput.value = '';
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.fullName || !data.email || !data.destination || !data.checkIn || !data.checkOut) {
    showMessage('Please complete all required fields before submitting.', 'error');
    return;
  }

  if (data.checkOut <= data.checkIn) {
    showMessage('Check-out date must be later than check-in date.', 'error');
    return;
  }

  showMessage(
    `Thanks ${data.fullName}! Your ${data.roomType} room in ${data.destination} for ${data.guests} guest(s) has been requested from ${formatDate(data.checkIn)} to ${formatDate(data.checkOut)}.`,
    'success'
  );

  form.reset();
  checkInInput.min = today;
  checkOutInput.min = today;
});

scrollTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = trigger.getAttribute('data-scroll-target');
    const target = document.getElementById(targetId);
    if (target) {
      smoothScrollTo(target.offsetTop - 16, 900);
    }
  });
});

backToTopButton.addEventListener('click', () => {
  smoothScrollTo(0, 900);
});

window.addEventListener('scroll', () => {
  backToTopButton.classList.toggle('visible', window.scrollY > 280);
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}
