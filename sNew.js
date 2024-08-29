let companiesData = {}; // Store data for multiple companies
let currentCompany = '';

function generateOutputs() {
    const reviewsInput = document.getElementById('reviews-input').value;
    const reviewLink = document.getElementById('review-link').value;
    const reviews = reviewsInput.split(/\n\n/);
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    reviews.forEach((review, index) => {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';
        outputDiv.id = `output-${index}`;

        const linkElement = document.createElement('p');
        linkElement.innerHTML = `Click: <a href="${reviewLink}" target="_blank">${reviewLink}</a>`;
        outputDiv.appendChild(linkElement);

        const reviewElement = document.createElement('p');
        reviewElement.textContent = review;
        outputDiv.appendChild(reviewElement);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => {
            copyToClipboard(`Click: ${reviewLink}\n\n${review}`);
            markAsDone(outputDiv); // Automatically mark as done after copying
        };
        outputDiv.appendChild(copyButton);

        const doneButton = document.createElement('button');
        doneButton.className = 'done-btn';
        doneButton.textContent = 'Mark as Done';
        doneButton.onclick = () => markAsDone(outputDiv);
        outputDiv.appendChild(doneButton);

        const undoneButton = document.createElement('button');
        undoneButton.className = 'undone-btn';
        undoneButton.textContent = 'Mark as Undone';
        undoneButton.onclick = () => markAsUndone(outputDiv);
        outputDiv.appendChild(undoneButton);

        outputContainer.appendChild(outputDiv);
    });

    updateStats();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyNotification();
    }, () => {
        console.error('Failed to copy!');
    });
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Copied to clipboard!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 1000);
}

function markAsDone(element) {
    element.classList.add('done');
    updateStats();
}

function markAsUndone(element) {
    element.classList.remove('done');
    updateStats();
}

function updateStats() {
    const totalReviews = document.getElementsByClassName('output').length;
    const doneReviews = document.getElementsByClassName('done').length;
    document.getElementById('total-reviews').textContent = totalReviews;
    document.getElementById('done-count').textContent = doneReviews;
    document.getElementById('undone-count').textContent = totalReviews - doneReviews;
}

function saveDataAsZip() {
    const zip = new JSZip();

    for (let companyName in companiesData) {
        const dataStr = JSON.stringify(companiesData[companyName], null, 4);
        zip.file(`${companyName}_reviews_data.json`, dataStr);
    }

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${today}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function loadData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    if (file.name.endsWith('.zip')) {
        loadZipData(file);
    } else if (file.name.endsWith('.json')) {
        loadJsonData(file);
    } else {
        alert('Unsupported file type. Please upload a JSON or ZIP file.');
    }
}

function loadJsonData(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const dataInput = event.target.result;
        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = '';

        try {
            const data = JSON.parse(dataInput);
            const companyName = prompt('Enter the company name for this data:', ''); // Ask for company name
            if (companyName) {
                companiesData[companyName] = data; // Store the data under the company name
                currentCompany = companyName; // Set current company
                renderCompanyData(); // Render data for the selected company
                updateCompanySelector(); // Update dropdown with the new company
            } else {
                alert('Data not loaded due to missing company name.');
            }
        } catch (error) {
            console.error('Invalid data format');
        }
    };

    reader.readAsText(file);
}

function loadZipData(file) {
    const zip = new JSZip();

    zip.loadAsync(file).then(function(zip) {
        const filePromises = [];
        zip.forEach((relativePath, zipEntry) => {
            if (zipEntry.name.endsWith('.json')) {
                filePromises.push(
                    zipEntry.async("string").then((fileData) => {
                        const companyName = zipEntry.name.replace('_reviews_data.json', '');
                        companiesData[companyName] = JSON.parse(fileData);
                    })
                );
            }
        });

        Promise.all(filePromises).then(() => {
            updateCompanySelector();
            if (Object.keys(companiesData).length > 0) {
                currentCompany = Object.keys(companiesData)[0];
                renderCompanyData();
            }
        });
    }, function(error) {
        console.error("Failed to read zip file: ", error);
    });
}

function updateCompanySelector() {
    const selector = document.getElementById('company-selector');
    selector.innerHTML = '';
    for (let companyName in companiesData) {
        const option = document.createElement('option');
        option.value = companyName;
        option.textContent = companyName;
        selector.appendChild(option);
    }
    selector.value = currentCompany;
}

function switchCompany() {
    const selector = document.getElementById('company-selector');
    currentCompany = selector.value;
    renderCompanyData();
}

function renderCompanyData() {
    const data = companiesData[currentCompany];
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    data.forEach((item, index) => {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';
        if (item.review_status === 'done') {
            outputDiv.classList.add('done');
        }
        outputDiv.id = `output-${index}`;

        const linkElement = document.createElement('p');
        linkElement.innerHTML = `Click: <a href="${item.review_link}" target="_blank">${item.review_link}</a>`;
        outputDiv.appendChild(linkElement);

        const reviewElement = document.createElement('p');
        reviewElement.textContent = item.review_text;
        outputDiv.appendChild(reviewElement);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => {
            copyToClipboard(`Click: ${item.review_link}\n\n${item.review_text}`);
            markAsDone(outputDiv); // Automatically mark as done after copying
        };
        outputDiv.appendChild(copyButton);

        const doneButton = document.createElement('button');
        doneButton.className = 'done-btn';
        doneButton.textContent = 'Mark as Done';
        doneButton.onclick = () => markAsDone(outputDiv);
        outputDiv.appendChild(doneButton);

        const undoneButton = document.createElement('button');
        undoneButton.className = 'undone-btn';
        undoneButton.textContent = 'Mark as Undone';
        undoneButton.onclick = () => markAsUndone(outputDiv);
        outputDiv.appendChild(undoneButton);

        outputContainer.appendChild(outputDiv);
    });

    updateStats();
}
