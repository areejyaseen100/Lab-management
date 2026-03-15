// ============================================
// عناصر الصفحة
// ============================================
const backBtn = document.getElementById('backBtn');
const reportType = document.getElementById('reportType');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const dateRange = document.getElementById('dateRange');
const generateBtn = document.getElementById('generateReportBtn');
const summaryCards = document.getElementById('summaryCards');
const detailsTable = document.getElementById('detailsTable');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const printReportBtn = document.getElementById('printReportBtn');

// ============================================
// بيانات التقرير الحالي (للتصدير)
// ============================================
let currentReportData = null;

// ============================================
// تهيئة التواريخ
// ============================================
function initDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    if (startDate) startDate.value = `${year}-${month}-${day}`;
    if (endDate) endDate.value = `${year}-${month}-${day}`;
}

// ============================================
// التحكم في إظهار/إخفاء حقول التاريخ
// ============================================
if (reportType) {
    reportType.addEventListener('change', function() {
        const type = this.value;
        
        if (type === 'custom') {
            dateRange.style.display = 'flex';
        } else {
            dateRange.style.display = 'flex';
            updateDatesByType(type);
        }
    });
}

// ============================================
// تحديث التواريخ حسب نوع التقرير
// ============================================
function updateDatesByType(type) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    switch(type) {
        case 'daily':
            const day = String(today.getDate()).padStart(2, '0');
            startDate.value = `${year}-${String(month+1).padStart(2, '0')}-${day}`;
            endDate.value = `${year}-${String(month+1).padStart(2, '0')}-${day}`;
            break;
            
        case 'monthly':
            const firstDay = '01';
            const lastDay = new Date(year, month + 1, 0).getDate();
            startDate.value = `${year}-${String(month+1).padStart(2, '0')}-${firstDay}`;
            endDate.value = `${year}-${String(month+1).padStart(2, '0')}-${lastDay}`;
            break;
            
        case 'yearly':
            startDate.value = `${year}-01-01`;
            endDate.value = `${year}-12-31`;
            break;
    }
}

// ============================================
// جلب جميع المرضى
// ============================================
function getAllPatients() {
    const patientsData = localStorage.getItem('patients');
    return patientsData ? JSON.parse(patientsData) : [];
}

// ============================================
// فلترة الزيارات حسب التاريخ
// ============================================
function filterVisitsByDate(visits, start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59);
    
    return visits.filter(visit => {
        const visitDate = new Date(visit.date);
        return visitDate >= startDate && visitDate <= endDate;
    });
}

// ============================================
// جمع بيانات التقرير
// ============================================
function collectReportData() {
    const patients = getAllPatients();
    const start = startDate.value;
    const end = endDate.value;
    
    let totalPatients = 0;
    let totalTests = 0;
    let totalRevenue = 0;
    let completedTests = 0;
    let pendingTests = 0;
    
    const reportRows = [];
    let rowCounter = 1;
    
    patients.forEach(patient => {
        if (patient.visits && patient.visits.length > 0) {
            const filteredVisits = filterVisitsByDate(patient.visits, start, end);
            
            filteredVisits.forEach(visit => {
                totalPatients++;
                
                if (visit.tests && visit.tests.length > 0) {
                    totalTests += visit.tests.length;
                    
                    if (visit.status === 'completed') {
                        completedTests += visit.tests.length;
                    } else {
                        pendingTests += visit.tests.length;
                    }
                }
                
                totalRevenue += visit.totalAmount || 0;
                
                reportRows.push({
                    id: rowCounter++,
                    date: visit.date,
                    patientName: patient.name,
                    tests: visit.tests || [],
                    amount: visit.totalAmount || 0
                });
            });
        }
    });
    
    return {
        startDate: start,
        endDate: end,
        totalPatients,
        totalTests,
        totalRevenue,
        completedTests,
        pendingTests,
        reportRows
    };
}

// ============================================
// عرض بطاقات الملخص
// ============================================
function displaySummaryCards(data) {
    summaryCards.innerHTML = `
        <div class="summary-card">
            <div class="card-title">عدد المرضى</div>
            <div class="card-value">${data.totalPatients}</div>
            <div class="card-subtitle">مريض</div>
        </div>
        <div class="summary-card">
            <div class="card-title">إجمالي الفحوصات</div>
            <div class="card-value">${data.totalTests}</div>
            <div class="card-subtitle">فحص</div>
        </div>
        <div class="summary-card">
            <div class="card-title">الإيرادات</div>
            <div class="card-value">${data.totalRevenue}</div>
            <div class="card-subtitle">ج.م</div>
        </div>
        <div class="summary-card">
            <div class="card-title">نسبة الإنجاز</div>
            <div class="card-value">${data.totalTests ? Math.round((data.completedTests / data.totalTests) * 100) : 0}%</div>
            <div class="card-subtitle">مكتمل</div>
        </div>
    `;
}

// ============================================
// عرض جدول تفاصيل التقرير
// ============================================
function displayDetailsTable(data) {
    let tableHtml = `
        <table id="reportTable">
            <thead>
                <tr>
                    <th>الرقم</th>
                    <th>التاريخ</th>
                    <th>اسم المريض</th>
                    <th>الفحوصات</th>
                    <th>المبلغ</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.reportRows.forEach(row => {
        const testsHtml = row.tests.length > 0 
            ? row.tests.join(' - ')
            : 'لا توجد';
        
        tableHtml += `
            <tr>
                <td>${row.id}</td>
                <td>${row.date}</td>
                <td class="text-right">${row.patientName}</td>
                <td class="text-right">${testsHtml}</td>
                <td class="amount">${row.amount} ج.م</td>
            </tr>
        `;
    });
    
    tableHtml += `
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="4" class="text-left">الإجمالي</td>
                    <td class="total-amount">${data.totalRevenue} ج.م</td>
                </tr>
            </tfoot>
        </table>
    `;
    
    detailsTable.innerHTML = tableHtml;
}

// ============================================
// توليد التقرير
// ============================================
function generateReport() {
    currentReportData = collectReportData();
    displaySummaryCards(currentReportData);
    displayDetailsTable(currentReportData);
}

// ============================================
// دوال التصدير
// ============================================

// تصدير Excel
function exportToExcel() {
    if (!currentReportData || currentReportData.reportRows.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
    }
    
    // التحقق من وجود المكتبة
    if (typeof XLSX === 'undefined') {
        alert('مكتبة Excel لم يتم تحميلها بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        return;
    }
    
    try {
        // تجهيز البيانات لـ Excel
        const excelData = [
            ['الرقم', 'التاريخ', 'اسم المريض', 'الفحوصات', 'المبلغ']
        ];
        
        currentReportData.reportRows.forEach(row => {
            excelData.push([
                row.id,
                row.date,
                row.patientName,
                row.tests.join(' - '),
                row.amount
            ]);
        });
        
        // إضافة سطر الإجمالي
        excelData.push(['', '', '', 'الإجمالي', currentReportData.totalRevenue]);
        
        // إنشاء ورقة عمل
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        
        // تنسيق الأعمدة
        const colWidths = [
            { wch: 10 },  // الرقم
            { wch: 15 },  // التاريخ
            { wch: 30 },  // اسم المريض
            { wch: 40 },  // الفحوصات
            { wch: 15 }   // المبلغ
        ];
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, 'تقرير');
        
        // تحديد اسم الملف
        const fileName = `تقرير_${currentReportData.startDate}_إلى_${currentReportData.endDate}.xlsx`;
        
        // تصدير الملف
        XLSX.writeFile(wb, fileName);
    } catch (error) {
        console.error('خطأ في تصدير Excel:', error);
        alert('حدث خطأ أثناء تصدير الملف. يرجى المحاولة مرة أخرى.');
    }
}

// تصدير PDF
function exportToPDF() {
    if (!currentReportData || currentReportData.reportRows.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
    }
    
    // التحقق من وجود المكتبة
    if (typeof window.jspdf === 'undefined') {
        alert('مكتبة PDF لم يتم تحميلها بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // عنوان التقرير
        doc.setFontSize(18);
        doc.text('معمل الجمعية الطبية', 105, 15, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text(`تقرير من ${currentReportData.startDate} إلى ${currentReportData.endDate}`, 105, 25, { align: 'center' });
        
        // الملخص
        doc.setFontSize(12);
        doc.text(`عدد المرضى: ${currentReportData.totalPatients}`, 20, 40);
        doc.text(`إجمالي الفحوصات: ${currentReportData.totalTests}`, 20, 48);
        doc.text(`الإيرادات: ${currentReportData.totalRevenue} ج.م`, 20, 56);
        
        // تجهيز بيانات الجدول
        const tableData = currentReportData.reportRows.map(row => [
            row.id,
            row.date,
            row.patientName,
            row.tests.join(' - '),
            `${row.amount} ج.م`
        ]);
        
        // إنشاء الجدول
        doc.autoTable({
            head: [['الرقم', 'التاريخ', 'اسم المريض', 'الفحوصات', 'المبلغ']],
            body: tableData,
            startY: 70,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [25, 118, 210], textColor: 255 },
            foot: [['', '', '', 'الإجمالي', `${currentReportData.totalRevenue} ج.م`]],
            footStyles: { fillColor: [227, 242, 253], textColor: [25, 118, 210], fontStyle: 'bold' }
        });
        
        // تحديد اسم الملف
        const fileName = `تقرير_${currentReportData.startDate}_إلى_${currentReportData.endDate}.pdf`;
        
        // حفظ الملف
        doc.save(fileName);
    } catch (error) {
        console.error('خطأ في تصدير PDF:', error);
        alert('حدث خطأ أثناء تصدير الملف. يرجى المحاولة مرة أخرى.');
    }
}

// طباعة التقرير
function handlePrintReport() {
    if (!currentReportData || currentReportData.reportRows.length === 0) {
        alert('لا توجد بيانات للطباعة');
        return;
    }
    
    try {
        // إنشاء نافذة طباعة جديدة
        const printWindow = window.open('', '_blank');
        
        // محتوى الطباعة
        let printContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير معمل الجمعية الطبية</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        padding: 30px;
                        margin: 0;
                    }
                    h1 {
                        color: #1976D2;
                        text-align: center;
                        margin-bottom: 10px;
                        font-size: 24px;
                    }
                    .report-date {
                        text-align: center;
                        color: #666;
                        margin-bottom: 30px;
                        font-size: 16px;
                    }
                    .summary {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: #f5f5f5;
                        border-radius: 8px;
                    }
                    .summary-item {
                        text-align: center;
                    }
                    .summary-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .summary-value {
                        font-size: 20px;
                        font-weight: bold;
                        color: #1976D2;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th {
                        background: #1976D2;
                        color: white;
                        padding: 10px;
                        text-align: center;
                        font-size: 14px;
                    }
                    td {
                        padding: 8px;
                        border: 1px solid #e0e0e0;
                        text-align: center;
                        font-size: 13px;
                    }
                    .total-row {
                        background: #e3f2fd;
                        font-weight: bold;
                    }
                    .total-amount {
                        color: #2e7d32;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    @media print {
                        body { padding: 20px; }
                        .summary { background: #f5f5f5; }
                    }
                </style>
            </head>
            <body>
                <h1>معمل الجمعية الطبية</h1>
                <div class="report-date">تقرير من ${currentReportData.startDate} إلى ${currentReportData.endDate}</div>
                
                <div class="summary">
                    <div class="summary-item">
                        <div class="summary-label">عدد المرضى</div>
                        <div class="summary-value">${currentReportData.totalPatients}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">إجمالي الفحوصات</div>
                        <div class="summary-value">${currentReportData.totalTests}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">الإيرادات</div>
                        <div class="summary-value">${currentReportData.totalRevenue} ج.م</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>الرقم</th>
                            <th>التاريخ</th>
                            <th>اسم المريض</th>
                            <th>الفحوصات</th>
                            <th>المبلغ</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        currentReportData.reportRows.forEach(row => {
            printContent += `
                <tr>
                    <td>${row.id}</td>
                    <td>${row.date}</td>
                    <td>${row.patientName}</td>
                    <td>${row.tests.join(' - ')}</td>
                    <td>${row.amount} ج.م</td>
                </tr>
            `;
        });
        
        printContent += `
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td colspan="4" style="text-align:left; padding-right:20px;">الإجمالي</td>
                            <td class="total-amount">${currentReportData.totalRevenue} ج.م</td>
                        </tr>
                    </tfoot>
                </table>
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // تأخير الطباعة حتى يتم تحميل المحتوى
        setTimeout(() => {
            printWindow.print();
        }, 250);
    } catch (error) {
        console.error('خطأ في الطباعة:', error);
        alert('حدث خطأ أثناء الطباعة. يرجى المحاولة مرة أخرى.');
    }
}

// ============================================
// ربط أزرار التصدير
// ============================================
if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', exportToPDF);
}

if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportToExcel);
}

if (printReportBtn) {
    printReportBtn.addEventListener('click', handlePrintReport);
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
initDates();
if (reportType) {
    updateDatesByType(reportType.value);
}

// ============================================
// ربط زر التوليد
// ============================================
if (generateBtn) {
    generateBtn.addEventListener('click', generateReport);
    generateReport();
}