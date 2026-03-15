// ============================================
// قائمة الفحوصات حسب الأقسام
// ============================================
const testsByCategory = {
    'Routine': [
        { id: 'R001', name: 'CBC', price: 150 },
        { id: 'R002', name: 'ESR', price: 80 },
        { id: 'R003', name: 'Blood Group', price: 100 },
    ],
    'Chemistry': [
        { id: 'C001', name: 'RBS', price: 30 },
        { id: 'C002', name: 'FBS', price: 30 },
        { id: 'C003', name: 'LFT', price: 200 },
        { id: 'C004', name: 'KFT', price: 180 },
        { id: 'C005', name: 'Lipid Profile', price: 80 },
    ],
    'Hematology': [
        { id: 'H001', name: 'PT/PTT', price: 120 },
        { id: 'H002', name: 'D-Dimer', price: 200 },
    ],
    'Microbiology': [
        { id: 'M001', name: 'Urine Culture', price: 100 },
        { id: 'M002', name: 'Stool Culture', price: 120 },
    ],
    'Hormones': [
        { id: 'HR001', name: 'TSH', price: 150 },
        { id: 'HR002', name: 'Free T3', price: 180 },
        { id: 'HR003', name: 'Free T4', price: 180 },
    ],
    'Immunology': [
        { id: 'I001', name: 'RF', price: 120 },
        { id: 'I002', name: 'CRP', price: 80 },
    ],
    'Urinalysis': [
        { id: 'U001', name: 'Urine Analysis', price: 40 },
        { id: 'U002', name: 'Microalbumin', price: 60 },
    ]
};

// ============================================
// عناصر الصفحة
// ============================================
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const selectedTestsSection = document.getElementById('selectedTestsSection');
const selectedTestsList = document.getElementById('selectedTestsList');
const totalPriceSpan = document.getElementById('totalPrice');
const backBtn = document.getElementById('backBtn');
const clearSelectedBtn = document.getElementById('clearSelectedBtn');
const confirmTestsBtn = document.getElementById('confirmTestsBtn');
const categoriesContainer = document.getElementById('categoriesContainer');
const categoryTestsSection = document.getElementById('categoryTestsSection');
const selectedCategoryTitle = document.getElementById('selectedCategoryTitle');
const categoryTestsList = document.getElementById('categoryTestsList');

// ============================================
// حالة الصفحة
// ============================================
let selectedTests = [];
let currentPatient = null;

// ============================================
// عرض معلومات المريض
// ============================================
function displayPatientInfo() {
    const patientInfoDiv = document.getElementById('patientInfo');
    const patientData = localStorage.getItem('currentPatient');
    
    if (patientData) {
        currentPatient = JSON.parse(patientData);
        patientInfoDiv.innerHTML = `
            <span><strong>المريض:</strong> ${currentPatient.name}</span>
            <span><strong>الرقم الدائم:</strong> ${currentPatient.permanentId}</span>
            <span><strong>الرقم اليومي:</strong> ${currentPatient.dailyId}</span>
        `;
    } else {
        patientInfoDiv.innerHTML = '<span>⚠️ لا توجد بيانات مريض</span>';
    }
}

// ============================================
// عرض أسماء الأقسام كأزرار
// ============================================
function displayCategories() {
    categoriesContainer.innerHTML = '';
    
    Object.keys(testsByCategory).forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        btn.onclick = () => showCategoryTests(category);
        categoriesContainer.appendChild(btn);
    });
}

// ============================================
// عرض فحوصات القسم
// ============================================
function showCategoryTests(category) {
    const tests = testsByCategory[category];
    
    selectedCategoryTitle.textContent = category;
    categoryTestsList.innerHTML = '';
    
    tests.forEach(test => {
        const isSelected = selectedTests.some(t => t.id === test.id);
        
        const testBtn = document.createElement('button');
        testBtn.className = `test-btn ${isSelected ? 'selected' : ''}`;
        testBtn.setAttribute('data-test-id', test.id);
        testBtn.setAttribute('data-test-name', test.name);
        testBtn.setAttribute('data-test-price', test.price);
        testBtn.innerHTML = `
            <span class="test-btn-name">${test.name}</span>
            <span class="test-btn-price">${test.price} ج.م</span>
        `;
        
        testBtn.onclick = () => toggleTest(test.id, test.name, test.price, testBtn);
        
        categoryTestsList.appendChild(testBtn);
    });
    
    categoryTestsSection.style.display = 'flex';
}

// ============================================
// تبديل حالة الفحص
// ============================================
function toggleTest(testId, testName, testPrice, btnElement) {
    const isSelected = selectedTests.some(t => t.id === testId);
    
    if (isSelected) {
        selectedTests = selectedTests.filter(t => t.id !== testId);
        btnElement.classList.remove('selected');
    } else {
        selectedTests.push({ id: testId, name: testName, price: testPrice });
        btnElement.classList.add('selected');
    }
    
    updateSelectedTests();
}

// ============================================
// تحديث الفحوصات المختارة
// ============================================
function updateSelectedTests() {
    if (selectedTests.length > 0) {
        selectedTestsSection.style.display = 'flex';
        
        selectedTestsList.innerHTML = '';
        selectedTests.forEach(test => {
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                <div class="selected-item-info">
                    <div class="selected-item-name">${test.name}</div>
                    <div class="selected-item-price">${test.price} ج.م</div>
                </div>
                <button class="remove-test-btn" data-test-id="${test.id}">✖</button>
            `;
            selectedTestsList.appendChild(item);
        });
        
        document.querySelectorAll('.remove-test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const testId = btn.dataset.testId;
                selectedTests = selectedTests.filter(t => t.id !== testId);
                
                document.querySelectorAll(`.test-btn[data-test-id="${testId}"]`).forEach(testBtn => {
                    testBtn.classList.remove('selected');
                });
                
                updateSelectedTests();
            });
        });
        
        const total = selectedTests.reduce((sum, test) => sum + test.price, 0);
        totalPriceSpan.textContent = total;
    } else {
        selectedTestsSection.style.display = 'none';
    }
}

// ============================================
// البحث التنبؤي
// ============================================
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm.length < 1) {
        searchSuggestions.classList.remove('show');
        return;
    }
    
    let matches = [];
    Object.keys(testsByCategory).forEach(category => {
        testsByCategory[category].forEach(test => {
            if (test.name.toLowerCase().includes(searchTerm)) {
                matches.push(test);
            }
        });
    });
    
    if (matches.length > 0) {
        searchSuggestions.innerHTML = '';
        matches.forEach(test => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <div class="suggestion-name">${test.name}</div>
                <div class="suggestion-price">${test.price} ج.م</div>
            `;
            
            div.onclick = () => {
                if (!selectedTests.some(t => t.id === test.id)) {
                    selectedTests.push({ id: test.id, name: test.name, price: test.price });
                    updateSelectedTests();
                    
                    document.querySelectorAll(`.test-btn[data-test-id="${test.id}"]`).forEach(btn => {
                        btn.classList.add('selected');
                    });
                }
                
                searchInput.value = '';
                searchSuggestions.classList.remove('show');
            };
            
            searchSuggestions.appendChild(div);
        });
        searchSuggestions.classList.add('show');
    } else {
        searchSuggestions.innerHTML = '<div class="suggestion-item">لا توجد نتائج</div>';
        searchSuggestions.classList.add('show');
    }
});

// ============================================
// إلغاء الكل
// ============================================
clearSelectedBtn.addEventListener('click', () => {
    selectedTests = [];
    
    document.querySelectorAll('.test-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    updateSelectedTests();
});

// ============================================
// تأكيد الفحوصات - العودة للصفحة الرئيسية
// ============================================
confirmTestsBtn.addEventListener('click', () => {
    if (selectedTests.length === 0) {
        return;
    }
    
    // جلب بيانات المريض الحالي
    const patientData = localStorage.getItem('currentPatient');
    if (!patientData) {
        return;
    }
    
    const currentPatient = JSON.parse(patientData);
    
    // جلب جميع المرضى
    let allPatients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // البحث عن المريض
    const patientIndex = allPatients.findIndex(p => p.permanentId === currentPatient.permanentId);
    
    if (patientIndex !== -1) {
        // الحصول على آخر زيارة للمريض
        const patient = allPatients[patientIndex];
        const lastVisitIndex = patient.visits.findIndex(v => v.dailyId === currentPatient.dailyId);
        
        if (lastVisitIndex !== -1) {
            // تحديث الزيارة الحالية
            patient.visits[lastVisitIndex].tests = selectedTests.map(t => t.name);
            patient.visits[lastVisitIndex].totalAmount = selectedTests.reduce((sum, t) => sum + t.price, 0);
            patient.visits[lastVisitIndex].status = 'pending';
            
            // حفظ التغييرات
            localStorage.setItem('patients', JSON.stringify(allPatients));
            
            // تحديث patientProfile إذا كان موجوداً
            const profilePatient = localStorage.getItem('currentPatientProfile');
            if (profilePatient) {
                const profileData = JSON.parse(profilePatient);
                if (profileData.permanentId === patient.permanentId) {
                    localStorage.setItem('currentPatientProfile', JSON.stringify(patient));
                }
            }
            
            // الانتقال المباشر للصفحة الرئيسية
            window.location.href = 'main.html';
        }
    }
});

// ============================================
// إخفاء الاقتراحات
// ============================================
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove('show');
    }
});

// ============================================
// العودة للصفحة السابقة
// ============================================
backBtn.addEventListener('click', () => {
    window.location.href = 'add_patient.html';
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
displayPatientInfo();
displayCategories();