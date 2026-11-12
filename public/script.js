let totalSteps = 4; 

function updateProgress(currentStepIndex) {
    document.getElementById('progress-bar').innerText = `Bagian ${currentStepIndex} dari ${totalSteps}`;
}

function toggleSection(jawaban) {
    const btn = document.getElementById('btn-step1');
    const pesanTidak = document.getElementById('pesan-tidak');
    if (jawaban === 'ya') {
        btn.style.display = 'flex';
        pesanTidak.style.display = 'none';
    } else {
        btn.style.display = 'none';
        pesanTidak.style.display = 'block';
    }
}

function nextStep(step, stepIndex) {
    document.querySelectorAll('.form-step').forEach(el => el.style.display = 'none');
    if (step === 'pembayaran') {
        document.getElementById('step-pembayaran').style.display = 'block';
        updateProgress(4); 
    } else {
        document.getElementById('step-' + step).style.display = 'block';
        updateProgress(stepIndex);
    }
    window.scrollTo(0, 0);
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.style.display = 'none');
    document.getElementById('step-' + step).style.display = 'block';
    updateProgress(step); 
    window.scrollTo(0, 0);
}

function validateAndNext(step) {
    const currentStep = document.querySelector('.form-step[style="display: block;"]');
    if (!currentStep) { nextStep(step); return; }

    const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
        if (!input.checkValidity()) { input.reportValidity(); valid = false; }
    });

    if (valid) {
        if (step === 'pembayaran') nextStep(step);
        else if (step === 2) nextStep(step, 2);
        else nextStep(step, 3);
    }
}

function handlePaketChange() {
    const paket = document.getElementById('paket').value;
    const btnLanjut = document.getElementById('btn-lanjut-step2');
    
    document.querySelectorAll('.form-step[id^="step-paket"]').forEach(step => {
        step.querySelectorAll('input, select, textarea').forEach(input => {
            input.required = false;
            if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
            else input.value = '';
        });
    });

    let targetStepId = '';
    if (paket === 'Paket Dasar') {
        targetStepId = 'step-paket-dasar';
        document.querySelectorAll('.paket-input.dasar').forEach(input => input.required = true);
    } else if (paket === 'Paket Pro') {
        targetStepId = 'step-paket-pro';
        document.querySelectorAll('.paket-input.pro').forEach(input => input.required = true);
    } else if (paket === 'Paket Standar') {
        targetStepId = 'step-paket-standar';
        document.querySelectorAll('.paket-input.standar').forEach(input => input.required = true);
    }

    if (targetStepId) {
        btnLanjut.setAttribute('onclick', `validateAndNext('${targetStepId.replace('step-', '')}')`);
    } else {
        btnLanjut.setAttribute('onclick', `validateAndNext('pembayaran')`);
    }
}

// Kirim ke Backend
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerText = 'Mengirim...';
    submitBtn.disabled = true;

    const formData = new FormData();
    
    document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], select, textarea').forEach(input => {
        if(input.id && input.value) formData.append(input.id, input.value);
    });

    document.querySelectorAll('.form-step[style="display: block;"] input[type="radio"]:checked').forEach(radio => {
        formData.append(radio.name, radio.value);
    });

    const fileInput = document.getElementById('buktiTransfer');
    if (fileInput.files.length > 0) formData.append('buktiTransfer', fileInput.files[0]);

    try {
        const response = await fetch('/api/pesan', { method: 'POST', body: formData });
        if (response.ok) {
            alert('Pesanan berhasil! Kuitansi dan Invoice akan segera dikirim ke WhatsApp dan Email Anda.');
            document.getElementById('orderForm').reset();
            nextStep(1, 1);
        } else {
            alert('Terjadi kesalahan di server.');
        }
    } catch (error) {
        alert('Gagal terhubung ke server. Pastikan backend menyala.');
    } finally {
        submitBtn.innerText = 'Kirim Formulir';
        submitBtn.disabled = false;
    }
});
