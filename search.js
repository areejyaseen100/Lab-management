// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsBox = document.getElementById('suggestions');
const searchResults = document.getElementById('searchResults');

// ============================================
// حالة الصفحة
// ============================================
let currentPatient = null;
let dateFilter = '';

// ============================================
// جلب جميع المرضى
// ============================================
function getAllPatients() {
    const patientsData = localStorage.getItem('patients');
    return patientsData ? JSON.parse(patientsData) : [];
}

// ============================================
// البحث التنبؤي
// ============================================
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm.length < 1) {
        suggestionsBox.classList.remove('show');
        return;
    }
    
    const allPatients = getAllPatients();
    const matches = allPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.permanentId.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length > 0) {
        suggestionsBox.innerHTML = '';
        matches.forEach(patient => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <div class="suggestion-name">${patient.name}</div>
                <div class="suggestion-id">🆔 ${patient.permanentId}</div>
            `;
            
            div.onclick = () => {
                searchInput.value = patient.name;
                suggestionsBox.classList.remove('show');
                currentPatient = patient;
                displayPatientResult(patient);
            };
            
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.classList.add('show');
    } else {
        suggestionsBox.classList.remove('show');
    }
});

// ============================================
// البحث
// ============================================
searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch(searchInput.value);
    }
});

function performSearch(query) {
    if (!query.trim()) return;
    
    const allPatients = getAllPatients();
    const searchTerm = query.trim().toLowerCase();
    
    const results = allPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.permanentId.toLowerCase().includes(searchTerm)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">لا توجد نتائج للبحث</div>';
        return;
    }
    
    currentPatient = results[0];
    displayPatientResult(currentPatient);
}

// ============================================
// عرض بيانات المريض
// ============================================
function displayPatientResult(patient) {
    currentPatient = patient;
    searchResults.innerHTML = '';
    
    let html = `
        <div class="patient-result-card">
            <div class="patient-result-header">
                <span class="patient-result-name">${patient.name}</span>
                <span class="patient-result-id">${patient.permanentId}</span>
            </div>
            <div class="patient-result-details">
                <div class="detail-item">
                    <span class="detail-label">العمر</span>
                    <span class="detail-value">${patient.age} سنة</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">رقم الهاتف</span>
                    <span class="detail-value">${patient.phone}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">إجمالي الزيارات</span>
                    <span class="detail-value">${patient.visits.length}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">آخر زيارة</span>
                    <span class="detail-value">${patient.visits[patient.visits.length - 1]?.date || 'لا توجد'}</span>
                </div>
            </div>
    `;
    
    const startDateValue = dateFilter ? dateFilter.split('|')[0] || '' : '';
    const endDateValue = dateFilter ? dateFilter.split('|')[1] || '' : '';
    
    html += `
        <div class="date-filter-section">
            <div class="date-filter-title">📅 فلترة حسب التاريخ</div>
            <div class="date-filter-inputs">
                <input type="date" id="startDate" class="date-input" value="${startDateValue}" placeholder="من تاريخ">
                <span class="date-separator">إلى</span>
                <input type="date" id="endDate" class="date-input" value="${endDateValue}" placeholder="إلى تاريخ">
                <button id="applyDateFilter" class="btn-filter">بحث</button>
                <button id="clearDateFilter" class="btn-filter-clear">إلغاء</button>
            </div>
        </div>
    `;
    
    html += '<div class="visits-section"><div class="visits-title">📋 سجل الزيارات</div><div class="visits-grid" id="visitsGrid">';
    
    const filteredVisits = filterVisitsByDate(patient.visits);
    
    if (filteredVisits.length > 0) {
        const sortedVisits = [...filteredVisits].reverse();
        sortedVisits.forEach(visit => {
            html += createVisitCard(patient, visit);
        });
    } else {
        html += '<div class="no-results" style="padding:20px;">لا توجد زيارات في هذا النطاق الزمني</div>';
    }
    
    html += '</div></div></div>';
    searchResults.innerHTML = html;
    
    document.getElementById('applyDateFilter').addEventListener('click', applyDateFilter);
    document.getElementById('clearDateFilter').addEventListener('click', clearDateFilter);
}

// ============================================
// دوال الفلترة
// ============================================
function filterVisitsByDate(visits) {
    if (!dateFilter || !visits) return visits || [];
    const [startDate, endDate] = dateFilter.split('|');
    
    return visits.filter(visit => {
        const visitDate = new Date(visit.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) return visitDate >= start && visitDate <= end;
        if (start) return visitDate >= start;
        if (end) return visitDate <= end;
        return true;
    });
}

function applyDateFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    dateFilter = `${startDate || ''}|${endDate || ''}`;
    if (currentPatient) displayPatientResult(currentPatient);
}

function clearDateFilter() {
    dateFilter = '';
    if (currentPatient) displayPatientResult(currentPatient);
}

// ============================================
// إنشاء بطاقة زيارة
// ============================================
function createVisitCard(patient, visit) {
    const statusClass = visit.status === 'completed' ? 'status-completed' : 'status-pending';
    const statusText = visit.status === 'completed' ? 'مكتمل' : 'قيد الانتظار';
    
    const testsHtml = visit.tests && visit.tests.length > 0
        ? visit.tests.map(test => `<span class="visit-test-badge">${test}</span>`).join('')
        : '<span style="color:#999;">لا توجد فحوصات</span>';
    
    return `
        <div class="visit-card">
            <div class="visit-header">
                <span class="visit-date">📅 ${visit.date}</span>
                <span class="visit-daily-id">${visit.dailyId}</span>
                <span class="visit-status ${statusClass}">${statusText}</span>
            </div>
            <div class="visit-tests">${testsHtml}</div>
            <div class="visit-amount">💰 ${visit.totalAmount || 0} ج.م</div>
            <div class="visit-actions">
                <button class="btn-view" onclick="viewVisit('${patient.permanentId}', '${visit.dailyId}')">عرض التفاصيل</button>
            </div>
        </div>
    `;
}

window.viewVisit = function(permanentId, dailyId) {
    alert(`عرض تفاصيل المريض ${permanentId} - الزيارة ${dailyId}`);
};

// ============================================
// إخفاء الاقتراحات
// ============================================
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.remove('show');
    }
});

// ============================================
// العودة للصفحة الرئيسية
// ============================================
backBtn.addEventListener('click', () => {
    window.location.href = 'main.html';
});

// ============================================
// التحقق من تسجيل الدخول
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}