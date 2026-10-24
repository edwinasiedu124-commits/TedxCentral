// Countdown, responsive navigation, and waitlist form for TEDxCentralUniversity.

// November 28, 2026 at 9:00 AM in Africa/Accra (UTC+00:00).
const EVENT_DATE = new Date('2026-11-28T09:00:00+00:00').getTime();
let countdownInterval;

function updateCountdown() {
    const values = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    const status = document.getElementById('countdown-status');
    if (Object.values(values).some(value => !value)) return;

    const distance = EVENT_DATE - Date.now();
    if (distance <= 0) {
        clearInterval(countdownInterval);
        Object.values(values).forEach(value => { value.textContent = '00'; });
        if (status) status.textContent = 'The event has started.';
        return;
    }

    const secondsLeft = Math.floor(distance / 1000);
    values.days.textContent = String(Math.floor(secondsLeft / 86400));
    values.hours.textContent = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(2, '0');
    values.minutes.textContent = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    values.seconds.textContent = String(secondsLeft % 60).padStart(2, '0');
}

function setupMobileNavigation() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const setMenuOpen = open => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        menu.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => {
        setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            toggle.focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) setMenuOpen(false);
    });
}

function setupWaitlistForm() {
    const form = document.querySelector('.waitlist-form');
    const note = form?.querySelector('.form-note');
    if (!form || !note) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.waitlist-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
        note.textContent = '';
        note.className = 'form-note';

        const formData = new FormData(form);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                note.textContent = 'You\'re on the list! We\'ll email you when tickets open.';
                note.classList.add('success');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch {
            note.textContent = 'Something went wrong. Please try again or email us directly.';
            note.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function init() {
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
    setupMobileNavigation();
    setupWaitlistForm();
}

document.addEventListener('DOMContentLoaded', init);
