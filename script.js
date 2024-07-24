function extractAndProcessNumbers() {
    const textedInput = document.getElementById('textedInput').value;
    const untextedInput = document.getElementById('untextedInput').value;
    
    const textedNumbers = new Set(textedInput.split(',').map(num => num.trim()));
    const phonePattern = /(\d{4} \d{4})/g;
    const untextedNumbers = untextedInput.match(phonePattern) || [];
    
    const formattedUntextedNumbers = untextedNumbers.map(num => `+65${num.replace(/\s/g, '')}`);
    
    const validNumbers = new Set();
    const combinedNumbers = new Set(textedNumbers);

    formattedUntextedNumbers.forEach(number => {
        if (number.startsWith('+65')) {
            const phoneNumber = number.slice(3);
            if ((phoneNumber.length === 8) && (phoneNumber[0] === '8' || phoneNumber[0] === '9')) {
                if (!textedNumbers.has(number)) {
                    validNumbers.add(number);
                    combinedNumbers.add(number);
                }
            }
        }
    });

    document.getElementById('output').innerText = Array.from(validNumbers).join(',');
    document.getElementById('combinedOutput').innerText = Array.from(combinedNumbers).join(',');
    document.getElementById('untextedCount').innerText = '';
    document.getElementById('textedCount').innerText = '';
}

function copyToClipboard() {
    const outputText = document.getElementById('output').innerText;
    navigator.clipboard.writeText(outputText).then(() => {
        alert('Copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ', err);
    });
}

function copyCombinedToClipboard() {
    const combinedOutputText = document.getElementById('combinedOutput').innerText;
    navigator.clipboard.writeText(combinedOutputText).then(() => {
        alert('Copied combined output to clipboard');
    }).catch(err => {
        alert('Failed to copy combined output: ', err);
    });
}

function countUntexted() {
    const untextedNumbers = document.getElementById('output').innerText.split(',').filter(num => num.trim() !== '');
    document.getElementById('untextedCount').innerText = `Untexted Count: ${untextedNumbers.length}`;
}

function countTexted() {
    const textedNumbers = document.getElementById('combinedOutput').innerText.split(',').filter(num => num.trim() !== '');
    document.getElementById('textedCount').innerText = `Texted Count: ${textedNumbers.length}`;
}






