const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const predictButton = document.getElementById('predictButton');
const resultDiv = document.getElementById('result');
const predictionsList = document.getElementById('predictionsList');

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.style.display = 'block';
            imagePreview.style.backgroundImage = `url(${event.target.result})`;
            predictButton.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

predictButton.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    resultDiv.style.display = 'block';
    resultDiv.querySelector('.loading').style.display = 'block';
    resultDiv.querySelector('.result-content').style.display = 'none';
    
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Gagal memprediksi. Coba lagi.');
        }

        const data = await response.json();
        
        predictionsList.innerHTML = '';
        if (data.predictions && data.predictions.length > 0) {
            data.predictions.forEach(p => {
                const li = document.createElement('li');
                li.textContent = `${p.label} (${(p.probability * 100).toFixed(2)}%)`;
                predictionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Tidak ada hasil yang ditemukan.';
            predictionsList.appendChild(li);
        }

    } catch (error) {
        predictionsList.innerHTML = `<li>Terjadi kesalahan: ${error.message}</li>`;
        console.error('Error:', error);
    } finally {
        resultDiv.querySelector('.loading').style.display = 'none';
        resultDiv.querySelector('.result-content').style.display = 'block';
    }
});