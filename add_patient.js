// ============================================
// بيانات المرضى (محاكاة لقاعدة البيانات)
// ============================================
let patients = JSON.parse(localStorage.getItem('patients')) || [];

function savePatients() {
    localStorage.setItem('patients', JSON.stringify(patients));
}

// ============================================
// توليد رقم يومي جديد
// ============================================
function generateDailyId() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    
    let todayCount = 0;
    patients.forEach(p => {
        p.visits.forEach(v => {
            if (v.date === today.toISOString().split('T')[0]) {
                todayCount++;
            }
        });
    });
    
    const dailyNumber = String(todayCount + 1).padStart(3, '0');
    return `${day}-${dailyNumber}`;
}

// ============================================
// توليد رقم دائم جديد
// ============================================
function generatePermanentId() {
    const lastId = patients.length > 0 
        ? Math.max(...patients.map(p => parseInt(p.permanentId.substring(1)))) 
        : 0;
    return 'P' + String(lastId + 1).padStart(3, '0');
}

// ============================================
// عناصر الصفحة
// ============================================
const fullNameInput = document.getElementById('fullName');
const ageInput = document.getElementById('age');
const phoneInput = document.getElementById('phone');
const permanentIdInput = document.getElementById('permanentId');
const dailyIdInput = document.getElementById('dailyId');
const suggestionsBox = document.getElementById('suggestions');
const patientForm = document.getElementById('patientForm');
const backToMainBtn = document.getElementById('backToMainBtn');
const clearFormBtn = document.getElementById('clearFormBtn');

// توليد الأرقام التلقائية فور تحميل الصفحة
window.onload = function() {
    permanentIdInput.value = generatePermanentId();
    dailyIdInput.value = generateDailyId();
    
    // التحقق من تسجيل الدخول
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
};

// ============================================
// البحث الذكي (نفس حقل الاسم)
// ============================================
fullNameInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm.length < 1) {
        suggestionsBox.classList.remove('show');
        return;
    }
    
    // البحث في المرضى
    const matches = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length > 0) {
        suggestionsBox.innerHTML = '';
        matches.forEach(patient => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            const lastVisit = patient.visits && patient.visits.length > 0 
                ? patient.visits[patient.visits.length - 1] 
                : null;
            
            div.innerHTML = `
                <div class="suggestion-name">${patient.name}</div>
                <div class="suggestion-info">
                    الرقم الدائم: ${patient.permanentId} | 
                    آخر زيارة: ${lastVisit ? lastVisit.date + ' (' + lastVisit.dailyId + ')' : 'لا توجد زيارات سابقة'}
                </div>
            `;
            
            div.onclick = () => selectPatient(patient);
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.classList.add('show');
    } else {
        suggestionsBox.classList.remove('show');
    }
});

// ============================================
// اختيار مريض من القائمة
// ============================================
function selectPatient(patient) {
    fullNameInput.value = patient.name;
    ageInput.value = patient.age;
    phoneInput.value = patient.phone;
    permanentIdInput.value = patient.permanentId;
    dailyIdInput.value = generateDailyId();
    
    suggestionsBox.classList.remove('show');
}

// ============================================
// إرسال النموذج - بدون رسائل وانتقال مباشر
// ============================================
patientForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!fullNameInput.value.trim()) {
        return;
    }
    
    if (!ageInput.value || !phoneInput.value) {
        return;
    }
    
    // البحث عن المريض بالرقم الدائم
    let patient = patients.find(p => p.permanentId === permanentIdInput.value);
    
    if (patient) {
        // مريض موجود → تحديث البيانات وإضافة زيارة
        patient.name = fullNameInput.value.trim();
        patient.age = parseInt(ageInput.value);
        patient.phone = phoneInput.value;
        
        if (!patient.visits) patient.visits = [];
        
        patient.visits.push({
            date: new Date().toISOString().split('T')[0],
            dailyId: dailyIdInput.value,
            tests: [],
            totalAmount: 0,
            status: 'pending'
        });
    } else {
        // مريض جديد
        patient = {
            permanentId: permanentIdInput.value,
            name: fullNameInput.value.trim(),
            age: parseInt(ageInput.value),
            phone: phoneInput.value,
            visits: [{
                date: new Date().toISOString().split('T')[0],
                dailyId: dailyIdInput.value,
                tests: [],
                totalAmount: 0,
                status: 'pending'
            }]
        };
        patients.push(patient);
    }
    
    savePatients();
    
    // حفظ بيانات المريض الحالي للصفحة التالية
    localStorage.setItem('currentPatient', JSON.stringify({
        permanentId: patient.permanentId,
        dailyId: dailyIdInput.value,
        name: patient.name
    }));
    
    // الانتقال المباشر لصفحة الفحوصات
    window.location.href = 'choose_tests.html';
});

// ============================================
// دالة تفريغ الحقول
// ============================================
function clearForm() {
    fullNameInput.value = '';
    ageInput.value = '';
    phoneInput.value = '';
    permanentIdInput.value = generatePermanentId();
    dailyIdInput.value = generateDailyId();
    suggestionsBox.classList.remove('show');
    fullNameInput.focus();
}

// ============================================
// إخفاء الاقتراحات عند النقر خارجها
// ============================================
document.addEventListener('click', function(e) {
    if (!fullNameInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.classList.remove('show');
    }
});

// ============================================
// إظهار الاقتراحات عند التركيز على حقل الاسم
// ============================================
fullNameInput.addEventListener('focus', function() {
    if (this.value.trim().length > 0) {
        const event = new Event('input');
        this.dispatchEvent(event);
    }
});

// ============================================
// ربط الأزرار
// ============================================
if (backToMainBtn) {
    backToMainBtn.addEventListener('click', () => {
        window.location.href = 'main.html';
    });
}

if (clearFormBtn) {
    clearFormBtn.addEventListener('click', clearForm);
}