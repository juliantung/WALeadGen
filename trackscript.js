let companies = [];

function addCompany() {
    const companyName = prompt("Enter the company name:");
    const maxDailyReviews = parseInt(prompt("Enter the maximum daily review count:"));
    if (companyName && !isNaN(maxDailyReviews)) {
        const company = {
            name: companyName,
            dailyReviewCount: 0,
            maxDailyReviewCount: maxDailyReviews,
            totalReviewCount: 0
        };
        companies.push(company);
        renderCompanies();
    }
}

function incrementReviewCount(index) {
    companies[index].dailyReviewCount++;
    companies[index].totalReviewCount++;
    renderCompanies();
}

function decrementReviewCount(index) {
    if (companies[index].dailyReviewCount > 0) {
        companies[index].dailyReviewCount--;
        companies[index].totalReviewCount--;
        renderCompanies();
    }
}

function calculateDailyTotal() {
    let totalReviews = 0;
    companies.forEach(company => {
        totalReviews += company.dailyReviewCount;
    });
    const totalEarnings = totalReviews * 1.50;
    alert(`Total daily earnings: $${totalEarnings.toFixed(2)}`);
}

function copyDataToCSV(resetDailyCount) {
    let csvData = "name,dailyReviewCount,maxDailyReviewCount,totalReviewCount\n";
    companies.forEach(company => {
        const dailyReviewCount = resetDailyCount ? 0 : company.dailyReviewCount;
        csvData += `${company.name},${dailyReviewCount},${company.maxDailyReviewCount},${company.totalReviewCount}\n`;
    });
    navigator.clipboard.writeText(csvData).then(() => {
        alert("Data copied to clipboard");
    }).catch(err => {
        alert("Failed to copy data: ", err);
    });
}

function loadDataFromCSV() {
    const csvInput = document.getElementById('csv-input').value;
    const rows = csvInput.split('\n').slice(1); // Skip the header row
    companies = rows.map(row => {
        const [name, dailyReviewCount, maxDailyReviewCount, totalReviewCount] = row.split(',');
        return {
            name,
            dailyReviewCount: parseInt(dailyReviewCount),
            maxDailyReviewCount: parseInt(maxDailyReviewCount),
            totalReviewCount: parseInt(totalReviewCount)
        };
    }).filter(company => company.name); // Remove any empty rows
    renderCompanies();
}

function renderCompanies() {
    const companyList = document.getElementById('company-list');
    companyList.innerHTML = '';
    companies.forEach((company, index) => {
        const companyDiv = document.createElement('div');
        companyDiv.className = 'company';

        const companyName = document.createElement('div');
        companyName.className = 'company-name';
        companyName.innerText = company.name;

        const dailyReviewCount = document.createElement('div');
        dailyReviewCount.innerText = `Daily Review Count: ${company.dailyReviewCount}/${company.maxDailyReviewCount}`;

        const weeklyReviewCount = document.createElement('div');
        weeklyReviewCount.innerText = `Weekly Review Count: ${company.totalReviewCount}/${company.maxDailyReviewCount * 7}`;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const incrementButton = document.createElement('button');
        incrementButton.className = 'button primary';
        incrementButton.innerText = 'Increment';
        incrementButton.onclick = () => incrementReviewCount(index);

        const decrementButton = document.createElement('button');
        decrementButton.className = 'button secondary';
        decrementButton.innerText = 'Decrement';
        decrementButton.onclick = () => decrementReviewCount(index);

        buttonGroup.appendChild(incrementButton);
        buttonGroup.appendChild(decrementButton);

        companyDiv.appendChild(companyName);
        companyDiv.appendChild(dailyReviewCount);
        companyDiv.appendChild(weeklyReviewCount);
        companyDiv.appendChild(buttonGroup);

        companyList.appendChild(companyDiv);
    });
}

function searchCompanies() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    const companyDivs = document.getElementsByClassName('company');

    Array.from(companyDivs).forEach(div => {
        const companyName = div.getElementsByClassName('company-name')[0].innerText.toLowerCase();
        if (companyName.includes(searchTerm)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCompanies();
});












