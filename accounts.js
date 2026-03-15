// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const addAccountBtn = document.getElementById('addAccountBtn');
const accountsList = document.getElementById('accountsList');

// ============================================
// جلب جميع المستخدمين
// ============================================
function getAllUsers() {
    const usersData = localStorage.getItem('users');
    if (!usersData) {
        // إذا مافي مستخدمين، ننشئ المستخدمين الافتراضيين
        const defaultUsers = [
            { id: 1, username: 'admin', password: '123456', fullName: 'أحمد المدير', role: 'مدير' },
            { id: 2, username: 'tech1', password: '123456', fullName: 'محمد الفني', role: 'فني' },
            { id: 3, username: 'tech2', password: '123456', fullName: 'سارة الفني', role: 'فني' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return JSON.parse(usersData);
}

// ============================================
// حفظ المستخدمين
// ============================================
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ============================================
// حذف مستخدم
// ============================================
function deleteUser(userId) {
    if (userId === 1) {
        alert('❌ لا يمكن حذف حساب المدير الرئيسي');
        return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        return;
    }

    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
    displayUsers();
    alert('✅ تم حذف المستخدم بنجاح');
}

// ============================================
// تغيير كلمة المرور
// ============================================
function changePassword(userId) {
    const newPassword = prompt('أدخل كلمة المرور الجديدة (6 أحرف على الأقل):');
    if (!newPassword) return;

    if (newPassword.length < 6) {
        alert('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }

    let users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
        alert('✅ تم تغيير كلمة المرور بنجاح');
    }
}

// ============================================
// تعديل مستخدم
// ============================================
function editUser(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        localStorage.setItem('editUserData', JSON.stringify(user));
        window.location.href = 'account_form.html?mode=edit';
    }
}

// ============================================
// عرض المستخدمين
// ============================================
function displayUsers() {
    const users = getAllUsers();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (users.length === 0) {
        accountsList.innerHTML = '<div class="no-accounts">لا توجد حسابات مسجلة</div>';
        return;
    }

    accountsList.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'account-card';

        const isCurrentUser = currentUser && currentUser.id === user.id;
        const isAdmin = user.id === 1;

        userCard.innerHTML = `
            <div class="account-info">
                <div class="account-name">${user.fullName} ${isCurrentUser ? '(أنت)' : ''}</div>
                <div class="account-username">@${user.username}</div>
                <div class="account-role" data-role="${user.role}">${user.role}</div>
            </div>
            <div class="account-actions">
                <button class="btn-edit" onclick="editUser(${user.id})">
                    <span>✏️</span> تعديل
                </button>
                <button class="btn-password" onclick="changePassword(${user.id})">
                    <span>🔑</span> تغيير كلمة المرور
                </button>
                ${!isAdmin ? `
                    <button class="btn-delete" onclick="deleteUser(${user.id})">
                        <span>🗑️</span> حذف
                    </button>
                ` : ''}
            </div>
        `;

        accountsList.appendChild(userCard);
    });
}

// ============================================
// أحداث الصفحة
// ============================================
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'main.html';
    });
}

if (addAccountBtn) {
    addAccountBtn.addEventListener('click', () => {
        localStorage.removeItem('editUserData');
        window.location.href = 'account_form.html?mode=add';
    });
}

// ============================================
// التحقق من تسجيل الدخول فقط - بدون صلاحيات
// ============================================
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

// ============================================
// عرض المستخدمين
// ============================================
displayUsers();

// تعريف الدوال كمتغيرات عامة
window.editUser = editUser;
window.changePassword = changePassword;
window.deleteUser = deleteUser;