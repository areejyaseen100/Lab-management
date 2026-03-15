// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const totalPatientsSpan = document.getElementById('totalPatients');
const completedCountSpan = document.getElementById('completedCount');
const pendingCountSpan = document.getElementById('pendingCount');
const totalRevenueSpan = document.getElementById('totalRevenue');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const patientsList = document.getElementById('patientsList');

// ============================================
// حالة الصفحة
// ============================================
let currentFilter = 'all';
let currentUser = null;

// ============================================
// الحصول على تاريخ اليوم
// ============================================
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ============================================
// جلب جميع المرضى من قاعدة البيانات
// ============================================
function getAllPatients() {
    const patientsData = localStorage.getItem('patients');
    
    if (!patientsData) {
        return [];
    }
    
    try {
        return JSON.parse(patientsData);
    } catch (e) {
        console.error('خطأ في قراءة بيانات المرضى:', e);
        return [];
    }
}

// ============================================
// الحصول على مرضى اليوم فقط (مرتبين تصاعدياً)
// ============================================
function getTodayPatients() {
    const allPatients = getAllPatients();
    const today = getTodayDate();
    const todayPatients = [];
    
    allPatients.forEach(patient => {
        if (patient.visits && Array.isArray(patient.visits)) {
            const todayVisits = patient.visits.filter(v => v.date === today);
            
            todayVisits.forEach(visit => {
                todayPatients.push({
                    permanentId: patient.permanentId,
                    name: patient.name,
                    age: patient.age,
                    phone: patient.phone,
                    dailyId: visit.dailyId,
                    tests: visit.tests || [],
                    totalAmount: visit.totalAmount || 0,
                    status: visit.status || 'pending'
                });
            });
        }
    });
    
    // ترتيب تصاعدي حسب الرقم اليومي
    return todayPatients.sort((a, b) => {
        const aSerial = parseInt(a.dailyId.split('-')[1] || '0');
        const bSerial = parseInt(b.dailyId.split('-')[1] || '0');
        return aSerial - bSerial;
    });
}

// ============================================
// تحديث الإحصائيات
// ============================================
function updateStats() {
    const todayPatients = getTodayPatients();
    
    const total = todayPatients.length;
    const completed = todayPatients.filter(p => p.status === 'completed').length;
    const pending = todayPatients.filter(p => p.status === 'pending').length;
    const revenue = todayPatients.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    
    if (totalPatientsSpan) totalPatientsSpan.textContent = total;
    if (completedCountSpan) completedCountSpan.textContent = completed;
    if (pendingCountSpan) pendingCountSpan.textContent = pending;
    if (totalRevenueSpan) totalRevenueSpan.textContent = revenue;
}

// ============================================
// فلترة المرضى حسب البحث والحالة
// ============================================
function getFilteredPatients() {
    let todayPatients = getTodayPatients();
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    // فلترة حسب البحث
    if (searchTerm) {
        todayPatients = todayPatients.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.permanentId.toLowerCase().includes(searchTerm)
        );
    }
    
    // فلترة حسب الحالة
    if (currentFilter !== 'all') {
        todayPatients = todayPatients.filter(p => p.status === currentFilter);
    }
    
    return todayPatients;
}

// ============================================
// إنشاء بطاقة مريض
// ============================================
function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = 'patient-card';
    
    const initial = patient.name.charAt(0);
    const statusClass = patient.status === 'completed' ? 'status-completed' : 'status-pending';
    const statusText = patient.status === 'completed' ? '✅ مكتمل' : '⏳ قيد الانتظار';
    
    card.innerHTML = `
        <div class="patient-avatar">${initial}</div>
        <div class="patient-info">
            <div class="patient-name">${patient.name}</div>
            <div class="patient-details">
                <span>📋 ${patient.dailyId}</span>
                <span>📞 ${patient.phone}</span>
            </div>
        </div>
        <div class="patient-stats">
            <div class="stat-badge">
                <div class="badge-label">عدد الفحوصات</div>
                <div class="badge-value">${patient.tests.length}</div>
            </div>
            <div class="stat-badge">
                <div class="badge-label">الإجمالي</div>
                <div class="badge-value">${patient.totalAmount}</div>
            </div>
        </div>
        <div class="patient-status ${statusClass}">${statusText}</div>
    `;
    
    card.addEventListener('click', () => {
        alert(`ملف المريض ${patient.name}`);
    });
    
    return card;
}

// ============================================
// عرض المرضى
// ============================================
function displayPatients() {
    updateStats();
    
    const filteredPatients = getFilteredPatients();
    
    if (!patientsList) return;
    
    if (filteredPatients.length === 0) {
        patientsList.innerHTML = `
            <div class="no-results">
                <p>لا يوجد مرضى للعرض</p>
            </div>
        `;
        return;
    }
    
    patientsList.innerHTML = '';
    filteredPatients.forEach(patient => {
        const card = createPatientCard(patient);
        patientsList.appendChild(card);
    });
}

// ============================================
// تهيئة الصفحة
// ============================================
function initPage() {
    // التحقق من تسجيل الدخول
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        displayPatients();
        
    } catch (e) {
        console.error('خطأ:', e);
        window.location.href = 'index.html';
    }
}

// ============================================
// أحداث الفلاتر
// ============================================
if (filterBtns && filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayPatients();
        });
    });
}

// ============================================
// حدث البحث
// ============================================
if (searchInput) {
    searchInput.addEventListener('input', () => {
        displayPatients();
    });
}

// ============================================
// العودة للصفحة الرئيسية
// ============================================
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'main.html';
    });
}

// ============================================
// تهيئة الصفحة عند التحميل
// ============================================
document.addEventListener('DOMContentLoaded', initPage);