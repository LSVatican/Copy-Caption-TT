// Mengambil Element DOM
const inputSection = document.getElementById('input-section');
const resultSection = document.getElementById('result-section');
const tiktokUrlInput = document.getElementById('tiktok-url');
const btnPaste = document.getElementById('btn-paste');
const btnFetch = document.getElementById('btn-fetch');
const btnClose = document.getElementById('btn-close');
const btnCopy = document.getElementById('btn-copy');
const captionText = document.getElementById('caption-text');

// Fitur Paste Menggunakan Pop-up Perizinan Bawaan Browser
btnPaste.addEventListener('click', async () => {
    try {
        // Memicu pop up izin baca clipboard bawaan browser
        const text = await navigator.clipboard.readText();
        tiktokUrlInput.value = text;
    } catch (err) {
        alert('Gagal menempelkan teks. Pastikan Anda memberi izin akses clipboard pada browser.');
    }
});

// Fungsi Mengambil Caption Asli TikTok via API Pihak Ketiga (TikWM)
btnFetch.addEventListener('click', async () => {
    const url = tiktokUrlInput.value.trim();
    
    if (!url) {
        alert('Silakan masukkan link TikTok terlebih dahulu!');
        return;
    }

    btnFetch.innerText = 'Memuat...';

    try {
        // Menggunakan API publik TikWM untuk bypass CORS dan mengambil caption asli
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data && data.data && data.data.title !== undefined) {
            // Memasukkan caption asli ke teks target
            captionText.innerText = data.data.title || '(Video ini tidak memiliki caption)';
            
            // Sembunyikan input sementara, tampilkan box caption baru
            inputSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        } else {
            alert('Gagal mengambil data. Pastikan link video TikTok valid dan publik.');
        }
    } catch (error) {
        alert('Terjadi kesalahan koneksi atau API sedang down.');
        console.error(error);
    } finally {
        btnFetch.innerText = 'Ambil Caption';
    }
});

// Fitur Close dengan Konfirmasi Kembali ke Input Link
btnClose.addEventListener('click', () => {
    const konfirmasi = confirm('Apakah Anda ingin kembali ke halaman input?');
    if (konfirmasi) {
        // Reset input dan kembalikan tampilan
        tiktokUrlInput.value = '';
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    }
});

// Fitur Salin Teks Otomatis
btnCopy.addEventListener('click', () => {
    const textToCopy = captionText.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Mengubah teks tombol sementara sebagai indikator sukses
        const originalText = btnCopy.innerText;
        btnCopy.innerText = '✓ Tersalin!';
        setTimeout(() => {
            btnCopy.innerText = originalText;
        }, 2000);
    }).catch(() => {
        alert('Gagal menyalin teks secara otomatis.');
    });
});

// LOGIKA MODAL PRIVACY POLICY & TERMS
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');
const openPrivacy = document.getElementById('open-privacy');
const openTerms = document.getElementById('open-terms');

const privacyContent = `<h2>Privacy Policy</h2><br><p>Kami di Copy Caption TT berkomitmen untuk menjaga privasi Anda. Aplikasi ini tidak menyimpan link TikTok ataupun teks caption yang Anda ambil di server manapun. Semua proses dilakukan langsung di browser Anda.</p>`;
const termsContent = `<h2>Terms of Service</h2><br><p>Dengan menggunakan Copy Caption TT, Anda setuju untuk menggunakan alat ini secara bijak. Kami tidak bertanggung jawab atas penyalahgunaan konten atau pelanggaran hak cipta dari caption yang Anda salin milik pengguna lain.</p>`;

openPrivacy.addEventListener('click', (e) => {
    e.preventDefault();
    modalBody.innerHTML = privacyContent;
    modal.classList.remove('hidden');
});

openTerms.addEventListener('click', (e) => {
    e.preventDefault();
    modalBody.innerHTML = termsContent;
    modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if(e.target === modal) modal.classList.add('hidden'); });
