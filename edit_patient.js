// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const cancelBtn = document.getElementById('cancelBtn');
const editForm = document.getElementById('editPatientForm');

const permanentIdInput = document.getElementById('permanentId');
const fullNameInput = document.getElementById('fullName');
const ageInput = document.getElementById('age');
const phoneInput = document.getElementById('phone');

// ============================================
// حالة الصفحة
// ============================================
let originalPatient = null;

// ============================================
// جلب بيانات المريض
// ============================================
function getPatientData() {
    const patientData = localStorage.getItem('currentPatientProfile');
    if (!patientData) {
        window.location.href = 'main.html';
        return null;
    }
    
    try {
        return JSON.parse(patientData);
    } catch (e) {
        console.error('خطأ في قراءة بيانات المريض:', e);
        window.location.href = 'main.html';
        return null;
    }
}

// ============================================
// عرض بيانات المريض في النموذج
// ============================================
function displayPatientData() {
    const patient = getPatientData();
    if (!patient) return;
    
    originalPatient = JSON.parse(JSON.stringify(patient)); // نسخة عميقة للحفظ
    
    permanentIdInput.value = patient.permanentId || '';
    fullNameInput.value = patient.name || '';
    ageInput.value = patient.age || '';
    phoneInput.value = patient.phone || '';
}

// ============================================
// التحقق من صحة البيانات
// ============================================
function validateForm() {
    if (!fullNameInput.value.trim()) {
        showMessage('الرجاء إدخال اسم المريض', 'error');
        return false;
    }
    
    if (!ageInput.value || ageInput.value <= 0 || ageInput.value > 150) {
        showMessage('الرجاء إدخال عمر صحيح', 'error');
        return false;
    }
    
    if (!phoneInput.value.trim()) {
        showMessage('الرجاء إدخال رقم الهاتف', 'error');
        return false;
    }
    
    return true;
}

// ============================================
// حفظ التغييرات
// ============================================
function saveChanges() {
    if (!validateForm()) return;
    
    // جلب جميع المرضى
    let allPatients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // البحث عن المريض
    const patientIndex = allPatients.findIndex(p => p.permanentId === permanentIdInput.value);
    
    if (patientIndex === -1) {
        showMessage('لم يتم العثور على المريض', 'error');
        return;
    }
    
    // تحديث البيانات
    allPatients[patientIndex].name = fullNameInput.value.trim();
    allPatients[patientIndex].age = parseInt(ageInput.value);
    allPatients[patientIndex].phone = phoneInput.value.trim();
    
    // حفظ في localStorage
    localStorage.setItem('patients', JSON.stringify(allPatients));
    
    // تحديث currentPatientProfile إذا كان مفتوحاً
    localStorage.setItem('currentPatientProfile', JSON.stringify(allPatients[patientIndex]));
    
    // رسالة نجاح
    showMessage('✅ تم تحديث بيانات المريض بنجاح', 'success');
    
    // العودة لصفحة الملف الشخصي بعد ثانية
    setTimeout(() => {
        window.location.href = 'patient_profile.html';
    }, 1000);
}

// ============================================
// عرض الرسائل
// ============================================
function showMessage(text, type) {
    // إزالة أي رسالة سابقة
    const oldMsg = document.querySelector('.message');
    if (oldMsg) oldMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    
    // إدراج الرسالة بعد العنوان
    const headerBar = document.querySelector('.header-bar');
    headerBar.insertAdjacentElement('afterend', msg);
    
    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// ============================================
// أحداث الصفحة
// ============================================

// حفظ التغييرات
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveChanges();
});

// إلغاء والعودة
cancelBtn.addEventListener('click', () => {
    window.location.href = 'patient_profile.html';
});

backBtn.addEventListener('click', () => {
    window.location.href = 'patient_profile.html';
});

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
displayPatientData();