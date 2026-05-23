// Mengmengambil Element DOM
const inputSection = document.getElementById('input-section');
const resultSection = document.getElementById('result-section');
const tiktokUrlInput = document.getElementById('tiktok-url');
const btnPaste = document.getElementById('btn-paste'); // Tombol dinamis (Paste/Hapus)
const btnFetch = document.getElementById('btn-fetch');
const btnClose = document.getElementById('btn-close');
const btnCopy = document.getElementById('btn-copy');
const captionText = document.getElementById('caption-text');

// Fungsi untuk mengecek isi input dan mengubah mode tombol (Paste <=> Hapus)
function updateInputButtonState() {
    if (tiktokUrlInput.value.trim().length > 0) {
        btnPaste.innerText = 'Hapus';
        btnPaste.classList.add('clear-mode');
        btnPaste.setAttribute('title', 'Hapus isi input');
    } else {
        btnPaste.innerText = 'Paste';
        btnPaste.classList.remove('clear-mode');
        btnPaste.setAttribute('title', 'Tempel dari Clipboard');
    }
}

// Jalankan fungsi setiap kali ada perubahan ketikan/isi di kolom input
tiktokUrlInput.addEventListener('input', updateInputButtonState);

// Fitur Tombol Dinamis (Bisa jadi Paste atau Hapus tergantung kondisi input)
btnPaste.addEventListener('click', async () => {
    if (tiktokUrlInput.value.trim().length > 0) {
        // JIKA ADA ISINYA: Berfungsi sebagai HAPUS SEMENTARA
        tiktokUrlInput.value = '';
        updateInputButtonState(); // Kembalikan tombol ke mode Paste
        tiktokUrlInput.focus();
    } else {
        // JIKA KOSONG: Berfungsi sebagai PASTE dari clipboard browser
        try {
            const text = await navigator.clipboard.readText();
            tiktokUrlInput.value = text;
            updateInputButtonState(); // Ubah tombol ke mode Hapus karena sudah ada isinya
        } catch (err) {
            alert('Gagal menempelkan teks. Pastikan Anda memberi izin akses clipboard pada browser.');
        }
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
            
            // Sembunyikan input sementara, tampilkan box caption
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
        tiktokUrlInput.value = '';
        updateInputButtonState(); // Pastikan tombol kembali ke mode "Paste" saat halaman direset
        resultSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    }
});

// Fitur Salin Teks Otomatis (Untuk area box caption hasil)
btnCopy.addEventListener('click', () => {
    const textToCopy = captionText.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
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
