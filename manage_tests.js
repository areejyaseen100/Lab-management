// ============================================
// بيانات المختبر الحقيقية (مبنية على مراجع طبية)
// ============================================

// الأقسام الرئيسية في المختبر
const defaultCategories = [
    { id: 1, name: 'Hematology', description: 'أمراض الدم - تحاليل خلايا الدم والتجلط' },
    { id: 2, name: 'Clinical Chemistry', description: 'الكيمياء السريرية - وظائف الأعضاء' },
    { id: 3, name: 'Immunology', description: 'المناعة - الأجسام المضادة والحساسية' },
    { id: 4, name: 'Microbiology', description: 'الميكروبيولوجي - المزارع والحساسية' },
    { id: 5, name: 'Hormones', description: 'الهرمونات - الغدد الصماء' },
    { id: 6, name: 'Urinalysis', description: 'تحليل البول' },
    { id: 7, name: 'Coagulation', description: 'تجلط الدم' },
    { id: 8, name: 'Tumor Markers', description: 'دلالات الأورام' }
];

// الفحوصات الرئيسية (Main Investigations) - بيانات حقيقية
const defaultInvestigations = [
    // Hematology
    { id: 1, categoryId: 1, name: 'Complete Blood Count (CBC)', price: 150, unit: '-', normalRange: 'انظر التقرير' },
    { id: 2, categoryId: 1, name: 'Hemoglobin (Hb)', price: 30, unit: 'g/dL', normalRange: '13.5-17.5 (رجال), 12.0-15.5 (نساء)' },
    { id: 3, categoryId: 1, name: 'Hematocrit (HCT)', price: 25, unit: '%', normalRange: '40-54 (رجال), 36-46 (نساء)' },
    { id: 4, categoryId: 1, name: 'RBC Count', price: 25, unit: '×10¹²/L', normalRange: '4.5-5.5' },
    { id: 5, categoryId: 1, name: 'WBC Count', price: 25, unit: '×10⁹/L', normalRange: '4.0-11.0' },
    { id: 6, categoryId: 1, name: 'Platelet Count', price: 30, unit: '×10⁹/L', normalRange: '150-450' },
    { id: 7, categoryId: 1, name: 'ESR', price: 40, unit: 'mm/hr', normalRange: '0-15 (رجال), 0-20 (نساء)' },
    { id: 8, categoryId: 1, name: 'Blood Group & Rh', price: 100, unit: '-', normalRange: 'A, B, AB, O +/=' },
    
    // Clinical Chemistry
    { id: 9, categoryId: 2, name: 'Random Blood Sugar (RBS)', price: 30, unit: 'mg/dL', normalRange: '70-140' },
    { id: 10, categoryId: 2, name: 'Fasting Blood Sugar (FBS)', price: 30, unit: 'mg/dL', normalRange: '70-110' },
    { id: 11, categoryId: 2, name: 'HbA1c', price: 120, unit: '%', normalRange: '<5.7' },
    { id: 12, categoryId: 2, name: 'ALT (SGPT)', price: 50, unit: 'U/L', normalRange: '10-40' },
    { id: 13, categoryId: 2, name: 'AST (SGOT)', price: 50, unit: 'U/L', normalRange: '10-40' },
    { id: 14, categoryId: 2, name: 'ALP', price: 50, unit: 'U/L', normalRange: '30-120' },
    { id: 15, categoryId: 2, name: 'GGT', price: 50, unit: 'U/L', normalRange: '8-61' },
    { id: 16, categoryId: 2, name: 'Total Protein', price: 40, unit: 'g/dL', normalRange: '6.4-8.3' },
    { id: 17, categoryId: 2, name: 'Albumin', price: 40, unit: 'g/dL', normalRange: '3.5-5.0' },
    { id: 18, categoryId: 2, name: 'Globulin', price: 40, unit: 'g/dL', normalRange: '2.0-3.5' },
    { id: 19, categoryId: 2, name: 'Creatinine', price: 40, unit: 'mg/dL', normalRange: '0.6-1.2' },
    { id: 20, categoryId: 2, name: 'Urea', price: 40, unit: 'mg/dL', normalRange: '10-50' },
    { id: 21, categoryId: 2, name: 'Uric Acid', price: 40, unit: 'mg/dL', normalRange: '3.5-7.2' },
    { id: 22, categoryId: 2, name: 'Total Cholesterol', price: 40, unit: 'mg/dL', normalRange: '<200' },
    { id: 23, categoryId: 2, name: 'Triglycerides', price: 40, unit: 'mg/dL', normalRange: '<150' },
    { id: 24, categoryId: 2, name: 'HDL Cholesterol', price: 50, unit: 'mg/dL', normalRange: '>40 (رجال), >50 (نساء)' },
    { id: 25, categoryId: 2, name: 'LDL Cholesterol', price: 50, unit: 'mg/dL', normalRange: '<100' },
    { id: 26, categoryId: 2, name: 'VLDL Cholesterol', price: 40, unit: 'mg/dL', normalRange: '5-40' },
    { id: 27, categoryId: 2, name: 'Sodium (Na)', price: 50, unit: 'mmol/L', normalRange: '135-145' },
    { id: 28, categoryId: 2, name: 'Potassium (K)', price: 50, unit: 'mmol/L', normalRange: '3.5-5.1' },
    { id: 29, categoryId: 2, name: 'Chloride (Cl)', price: 50, unit: 'mmol/L', normalRange: '98-107' },
    { id: 30, categoryId: 2, name: 'Calcium (Ca)', price: 50, unit: 'mg/dL', normalRange: '8.5-10.2' },
    { id: 31, categoryId: 2, name: 'Phosphorus', price: 50, unit: 'mg/dL', normalRange: '2.5-4.5' },
    { id: 32, categoryId: 2, name: 'Magnesium', price: 60, unit: 'mg/dL', normalRange: '1.7-2.2' },
    { id: 33, categoryId: 2, name: 'Iron', price: 60, unit: 'µg/dL', normalRange: '60-170' },
    { id: 34, categoryId: 2, name: 'TIBC', price: 70, unit: 'µg/dL', normalRange: '250-450' },
    { id: 35, categoryId: 2, name: 'Ferritin', price: 100, unit: 'ng/mL', normalRange: '20-300' },
    
    // Immunology
    { id: 36, categoryId: 3, name: 'CRP', price: 80, unit: 'mg/L', normalRange: '<6' },
    { id: 37, categoryId: 3, name: 'Rheumatoid Factor (RF)', price: 100, unit: 'IU/mL', normalRange: '<20' },
    { id: 38, categoryId: 3, name: 'ASO Titer', price: 100, unit: 'IU/mL', normalRange: '<200' },
    { id: 39, categoryId: 3, name: 'ANA', price: 200, unit: '-', normalRange: 'Negative' },
    { id: 40, categoryId: 3, name: 'Anti-dsDNA', price: 250, unit: 'IU/mL', normalRange: '<30' },
    { id: 41, categoryId: 3, name: 'C3 Complement', price: 150, unit: 'mg/dL', normalRange: '90-180' },
    { id: 42, categoryId: 3, name: 'C4 Complement', price: 150, unit: 'mg/dL', normalRange: '10-40' },
    
    // Microbiology
    { id: 43, categoryId: 4, name: 'Urine Culture', price: 120, unit: '-', normalRange: 'Negative' },
    { id: 44, categoryId: 4, name: 'Stool Culture', price: 150, unit: '-', normalRange: 'Negative' },
    { id: 45, categoryId: 4, name: 'Blood Culture', price: 300, unit: '-', normalRange: 'Negative' },
    { id: 46, categoryId: 4, name: 'Throat Swab', price: 100, unit: '-', normalRange: 'Negative' },
    { id: 47, categoryId: 4, name: 'Sputum Culture', price: 150, unit: '-', normalRange: 'Negative' },
    { id: 48, categoryId: 4, name: 'H.pylori Antigen', price: 150, unit: '-', normalRange: 'Negative' },
    
    // Hormones
    { id: 49, categoryId: 5, name: 'TSH', price: 150, unit: 'µIU/mL', normalRange: '0.4-4.0' },
    { id: 50, categoryId: 5, name: 'Free T3', price: 180, unit: 'pg/mL', normalRange: '2.3-4.2' },
    { id: 51, categoryId: 5, name: 'Free T4', price: 180, unit: 'ng/dL', normalRange: '0.8-1.8' },
    { id: 52, categoryId: 5, name: 'Total T3', price: 150, unit: 'ng/dL', normalRange: '80-200' },
    { id: 53, categoryId: 5, name: 'Total T4', price: 150, unit: 'µg/dL', normalRange: '5.0-12.0' },
    { id: 54, categoryId: 5, name: 'Prolactin', price: 160, unit: 'ng/mL', normalRange: '2-18' },
    { id: 55, categoryId: 5, name: 'LH', price: 160, unit: 'mIU/mL', normalRange: 'يعتمد على المرحلة' },
    { id: 56, categoryId: 5, name: 'FSH', price: 160, unit: 'mIU/mL', normalRange: 'يعتمد على المرحلة' },
    { id: 57, categoryId: 5, name: 'Testosterone', price: 200, unit: 'ng/dL', normalRange: '250-1100 (رجال)' },
    { id: 58, categoryId: 5, name: 'Estradiol', price: 200, unit: 'pg/mL', normalRange: 'يعتمد على المرحلة' },
    { id: 59, categoryId: 5, name: 'Progesterone', price: 200, unit: 'ng/mL', normalRange: 'يعتمد على المرحلة' },
    { id: 60, categoryId: 5, name: 'Cortisol', price: 180, unit: 'µg/dL', normalRange: '5-25' },
    
    // Urinalysis
    { id: 61, categoryId: 6, name: 'Urine Analysis', price: 50, unit: '-', normalRange: 'انظر التقرير' },
    { id: 62, categoryId: 6, name: 'Microalbumin', price: 70, unit: 'mg/L', normalRange: '<30' },
    { id: 63, categoryId: 6, name: '24h Urine Protein', price: 120, unit: 'g/24h', normalRange: '<0.15' },
    { id: 64, categoryId: 6, name: 'Urine Pregnancy Test', price: 50, unit: '-', normalRange: 'Negative' },
    
    // Coagulation
    { id: 65, categoryId: 7, name: 'PT', price: 80, unit: 'sec', normalRange: '11-13.5' },
    { id: 66, categoryId: 7, name: 'PTT', price: 80, unit: 'sec', normalRange: '25-35' },
    { id: 67, categoryId: 7, name: 'INR', price: 50, unit: '-', normalRange: '0.8-1.2' },
    { id: 68, categoryId: 7, name: 'D-Dimer', price: 200, unit: 'ng/mL', normalRange: '<500' },
    { id: 69, categoryId: 7, name: 'Fibrinogen', price: 150, unit: 'mg/dL', normalRange: '200-400' },
    
    // Tumor Markers
    { id: 70, categoryId: 8, name: 'AFP', price: 250, unit: 'ng/mL', normalRange: '<10' },
    { id: 71, categoryId: 8, name: 'CEA', price: 250, unit: 'ng/mL', normalRange: '<5' },
    { id: 72, categoryId: 8, name: 'CA 19-9', price: 300, unit: 'U/mL', normalRange: '<37' },
    { id: 73, categoryId: 8, name: 'CA 15-3', price: 300, unit: 'U/mL', normalRange: '<31' },
    { id: 74, categoryId: 8, name: 'CA 125', price: 300, unit: 'U/mL', normalRange: '<35' },
    { id: 75, categoryId: 8, name: 'PSA', price: 200, unit: 'ng/mL', normalRange: '<4' },
    { id: 76, categoryId: 8, name: 'Free PSA', price: 250, unit: 'ng/mL', normalRange: '<0.93' }
];

// البروفايلات (Profile Investigations) - مجموعات الفحوصات
const defaultProfiles = [
    { 
        id: 1, 
        categoryId: 2, 
        name: 'Liver Function Test (LFT)', 
        price: 400, 
        tests: [12, 13, 14, 15, 16, 17, 18] // ALT, AST, ALP, GGT, Total Protein, Albumin, Globulin
    },
    { 
        id: 2, 
        categoryId: 2, 
        name: 'Kidney Function Test (KFT)', 
        price: 250, 
        tests: [19, 20, 21, 27, 28, 29] // Creatinine, Urea, Uric Acid, Sodium, Potassium, Chloride
    },
    { 
        id: 3, 
        categoryId: 2, 
        name: 'Lipid Profile', 
        price: 300, 
        tests: [22, 23, 24, 25, 26] // Total Cholesterol, Triglycerides, HDL, LDL, VLDL
    },
    { 
        id: 4, 
        categoryId: 2, 
        name: 'Iron Profile', 
        price: 350, 
        tests: [33, 34, 35] // Iron, TIBC, Ferritin
    },
    { 
        id: 5, 
        categoryId: 5, 
        name: 'Thyroid Profile', 
        price: 500, 
        tests: [49, 50, 51] // TSH, Free T3, Free T4
    },
    { 
        id: 6, 
        categoryId: 5, 
        name: 'Complete Thyroid Profile', 
        price: 800, 
        tests: [49, 50, 51, 52, 53] // TSH, Free T3, Free T4, Total T3, Total T4
    },
    { 
        id: 7, 
        categoryId: 7, 
        name: 'Coagulation Profile', 
        price: 350, 
        tests: [65, 66, 67, 69] // PT, PTT, INR, Fibrinogen
    },
    { 
        id: 8, 
        categoryId: 1, 
        name: 'Complete Blood Count', 
        price: 150, 
        tests: [1] // CBC (يتضمن كل شيء)
    }
];

// ============================================
// تحميل البيانات
// ============================================
let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories;
let investigations = JSON.parse(localStorage.getItem('investigations')) || defaultInvestigations;
let profiles = JSON.parse(localStorage.getItem('profiles')) || defaultProfiles;

// حفظ البيانات في localStorage إذا كانت أول مرة
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(categories));
}
if (!localStorage.getItem('investigations')) {
    localStorage.setItem('investigations', JSON.stringify(investigations));
}
if (!localStorage.getItem('profiles')) {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// ============================================
// باقي الكود (كما هو من الملف السابق مع إضافة دوال عرض تفاصيل البروفايل)
// ============================================

// ... (نفس الكود السابق مع إضافة الدوال التالية)

// ============================================
// عرض تفاصيل البروفايل
// ============================================
function showProfileDetails(profileId) {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const category = categories.find(c => c.id === profile.categoryId);
    const profileTests = investigations.filter(inv => profile.tests.includes(inv.id));
    
    let testsHtml = '';
    profileTests.forEach(test => {
        testsHtml += `
            <div class="test-item">
                <div class="test-name">${test.name}</div>
                <div class="test-price">${test.price} ج.م</div>
            </div>
        `;
    });
    
    document.getElementById('profileDetailsTitle').textContent = profile.name;
    document.getElementById('profileDetailsContent').innerHTML = `
        <div class="profile-info">
            <p><strong>القسم:</strong> ${category ? category.name : 'غير محدد'}</p>
            <p><strong>السعر الإجمالي:</strong> ${profile.price} ج.م</p>
            <p><strong>عدد الفحوصات:</strong> ${profile.tests.length}</p>
        </div>
        <div class="profile-tests-list">
            <h4>الفحوصات المضمنة:</h4>
            ${testsHtml}
        </div>
    `;
    
    document.getElementById('profileDetailsModal').classList.add('show');
}

window.closeProfileDetailsModal = () => {
    document.getElementById('profileDetailsModal').classList.remove('show');
};

// تعديل عرض البروفايلات لجعلها قابلة للنقر
function displayProfiles() {
    profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    
    if (profiles.length === 0) {
        profilesList.innerHTML = '<div class="no-items">لا توجد بروفايلات</div>';
        return;
    }
    
    profilesList.innerHTML = '';
    profiles.forEach(profile => {
        const category = categories.find(c => c.id === profile.categoryId);
        const item = document.createElement('div');
        item.className = 'profile-item';
        item.onclick = () => showProfileDetails(profile.id);
        item.innerHTML = `
            <div class="item-info">
                <div class="item-name">${profile.name}</div>
                <div class="item-details">
                    <span>📂 ${category ? category.name : 'غير محدد'}</span>
                    <span>💰 ${profile.price} ج.م</span>
                    <span>🔬 ${profile.tests ? profile.tests.length : 0} فحص</span>
                </div>
            </div>
            <div class="item-actions" onclick="event.stopPropagation()">
                <button class="btn-edit" onclick="editProfile(${profile.id})">✏️ تعديل</button>
                <button class="btn-delete" onclick="deleteProfile(${profile.id})">🗑️ حذف</button>
            </div>
        `;
        profilesList.appendChild(item);
    });
}