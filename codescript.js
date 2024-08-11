document.getElementById('linkForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const instagramLink = document.getElementById('instagramLink').value;
    const whatsappLink = document.getElementById('whatsappLink').value;
    const googleReviewLink = document.getElementById('googleReviewLink').value;

    const generatedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>How did we do?</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="icon" type="image/x-icon" href="/favicon_io/favicon.ico">

  <!-- PNG versions -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png">

  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png">

  <!-- Manifest (for progressive web apps) -->
  <link rel="manifest" href="/favicon_io/site.webmanifest">
</head>
<body>
  <ul class="wrapper">
    <li class="icon instagram" data-url="${instagramLink}">
      <span><i class="fab fa-instagram"></i></span>
    </li>
    <li class="icon whatsapp" data-url="${whatsappLink}">
      <span><i class="fab fa-whatsapp"></i></span>
    </li>
    <li class="icon shopping-cart" data-url="/catalogue">
      <span><i class="fas fa-shopping-cart"></i></span>
    </li>
  </ul>
  <div class="container">
    <div class="rating-container">
      <h1>How did we do today?</h1>
    </div>
    <div class="container__items">
      <input type="radio" name="stars" id="st5">
      <label for="st5">
        <div class="star-stroke">
          <div class="star-fill"></div>
        </div>
        <div class="label-description" data-content="Excellent"></div>
      </label>
      <input type="radio" name="stars" id="st4">
      <label for="st4">
        <div class="star-stroke">
          <div class="star-fill"></div>
        </div>
        <div class="label-description" data-content="Good"></div>
      </label>
      <input type="radio" name="stars" id="st3">
      <label for="st3">
        <div class="star-stroke">
          <div class="star-fill"></div>
        </div>
        <div class="label-description" data-content="OK"></div>
      </label>
      <input type="radio" name="stars" id="st2">
      <label for="st2">
        <div class="star-stroke">
          <div class="star-fill"></div>
        </div>
        <div class="label-description" data-content="Bad"></div>
      </label>
      <input type="radio" name="stars" id="st1">
      <label for="st1">
        <div class="star-stroke">
          <div class="star-fill"></div>
        </div>
        <div class="label-description" data-content="Terrible"></div>
      </label>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const starInputs = document.querySelectorAll('input[name="stars"]');
      const icons = document.querySelectorAll('.icon');

      starInputs.forEach(star => {
        star.addEventListener('change', (event) => {
          const selectedStar = event.target.id;
          setTimeout(() => {
            if (selectedStar === 'st1' || selectedStar === 'st2' || selectedStar === 'st3') {
              window.location.href = 'feedback';
            } else if (selectedStar === 'st4' || selectedStar === 'st5') {
              window.location.href = '${googleReviewLink}';
            }
          }, 500);
        });
      });

      icons.forEach(icon => {
        icon.addEventListener('click', (event) => {
          const url = icon.getAttribute('data-url');
          if (icon.classList.contains('shopping-cart')) {
            setTimeout(() => {
              window.location.href = url;
            }, 700); // 0.7 second pause for shopping cart redirection
          } else {
            setTimeout(() => {
              window.open(url, '_blank');
            }, 700); // 0.7 second pause
          }
        });
      });
    });
  </script>
</body>
</html>
`;

    document.getElementById('generatedCode').textContent = generatedHTML;
});

document.getElementById('copyButton').addEventListener('click', function() {
    const generatedCode = document.getElementById('generatedCode');
    generatedCode.select();
    document.execCommand('copy');
    alert('HTML code copied to clipboard');
});
