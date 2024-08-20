let companies = JSON.parse(localStorage.getItem('companies')) || [];
let payPerReview = parseFloat(localStorage.getItem('payPerReview')) || 0;

function addCompany() {
    const companyName = prompt("Enter the company name:");
    const reviewsOrdered = parseInt(prompt("Enter the number of reviews ordered:"));
    if (companyName && !isNaN(reviewsOrdered)) {
        const company = {
            name: companyName,
            dailyReviewCount: 0,
            reviewsOrdered: reviewsOrdered,
            totalReviewCount: 0
        };
        companies.push(company);
        saveData();
        renderCompanies();
    }
}

function incrementReviewCount(index) {
    companies[index].dailyReviewCount++;
    companies[index].totalReviewCount++;
    saveData();
    renderCompanies();
}

function decrementReviewCount(index) {
    if (companies[index].dailyReviewCount > 0) {
        companies[index].dailyReviewCount--;
        companies[index].totalReviewCount--;
        saveData();
        renderCompanies();
    }
}

function calculateDailyTotal() {
    let totalReviewsToday = companies.reduce((total, company) => total + company.dailyReviewCount, 0);
    const totalEarningsToday = totalReviewsToday * payPerReview;
    alert(`Total daily reviews: ${totalReviewsToday}\nTotal daily earnings: $${totalEarningsToday.toFixed(2)}`);
    renderDailySummary(totalReviewsToday, totalEarningsToday);
}

function renderDailySummary(totalReviewsToday, totalEarningsToday) {
    const summaryDiv = document.getElementById('daily-summary');
    summaryDiv.innerHTML = `Total Daily Reviews: ${totalReviewsToday} | Total Daily Earnings: $${totalEarningsToday.toFixed(2)}`;
}

function copyDataToCSV() {
    let csvData = "name,dailyReviewCount,reviewsOrdered,totalReviewCount\n";
    companies.forEach(company => {
        csvData += `${company.name},${company.dailyReviewCount},${company.reviewsOrdered},${company.totalReviewCount}\n`;
    });
    navigator.clipboard.writeText(csvData).then(() => {
        alert("Data copied to clipboard");
    }).catch(err => {
        alert("Failed to copy data: " + err);
    });
}

function loadDataFromCSV() {
    const csvInput = document.getElementById('csv-input').value;
    const rows = csvInput.split('\n').slice(1); // Skip the header row
    companies = rows.map(row => {
        const [name, dailyReviewCount, reviewsOrdered, totalReviewCount] = row.split(',');
        return {
            name,
            dailyReviewCount: parseInt(dailyReviewCount),
            reviewsOrdered: parseInt(reviewsOrdered),
            totalReviewCount: parseInt(totalReviewCount)
        };
    }).filter(company => company.name); // Remove any empty rows
    saveData();
    renderCompanies();
}

function updatePayPerReview() {
    const newPayPerReview = parseFloat(document.getElementById('pay-per-review').value);
    if (!isNaN(newPayPerReview) && newPayPerReview > 0) {
        payPerReview = newPayPerReview;
        localStorage.setItem('payPerReview', payPerReview);
        alert(`Pay per review set to $${payPerReview.toFixed(2)}`);
    } else {
        alert("Please enter a valid number for pay per review.");
    }
}

function saveData() {
    localStorage.setItem('companies', JSON.stringify(companies));
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
        dailyReviewCount.innerText = `No. of Reviews Today: ${company.dailyReviewCount}`;

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressInner = document.createElement('div');
        progressInner.className = 'progress-bar-inner';
        progressInner.style.width = `${(company.totalReviewCount / company.reviewsOrdered) * 100}%`;
        progressBar.appendChild(progressInner);

        const reviewsOrdered = document.createElement('div');
        reviewsOrdered.innerText = `Order Progress: ${company.totalReviewCount}/${company.reviewsOrdered}`;

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
        companyDiv.appendChild(progressBar);
        companyDiv.appendChild(reviewsOrdered);
        companyDiv.appendChild(buttonGroup);

        companyList.appendChild(companyDiv);
    });
    // Update daily summary
    const totalReviewsToday = companies.reduce((total, company) => total + company.dailyReviewCount, 0);
    const totalEarningsToday = totalReviewsToday * payPerReview;
    renderDailySummary(totalReviewsToday, totalEarningsToday);
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

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    renderCompanies();
});


function listDailyReviews() {
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'daily-summary-list';
    summaryDiv.innerHTML = '<h2>Daily Reviews Summary</h2>';

    let totalToPay = 0;

    companies.forEach(company => {
        const companySummary = document.createElement('div');
        companySummary.className = 'company-summary';

        const companyName = document.createElement('div');
        companyName.innerText = `${company.name}`;

        const reviewsDoneToday = document.createElement('div');
        reviewsDoneToday.innerText = `Number of Reviews Done Today: ${company.dailyReviewCount}`;

        const orderProgress = document.createElement('div');
        orderProgress.innerText = `Progress of Order: ${company.totalReviewCount}/${company.reviewsOrdered} (${((company.totalReviewCount / company.reviewsOrdered) * 100).toFixed(2)}%)`;

        companySummary.appendChild(companyName);
        companySummary.appendChild(reviewsDoneToday);
        companySummary.appendChild(orderProgress);
        summaryDiv.appendChild(companySummary);

        totalToPay += company.dailyReviewCount * payPerReview;
    });

    const totalPayDiv = document.createElement('div');
    totalPayDiv.className = 'total-pay';
    totalPayDiv.innerText = `Total To Pay: $${totalToPay.toFixed(2)}`;
    summaryDiv.appendChild(totalPayDiv);

    const existingSummary = document.querySelector('.daily-summary-list');
    if (existingSummary) {
        existingSummary.remove(); // Remove existing summary if already present
    }

    document.body.appendChild(summaryDiv); // Append summary to the bottom of the page
}

function resetDailyCounts() {
    companies.forEach(company => {
        company.dailyReviewCount = 0;
    });
    saveData();
    renderCompanies();
    alert('Daily counts have been reset.');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCompanies();
});




