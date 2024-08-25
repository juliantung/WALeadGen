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

function saveData() {
    const outputs = document.getElementsByClassName('output');
    const data = [];
    for (let output of outputs) {
        const review = output.getElementsByTagName('p')[1].textContent;
        const link = output.getElementsByTagName('a')[0].href;
        const done = output.classList.contains('done');
        data.push({ 
            review_text: review, 
            review_link: link, 
            review_status: done ? 'done' : 'not done' 
        });
    }
    const dataStr = JSON.stringify(data, null, 4);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reviews_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function loadData(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const dataInput = event.target.result;
        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = '';

        try {
            const data = JSON.parse(dataInput);
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
        } catch (error) {
            console.error('Invalid data format');
        }
    };

    reader.readAsText(file);
}
