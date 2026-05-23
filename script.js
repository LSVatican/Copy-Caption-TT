// Mengambil Element DOM
const inputSection = document.getElementById('input-section');
const resultSection = document.getElementById('result-section');
const tiktokUrlInput = document.getElementById('tiktok-url');
const btnClearInput = document.getElementById('btn-clear-input'); // Element Baru
const btnPaste = document.getElementById('btn-paste');
const btnFetch = document.getElementById('btn-fetch');
const btnClose = document.getElementById('btn-close');
const btnCopy = document.getElementById('btn-copy');
const captionText = document.getElementById('caption-text');

// 1. FITUR MONITOR INPUT & TOMBOL HAPUS ISI INPUT
tiktokUrlInput.addEventListener('input', () => {
    if (tiktokUrlInput.value.trim().length > 0) {
        btnClearInput.classList.remove('hidden'); // Munculkan tombol X jika ada isinya
    } else {
        btnClearInput.classList.add('hidden'); // Sembunyikan jika kosong
    }
});

btnClearInput.addEventListener('click', () => {
    tiktokUrlInput.value = ''; // Mengosongkan input
    btnClearInput.classList.add('hidden'); // Menyembunyikan tombol X kembali
    tiktokUrlInput.focus();
});

// Fitur Paste Menggunakan Pop-up Perizinan Bawaan Browser
btnPaste.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        tiktokUrlInput.value = text;
        if (text.trim().length > 0) {
            btnClearInput.classList.remove('hidden'); // Cek jika hasil paste ada isinya
        }
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
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data && data.data && data.data.title !== undefined) {
            captionText.innerText = data.data.title || '(Video ini tidak memiliki caption)';
            
            // Pastikan tombol dalam keadaan mode "Salin Teks" saat ada caption baru muncul
            btnCopy.innerText = 'Salin Teks';
            btnCopy.setAttribute('data-state', 'copy');
            btnCopy.style.backgroundColor = '#fe2c55';

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

// 2. SAKELAR FITUR: REPLACEMENT COPY <-> HAPUS SEMENTARA
btnCopy.addEventListener('click', () => {
    const currentState = btnCopy.getAttribute('data-state');

    if (currentState === 'copy') {
        // --- AKSI SALIN ---
        const textToCopy = captionText.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Setelah berhasil disalin, ganti tombol menjadi fitur "Hapus Sementara"
            btnCopy.innerText = '✕ Hapus Sementara';
            btnCopy.setAttribute('data-state', 'clear');
            btnCopy.style.backgroundColor = '#ff4a4a'; // Opsional: ubah ke warna merah penanda hapus
        }).catch(() => {
            alert('Gagal menyalin teks secara otomatis.');
        });
    } else {
        // --- AKSI HAPUS SEMENTARA ---
        captionText.innerText = 'Caption akan muncul di sini...';
        
        // Kembalikan tombol ke fitur "Salin Teks" semula
        btnCopy.innerText = 'Salin Teks';
        btnCopy.setAttribute('data-state', 'copy');
        btnCopy.style.backgroundColor = '#fe2c55'; // Balik ke warna semula
        
        // Sembunyikan hasil, kembalikan ke kolom input utama
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        
        // Sekaligus membersihkan kolom input link utama
        tiktokUrlInput.value = '';
        btnClearInput.classList.add('hidden');
    }
});

// Fitur Close dengan Konfirmasi Kembali ke Input Link
btnClose.addEventListener('click', () => {
    const konfirmasi = confirm('Apakah Anda ingin kembali ke halaman input?');
    if (konfirmasi) {
        tiktokUrlInput.value = '';
        btnClearInput.classList.add('hidden');
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
        
        // Reset tombol copy ke state awal jika user menggunakan tombol tutup bawaan
        btnCopy.innerText = 'Salin Teks';
        btnCopy.setAttribute('data-state', 'copy');
        btnCopy.style.backgroundColor = '#fe2c55';
    }
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
