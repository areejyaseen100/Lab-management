// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const patientInfo = document.getElementById('patientInfo');
const visitsHistory = document.getElementById('visitsHistory');
const addTestsBtn = document.getElementById('addTestsBtn');
const viewResultsBtn = document.getElementById('viewResultsBtn');
const editDataBtn = document.getElementById('editDataBtn');
const printResultsBtn = document.getElementById('printResultsBtn');

// ============================================
// الحصول على بيانات المريض
// ============================================
function getPatientData() {
    const patientData = localStorage.getItem('currentPatientProfile');
    return patientData ? JSON.parse(patientData) : null;
}

// ============================================
// حفظ بيانات المريض
// ============================================
function savePatientData(patient) {
    localStorage.setItem('currentPatientProfile', JSON.stringify(patient));
}

// ============================================
// عرض معلومات المريض
// ============================================
function displayPatientInfo() {
    const patient = getPatientData();
    if (!patient) {
        window.location.href = 'main.html';
        return;
    }

    patientInfo.innerHTML = `
        <div class="patient-name">${patient.name}</div>
        <div class="patient-details">
            <div class="detail-item">
                <span class="detail-label">الرقم الدائم</span>
                <span class="detail-value">${patient.permanentId}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">العمر</span>
                <span class="detail-value">${patient.age} سنة</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">رقم الهاتف</span>
                <span class="detail-value">${patient.phone}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">آخر زيارة</span>
                <span class="detail-value small">${patient.visits[patient.visits.length - 1]?.date || 'لا توجد'}</span>
            </div>
        </div>
    `;
}

// ============================================
// عرض سجل الزيارات
// ============================================
function displayVisitsHistory() {
    const patient = getPatientData();
    if (!patient || !patient.visits || patient.visits.length === 0) {
        visitsHistory.innerHTML = '<div class="no-visits">لا توجد زيارات سابقة</div>';
        return;
    }

    // ترتيب الزيارات من الأحدث إلى الأقدم
    const sortedVisits = [...patient.visits].reverse();

    visitsHistory.innerHTML = '';
    sortedVisits.forEach(visit => {
        const visitItem = document.createElement('div');
        visitItem.className = 'visit-item';

        const statusClass = visit.status === 'completed' ? 'status-completed' : 'status-pending';
        const statusText = visit.status === 'completed' ? 'مكتمل' : 'قيد الانتظار';

        // تجهيز عرض الفحوصات
        const testsHtml = visit.tests && visit.tests.length > 0
            ? visit.tests.map(test => `<span class="visit-test-badge">${test}</span>`).join('')
            : '<span style="color:#999;">لا توجد فحوصات</span>';

        visitItem.innerHTML = `
            <div class="visit-header">
                <span class="visit-date">📅 ${visit.date}</span>
                <span class="visit-daily-id">${visit.dailyId}</span>
                <span class="visit-status ${statusClass}">${statusText}</span>
            </div>
            <div class="visit-tests">${testsHtml}</div>
            <div class="visit-amount">💰 ${visit.totalAmount || 0} ج.م</div>
        `;

        visitsHistory.appendChild(visitItem);
    });
}

// ============================================
// إنشاء زيارة جديدة للمريض
// ============================================
function createNewVisit(patient) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    
    // حساب رقم يومي جديد
    let allPatients = JSON.parse(localStorage.getItem('patients')) || [];
    let todayCount = 0;
    
    allPatients.forEach(p => {
        p.visits.forEach(v => {
            if (v.date === today.toISOString().split('T')[0]) {
                todayCount++;
            }
        });
    });
    
    const dailyNumber = String(todayCount + 1).padStart(3, '0');
    const newDailyId = `${day}-${dailyNumber}`;

    // إضافة الزيارة الجديدة للمريض في allPatients
    const patientIndex = allPatients.findIndex(p => p.permanentId === patient.permanentId);
    
    if (patientIndex !== -1) {
        // إضافة زيارة جديدة
        allPatients[patientIndex].visits.push({
            date: today.toISOString().split('T')[0],
            dailyId: newDailyId,
            tests: [],
            totalAmount: 0,
            status: 'pending'
        });
        
        // حفظ التغييرات
        localStorage.setItem('patients', JSON.stringify(allPatients));
        
        // تحديث patientProfile ليشمل الزيارة الجديدة
        const updatedPatient = allPatients[patientIndex];
        localStorage.setItem('currentPatientProfile', JSON.stringify(updatedPatient));
        
        return updatedPatient;
    }

    return patient;
}

// ============================================
// ربط الأزرار
// ============================================
if (addTestsBtn) {
    addTestsBtn.addEventListener('click', () => {
        const patient = getPatientData();
        if (patient) {
            // إنشاء زيارة جديدة
            const updatedPatient = createNewVisit(patient);
            
            // حفظ بيانات المريض للزيارة الجديدة
            localStorage.setItem('currentPatient', JSON.stringify({
                permanentId: updatedPatient.permanentId,
                dailyId: updatedPatient.visits[updatedPatient.visits.length - 1].dailyId,
                name: updatedPatient.name
            }));
            
            // الانتقال لصفحة اختيار الفحوصات
            window.location.href = 'choose_tests.html';
        }
    });
}

if (viewResultsBtn) {
    viewResultsBtn.addEventListener('click', () => {
        const patient = getPatientData();
        if (patient) {
            alert(`قريباً - عرض نتائج فحوصات المريض ${patient.name}`);
        }
    });
}

if (editDataBtn) {
    editDataBtn.addEventListener('click', () => {
        const patient = getPatientData();
        if (patient) {
            // التأكد من حفظ بيانات المريض الحالي
            localStorage.setItem('currentPatientProfile', JSON.stringify(patient));
            window.location.href = 'edit_patient.html';
        }
    });
}

if (printResultsBtn) {
    printResultsBtn.addEventListener('click', () => {
        const patient = getPatientData();
        if (patient) {
            alert(`قريباً - طباعة نتائج المريض ${patient.name}`);
        }
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
// التحقق من تسجيل الدخول
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

// ============================================
// تهيئة الصفحة
// ============================================
displayPatientInfo();
displayVisitsHistory();