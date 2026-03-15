// ============================================
// المستخدمين - نجيبهم من localStorage
// ============================================
function getUsers() {
    const usersData = localStorage.getItem('users');
    if (!usersData) {
        // المستخدمين الافتراضيين
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
// دالة تعبئة القائمة
// ============================================
function fillUserSelect() {
    const select = document.getElementById('usernameSelect');
    const users = getUsers();
    
    if (!select) {
        return;
    }
    
    select.innerHTML = '<option value="">-- اختر المستخدم --</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = `${user.fullName} (${user.role})`;
        select.appendChild(option);
    });
}

// ============================================
// أحداث صفحة الدخول
// ============================================
function setupLoginEvents() {
    const select = document.getElementById('usernameSelect');
    const password = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!select || !password || !loginBtn) {
        return;
    }
    
    select.addEventListener('change', function() {
        if (this.value) {
            password.disabled = false;
            loginBtn.disabled = false;
            password.focus();
            showMessage('👤 تم اختيار المستخدم', '#4CAF50');
        } else {
            password.disabled = true;
            loginBtn.disabled = true;
            password.value = '';
            showMessage('', '');
        }
    });
    
    password.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
}

// ============================================
// دالة تسجيل الدخول
// ============================================
function handleLogin() {
    const select = document.getElementById('usernameSelect');
    const password = document.getElementById('password');
    const users = getUsers();
    
    if (!select || !password) {
        return;
    }
    
    const username = select.value;
    const pass = password.value;
    
    if (!username) {
        showMessage('❌ الرجاء اختيار اسم المستخدم', '#f44336');
        return;
    }
    
    if (!pass) {
        showMessage('❌ الرجاء إدخال كلمة المرور', '#f44336');
        return;
    }
    
    const foundUser = users.find(u => u.username === username && u.password === pass);
    
    if (foundUser) {
        showMessage(`✅ مرحباً بك ${foundUser.fullName}`, '#4CAF50');
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        
        select.disabled = true;
        password.disabled = true;
        if (document.getElementById('loginBtn')) {
            document.getElementById('loginBtn').disabled = true;
        }
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1000);
    } else {
        showMessage('❌ كلمة المرور غير صحيحة', '#f44336');
    }
}

// ============================================
// دالة عرض الرسائل
// ============================================
function showMessage(msg, color) {
    const msgDiv = document.getElementById('errorMessage');
    if (msgDiv) {
        msgDiv.textContent = msg;
        msgDiv.style.color = color;
    }
}

// ============================================
// دوال الصفحة الرئيسية
// ============================================
function initMainPage() {
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) {
            welcomeEl.textContent = `مرحباً بك ${user.fullName} 👋`;
        }
        
        const dateEl = document.getElementById('todayDate');
        if (dateEl) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dateEl.textContent = `${year}-${month}-${day}`;
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    } catch (e) {
        console.error('خطأ في تحميل الصفحة الرئيسية:', e);
        window.location.href = 'index.html';
    }
}

// ============================================
// تشغيل الكود حسب الصفحة الحالية
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === 'index.html' || page === '') {
        // صفحة تسجيل الدخول
        fillUserSelect();
        setupLoginEvents();
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
    } else if (page === 'main.html') {
        // الصفحة الرئيسية
        initMainPage();
    }
});