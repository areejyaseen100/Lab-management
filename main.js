// ============================================
// عناصر الصفحة
// ============================================
const userNameSpan = document.getElementById('userName');
const welcomeMessage = document.getElementById('welcomeMessage');
const welcomeSubMessage = document.getElementById('welcomeSubMessage');
const todayDateSpan = document.getElementById('todayDate');
const todayPatientsSpan = document.getElementById('todayPatients');
const pendingTestsSpan = document.getElementById('pendingTests');
const todayRevenueSpan = document.getElementById('todayRevenue');
const recentPatientsDiv = document.getElementById('recentPatients');
const logoutBtn = document.getElementById('logoutBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');

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
// تنسيق التاريخ للعرض
// ============================================
function formatDateForDisplay() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return today.toLocaleDateString('ar-SA', options);
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
// الحصول على مرضى اليوم فقط
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
    
    return todayPatients;
}

// ============================================
// حساب إجمالي الإيرادات لليوم
// ============================================
function calculateTodayRevenue() {
    const todayPatients = getTodayPatients();
    let total = 0;
    
    todayPatients.forEach(patient => {
        total += patient.totalAmount || 0;
    });
    
    return total;
}

// ============================================
// حساب الإحصائيات
// ============================================
function calculateStats() {
    const todayPatients = getTodayPatients();
    
    // عدد مرضى اليوم
    const patientCount = todayPatients.length;
    if (todayPatientsSpan) todayPatientsSpan.textContent = patientCount;
    
    // عدد الفحوصات قيد الانتظار
    const pendingCount = todayPatients.filter(p => p.status === 'pending').length;
    if (pendingTestsSpan) pendingTestsSpan.textContent = pendingCount;
    
    // إجمالي الإيرادات
    const revenue = calculateTodayRevenue();
    if (todayRevenueSpan) todayRevenueSpan.textContent = revenue;
}

// ============================================
// عرض آخر المرضى
// ============================================
function displayRecentPatients() {
    const todayPatients = getTodayPatients();
    
    if (!recentPatientsDiv) return;
    
    if (todayPatients.length === 0) {
        recentPatientsDiv.innerHTML = '<div class="no-patients">لا يوجد مرضى اليوم</div>';
        return;
    }
    
    // ترتيب المرضى من الأحدث إلى الأقدم
    const sortedPatients = [...todayPatients].sort((a, b) => {
        const aSerial = parseInt(a.dailyId.split('-')[1] || '0');
        const bSerial = parseInt(b.dailyId.split('-')[1] || '0');
        return bSerial - aSerial;
    });
    
    recentPatientsDiv.innerHTML = '';
    sortedPatients.forEach(patient => {
        const patientRow = document.createElement('div');
        patientRow.className = 'recent-patient-item';
        
        const statusClass = patient.status === 'completed' ? 'status-completed' : 'status-pending';
        const statusText = patient.status === 'completed' ? 'مكتمل' : 'قيد الانتظار';
        
        // تجهيز عرض الفحوصات
        let testsHtml = '';
        if (patient.tests && patient.tests.length > 0) {
            testsHtml = patient.tests.map(test => `<span class="test-badge">${test}</span>`).join(' ');
        } else {
            testsHtml = '<span class="no-tests">لا توجد فحوصات</span>';
        }
        
        patientRow.innerHTML = `
            <div class="recent-patient-avatar">${patient.name.charAt(0)}</div>
            <div class="recent-patient-info">
                <div class="recent-patient-name">${patient.name}</div>
                <div class="recent-patient-details">
                    <span class="detail-item">🆔 ${patient.permanentId}</span>
                    <span class="detail-item">📋 ${patient.dailyId}</span>
                </div>
                <div class="recent-patient-tests">
                    ${testsHtml}
                </div>
            </div>
            <div class="recent-patient-amount">💰 ${patient.totalAmount} ج.م</div>
            <div class="recent-patient-status ${statusClass}">${statusText}</div>
        `;
        
        patientRow.addEventListener('click', () => {
            const allPatients = getAllPatients();
            const fullPatient = allPatients.find(p => p.permanentId === patient.permanentId);
            
            if (fullPatient) {
                localStorage.setItem('currentPatientProfile', JSON.stringify(fullPatient));
                window.location.href = 'patient_profile.html';
            }
        });
        
        recentPatientsDiv.appendChild(patientRow);
    });
}

// ============================================
// قائمة الإعدادات
// ============================================
if (settingsBtn && settingsMenu) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
            settingsMenu.classList.remove('show');
        }
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
        const user = JSON.parse(userData);
        
        // عرض معلومات المستخدم
        if (userNameSpan) userNameSpan.textContent = user.fullName;
        
        // نص الترحيب المزخرف
        if (welcomeMessage) welcomeMessage.textContent = `مرحباً ${user.fullName}`;
        if (welcomeSubMessage) welcomeSubMessage.textContent = `نتمنى لك وردية سعيدة 🌸`;
        
        // عرض التاريخ
        if (todayDateSpan) todayDateSpan.textContent = formatDateForDisplay();
        
        // حساب وعرض الإحصائيات
        calculateStats();
        
        // عرض آخر المرضى
        displayRecentPatients();
        
    } catch (e) {
        console.error('خطأ في تهيئة الصفحة:', e);
        window.location.href = 'index.html';
    }
}

// ============================================
// تسجيل الخروج
// ============================================
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// ============================================
// تشغيل التهيئة عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', initPage);