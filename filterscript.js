function findUnique() {
    const input1 = document.getElementById('input1').value;
    const input2 = document.getElementById('input2').value;

    const arr1 = input1.split(',').map(item => item.trim());
    const arr2 = input2.split(',').map(item => item.trim());

    const uniqueSet = new Set([...arr1, ...arr2]);

    const uniqueElements = Array.from(uniqueSet).join(',');

    document.getElementById('output').value = uniqueElements;
}

function copyToClipboard() {
    const output = document.getElementById('output');
    output.select();
    output.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand('copy');

    alert('Copied to clipboard!');
}
