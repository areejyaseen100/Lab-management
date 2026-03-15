// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const accountForm = document.getElementById('accountForm');
const accountId = document.getElementById('accountId');
const fullName = document.getElementById('fullName');
const username = document.getElementById('username');
const password = document.getElementById('password');
const role = document.getElementById('role');

// ============================================
// جلب جميع المستخدمين
// ============================================
function getAllUsers() {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
}

// ============================================
// حفظ المستخدمين
// ============================================
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ============================================
// تحديد وضع الصفحة (إضافة/تعديل)
// ============================================
function getMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode');
}

// ============================================
// تحميل بيانات المستخدم للتعديل
// ============================================
function loadUserForEdit() {
    const editUserData = localStorage.getItem('editUserData');
    if (!editUserData) return;

    const user = JSON.parse(editUserData);

    if (user) {
        formTitle.textContent = '✏️ تعديل الحساب';
        accountId.value = user.id;
        fullName.value = user.fullName;
        username.value = user.username;
        password.value = user.password;
        role.value = user.role;
    }
}

// ============================================
// التحقق من صحة البيانات
// ============================================
function validateForm() {
    if (!fullName.value.trim()) {
        alert('❌ الرجاء إدخال الاسم الكامل');
        return false;
    }

    if (!username.value.trim()) {
        alert('❌ الرجاء إدخال اسم المستخدم');
        return false;
    }

    if (!password.value.trim() || password.value.length < 6) {
        alert('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return false;
    }

    if (!role.value) {
        alert('❌ الرجاء اختيار الصلاحية');
        return false;
    }

    // التحقق من عدم تكرار اسم المستخدم
    const users = getAllUsers();
    const editId = accountId.value;
    const existingUser = users.find(u => 
        u.username === username.value.trim() && 
        (!editId || u.id !== parseInt(editId))
    );

    if (existingUser) {
        alert('❌ اسم المستخدم موجود بالفعل');
        return false;
    }

    return true;
}

// ============================================
// حفظ البيانات
// ============================================
function saveAccount() {
    if (!validateForm()) return;

    const users = getAllUsers();
    const editId = accountId.value;

    if (editId) {
        // تعديل مستخدم موجود
        const index = users.findIndex(u => u.id === parseInt(editId));
        if (index !== -1) {
            users[index] = {
                id: parseInt(editId),
                fullName: fullName.value.trim(),
                username: username.value.trim(),
                password: password.value.trim(),
                role: role.value
            };
        }
    } else {
        // إضافة مستخدم جديد
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({
            id: newId,
            fullName: fullName.value.trim(),
            username: username.value.trim(),
            password: password.value.trim(),
            role: role.value
        });
    }

    saveUsers(users);
    
    // مسح بيانات التعديل
    localStorage.removeItem('editUserData');
    
    alert('✅ تم حفظ البيانات بنجاح');
    window.location.href = 'accounts.html';
}

// ============================================
// أحداث الصفحة
// ============================================
if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAccount();
    });
}

if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'accounts.html';
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'accounts.html';
    });
}

// ============================================
// التحقق من تسجيل الدخول فقط
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

// ============================================
// تحميل البيانات للتعديل إذا وجدت
// ============================================
loadUserForEdit();