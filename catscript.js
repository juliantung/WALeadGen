let inputCounter = 1;

document.getElementById('addMoreButton').addEventListener('click', function() {
  inputCounter++;
  const inputFields = document.getElementById('inputFields');
  const newInputGroup = document.createElement('div');
  newInputGroup.className = 'input-group';
  newInputGroup.innerHTML = `
    <label for="imageURL${inputCounter}">Image URL ${inputCounter}:</label>
    <input type="url" id="imageURL${inputCounter}" name="imageURL${inputCounter}">
    <label for="imageFile${inputCounter}">or Choose Image File ${inputCounter}:</label>
    <input type="file" id="imageFile${inputCounter}" name="imageFile${inputCounter}" accept="image/*">
    <label for="productName${inputCounter}">Product Name ${inputCounter}:</label>
    <input type="text" id="productName${inputCounter}" name="productName${inputCounter}" required>
  `;
  inputFields.appendChild(newInputGroup);
});

document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const generatedHTMLArray = [];
  let generatedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Products</title>
  <link rel="stylesheet" href="catstyles.css">
  <link rel="icon" type="image/x-icon" href="/favicon_io/favicon.ico">
</head>
<body>
  <div class="slider" x-data="{start: true, end: false}" style="padding-top: 150px;">
    <div class="slider__content" x-ref="slider" x-on:scroll.debounce="$refs.slider.scrollLeft == 0 ? start = true : start = false; Math.abs(($refs.slider.scrollWidth - $refs.slider.offsetWidth) - $refs.slider.scrollLeft) < 5 ? end = true : end = false;">
  `;

  const fileReadPromises = [];
  
  for (let i = 1; i <= inputCounter; i++) {
    const imageURLInput = document.getElementById(`imageURL${i}`).value;
    const imageFileInput = document.getElementById(`imageFile${i}`).files[0];
    const productName = document.getElementById(`productName${i}`).value;

    if (imageURLInput) {
      generatedHTML += `
      <div class="slider__item">
        <img class="slider__image" src="${imageURLInput}" alt="Image">
        <div class="slider__info">
          <h2>${productName}</h2>
        </div>
      </div>
      `;
    } else if (imageFileInput) {
      const fileReaderPromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageURL = e.target.result;
          resolve({ imageURL, productName });
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFileInput);
      });

      fileReadPromises.push(fileReaderPromise);
    }
  }

  Promise.all(fileReadPromises).then(results => {
    results.forEach(result => {
      const { imageURL, productName } = result;
      generatedHTML += `
      <div class="slider__item">
        <img class="slider__image" src="${imageURL}" alt="Image">
        <div class="slider__info">
          <h2>${productName}</h2>
        </div>
      </div>
      `;
    });

    generatedHTML += `
    </div>
    <div class="slider__nav" style="display: flex;justify-content: center;">
      <button class="slider__nav__button" x-on:click="$refs.slider.scrollBy({left: $refs.slider.offsetWidth * -1, behavior: 'smooth'});" x-bind:class="start ? '' : 'slider__nav__button--active'">Previous</button>
      <button class="slider__nav__button" x-on:click="$refs.slider.scrollBy({left: $refs.slider.offsetWidth, behavior: 'smooth'});" x-bind:class="end ? '' : 'slider__nav__button--active'">Next</button>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.10.2/cdn.js"></script>
</body>
</html>
    `;

    document.getElementById('generatedCode').textContent = generatedHTML;
  }).catch(error => {
    console.error('Error reading files:', error);
  });
});

document.getElementById('copyButton').addEventListener('click', function() {
  const generatedCode = document.getElementById('generatedCode');
  generatedCode.select();
  document.execCommand('copy');
  alert('HTML code copied to clipboard');
});
