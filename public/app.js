const form = document.querySelector('#reviewForm');
const status = document.querySelector('#status');
const submitButton = document.querySelector('#submitButton');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  status.className = 'status';
  status.textContent = 'Submitting…';
  submitButton.disabled = true;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Submission failed.');
    }

    status.className = 'status success';
    status.textContent = `Submitted successfully. Confirmation: ${result.submissionId}`;
    form.reset();
  } catch (error) {
    status.className = 'status error';
    status.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});
