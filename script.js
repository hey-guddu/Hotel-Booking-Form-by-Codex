const form = document.getElementById('hotelBookingForm');
const formMessage = document.getElementById('formMessage');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');

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
