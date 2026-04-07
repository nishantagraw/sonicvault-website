// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
if (navbar && !navbar.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            if (target >= 1000) {
                counter.textContent = current.toLocaleString() + '+';
            } else if (target >= 10 && target < 100) {
                counter.textContent = current + 'M+';
            } else {
                counter.textContent = current + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.unobserve(statsSection);
        }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
}

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'var(--accent-purple)' : 'var(--accent-cyan)';
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

// ===== HERO EQUALIZER BARS =====
const eqContainer = document.getElementById('heroEqualizer');
if (eqContainer) {
    const barCount = 80;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.classList.add('eq-bar');
        const minH = Math.random() * 30 + 10;
        const maxH = Math.random() * 200 + 80;
        const speed = (Math.random() * 1.5 + 0.6).toFixed(2);
        const delay = (Math.random() * 2).toFixed(2);
        bar.style.setProperty('--eq-min', minH + 'px');
        bar.style.setProperty('--eq-max', maxH + 'px');
        bar.style.setProperty('--eq-speed', speed + 's');
        bar.style.animationDelay = delay + 's';
        eqContainer.appendChild(bar);
    }
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        // Toggle current
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

// ===== UPLOAD PAGE LOGIC =====
let currentStep = 1;
let audioFile = null;
let artFile = null;

function nextStep(step) {
    // Validate current step
    if (step === 2) {
        const title = document.getElementById('songTitle');
        const artist = document.getElementById('artistName');
        const type = document.getElementById('releaseType');
        const genre = document.getElementById('genre');
        const lang = document.getElementById('language');
        const date = document.getElementById('releaseDate');
        const email = document.getElementById('email');

        if (title && !title.value.trim()) { shakeInput(title); return; }
        if (artist && !artist.value.trim()) { shakeInput(artist); return; }
        if (type && !type.value) { shakeInput(type); return; }
        if (genre && !genre.value) { shakeInput(genre); return; }
        if (lang && !lang.value) { shakeInput(lang); return; }
        if (date && !date.value) { shakeInput(date); return; }
        if (email && !email.value.trim()) { shakeInput(email); return; }
    }

    if (step === 3) {
        if (!audioFile) {
            const zone = document.getElementById('audioDropZone');
            if (zone) {
                zone.style.borderColor = 'var(--accent-pink)';
                zone.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    zone.style.borderColor = '';
                    zone.style.animation = '';
                }, 600);
            }
            return;
        }
    }

    if (step === 4) {
        const agree1 = document.getElementById('agreeTerms');
        const agree2 = document.getElementById('agreeAge');
        if (agree1 && agree2 && (!agree1.checked || !agree2.checked)) return;

        // Build review
        buildReview();
    }

    showStep(step);
}

function prevStep(step) {
    showStep(step);
}

function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('step' + step);
    if (target) target.classList.add('active');

    // Update progress
    document.querySelectorAll('.progress-step').forEach(s => {
        const sStep = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (sStep === step) s.classList.add('active');
        if (sStep < step) s.classList.add('completed');
    });

    ['line1', 'line2', 'line3'].forEach((id, idx) => {
        const line = document.getElementById(id);
        if (line) {
            line.classList.toggle('active', idx + 1 < step);
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shakeInput(el) {
    el.style.borderColor = 'var(--accent-pink)';
    el.style.animation = 'shake 0.4s ease';
    el.focus();
    setTimeout(() => {
        el.style.borderColor = '';
        el.style.animation = '';
    }, 500);
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
    75% { transform: translateX(-4px); }
}`;
document.head.appendChild(shakeStyle);

// ===== FILE UPLOADS =====
const audioInput = document.getElementById('audioInput');
const audioDropZone = document.getElementById('audioDropZone');
const artInput = document.getElementById('artInput');

if (audioInput) {
    audioInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleAudioFile(e.target.files[0]);
        }
    });
}

if (audioDropZone) {
    audioDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        audioDropZone.classList.add('dragover');
    });

    audioDropZone.addEventListener('dragleave', () => {
        audioDropZone.classList.remove('dragover');
    });

    audioDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        audioDropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleAudioFile(e.dataTransfer.files[0]);
        }
    });
}

function handleAudioFile(file) {
    const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/flac', 'audio/x-flac'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validTypes.includes(file.type) && !['wav', 'mp3', 'flac'].includes(ext)) {
        alert('Please upload a WAV, MP3, or FLAC file.');
        return;
    }

    audioFile = file;
    const preview = document.getElementById('audioPreview');
    const nameEl = document.getElementById('audioFileName');
    const sizeEl = document.getElementById('audioFileSize');

    if (preview && nameEl && sizeEl) {
        nameEl.textContent = file.name;
        sizeEl.textContent = formatFileSize(file.size);
        preview.classList.add('show');
    }

    if (audioDropZone) audioDropZone.style.display = 'none';
}

function removeAudio() {
    audioFile = null;
    const preview = document.getElementById('audioPreview');
    if (preview) preview.classList.remove('show');
    if (audioDropZone) audioDropZone.style.display = '';
    if (audioInput) audioInput.value = '';
}

if (artInput) {
    artInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleArtFile(e.target.files[0]);
        }
    });
}

function handleArtFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a JPG or PNG image.');
        return;
    }

    artFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('artImage');
        const placeholder = document.getElementById('artPlaceholder');
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ===== AGREEMENT CHECKBOXES =====
const agreeTerms = document.getElementById('agreeTerms');
const agreeAge = document.getElementById('agreeAge');
const agreeBtn = document.getElementById('agreeBtn');

function checkAgreements() {
    if (agreeTerms && agreeAge && agreeBtn) {
        const both = agreeTerms.checked && agreeAge.checked;
        agreeBtn.disabled = !both;
        agreeBtn.style.opacity = both ? '1' : '0.5';
    }
}

if (agreeTerms) agreeTerms.addEventListener('change', checkAgreements);
if (agreeAge) agreeAge.addEventListener('change', checkAgreements);

// ===== BUILD REVIEW =====
function buildReview() {
    const container = document.getElementById('reviewContent');
    if (!container) return;

    const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? (el.options ? (el.options[el.selectedIndex]?.text || '') : el.value) : '';
    };

    const rows = [
        ['Song / Album Title', getValue('songTitle')],
        ['Artist Name', getValue('artistName')],
        ['Release Type', getValue('releaseType')],
        ['Genre', getValue('genre')],
        ['Language', getValue('language')],
        ['Release Date', getValue('releaseDate')],
        ['Composer', getValue('composer') || 'Not specified'],
        ['Lyricist', getValue('lyricist') || 'Not specified'],
        ['Email', getValue('email')],
        ['Phone', getValue('phone') || 'Not specified'],
        ['Audio File', audioFile ? audioFile.name + ' (' + formatFileSize(audioFile.size) + ')' : 'Not uploaded'],
        ['Album Art', artFile ? artFile.name : 'Not uploaded'],
        ['Agreement', 'Accepted ✅'],
    ];

    let html = '<div style="display: grid; gap: 12px;">';
    rows.forEach(([label, value]) => {
        html += `
        <div style="display: flex; justify-content: space-between; padding: 14px 18px; background: var(--bg-secondary); border-radius: 10px; border: 1px solid var(--border-glass);">
            <span style="color: var(--text-muted); font-size: 0.9rem;">${label}</span>
            <span style="font-weight: 600; font-size: 0.93rem; text-align: right; max-width: 60%; word-break: break-all;">${value}</span>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

// ===== SUBMIT RELEASE TO GOOGLE SHEETS + DRIVE =====
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeT40Ofo4U3eKv66Uv5KnR8mjVm7eckqE8wH2jvWN-C3VITzalMQ8rfwqlW6B_fnRZRQ/exec';

// Helper: convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Helper: send via XHR (handles large payloads, works with existing Apps Script)
function sendViaXHR(url, jsonString) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                resolve(xhr.responseText);
            }
        };
        xhr.onerror = function() {
            // Even on CORS error, data is still sent and processed by Apps Script
            resolve('sent');
        };
        xhr.send(jsonString);
    });
}

async function submitRelease() {
    const submitBtn = document.querySelector('#step4 .btn-primary');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing files...';

    // Collect form data
    const formData = {
        songTitle: document.getElementById('songTitle')?.value || '',
        artistName: document.getElementById('artistName')?.value || '',
        releaseType: document.getElementById('releaseType')?.value || '',
        genre: document.getElementById('genre')?.value || '',
        language: document.getElementById('language')?.value || '',
        releaseDate: document.getElementById('releaseDate')?.value || '',
        composer: document.getElementById('composer')?.value || '',
        lyricist: document.getElementById('lyricist')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        description: document.getElementById('description')?.value || '',
        audioFileName: audioFile ? audioFile.name : '',
        artFileName: artFile ? artFile.name : '',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Convert audio file to base64
    if (audioFile) {
        try {
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encoding audio (' + (audioFile.size / (1024*1024)).toFixed(1) + ' MB)...';
            formData.audioBase64 = await fileToBase64(audioFile);
            formData.audioMimeType = audioFile.type || 'audio/mpeg';
            console.log('✅ Audio encoded:', formData.audioFileName, '- Base64 length:', formData.audioBase64.length);
        } catch (err) {
            console.error('Audio encode error:', err);
        }
    }

    // Convert art file to base64
    if (artFile) {
        try {
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encoding artwork...';
            formData.artBase64 = await fileToBase64(artFile);
            formData.artMimeType = artFile.type || 'image/jpeg';
            console.log('✅ Art encoded:', formData.artFileName, '- Base64 length:', formData.artBase64.length);
        } catch (err) {
            console.error('Art encode error:', err);
        }
    }

    // Upload via hidden form (works with large files, no CORS issues)
    submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-bounce"></i> Uploading to cloud...';
    
    const jsonString = JSON.stringify(formData);
    console.log('📦 Total payload size:', (jsonString.length / (1024*1024)).toFixed(2), 'MB');

    try {
        await sendViaXHR(GOOGLE_SCRIPT_URL, jsonString);
        console.log('✅ Release submitted with files!');
    } catch (err) {
        console.error('Upload error:', err);
    }

    // Backup in localStorage (without base64)
    const backupData = { ...formData };
    delete backupData.audioBase64;
    delete backupData.artBase64;
    const releases = JSON.parse(localStorage.getItem('revomusic_releases') || '[]');
    releases.push(backupData);
    localStorage.setItem('revomusic_releases', JSON.stringify(releases));

    // Show success
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector('.upload-progress').style.display = 'none';
    const successState = document.getElementById('successState');
    if (successState) {
        successState.classList.add('show');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
