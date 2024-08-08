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
        copyButton.onclick = () => copyToClipboard(`Click: ${reviewLink}\n\n${review}`);
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
        alert('Copied to clipboard!');
    }, () => {
        alert('Failed to copy!');
    });
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
    document.getElementById('total-reviews').textContent = `Total Reviews: ${totalReviews}`;
    document.getElementById('done-reviews').textContent = `Done Reviews: ${doneReviews}`;
}

function saveData() {
    const outputs = document.getElementsByClassName('output');
    const data = [];
    for (let output of outputs) {
        const review = output.getElementsByTagName('p')[1].textContent;
        const link = output.getElementsByTagName('a')[0].href;
        const done = output.classList.contains('done');
        data.push({ review, link, done });
    }
    const dataStr = JSON.stringify(data);
    copyToClipboard(dataStr);
}

function loadData() {
    const dataInput = document.getElementById('data-input').value;
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    try {
        const data = JSON.parse(dataInput);
        data.forEach((item, index) => {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            if (item.done) {
                outputDiv.classList.add('done');
            }
            outputDiv.id = `output-${index}`;

            const linkElement = document.createElement('p');
            linkElement.innerHTML = `Click: <a href="${item.link}" target="_blank">${item.link}</a>`;
            outputDiv.appendChild(linkElement);

            const reviewElement = document.createElement('p');
            reviewElement.textContent = item.review;
            outputDiv.appendChild(reviewElement);

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.textContent = 'Copy';
            copyButton.onclick = () => copyToClipboard(`Click: ${item.link}\n\n${item.review}`);
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
    } catch (error) {
        alert('Invalid data format');
    }
}
