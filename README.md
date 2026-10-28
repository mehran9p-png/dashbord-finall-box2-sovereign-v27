# ♛ Sovereign Wealth & CFO Terminal V26

داشبورد شخصی مدیریت ثروت (بورس تهران، کریپتو، طلا، وام، استرس‌تست و مشاور CFO)؛ کاملاً سمت مرورگر و قابل میزبانی روی GitHub Pages.

## ساختار پروژه
```
index.html            فقط ساختار HTML
css/styles.css        تمام استایل‌ها و تم‌ها
js/config.js          تنظیمات اختیاری (کلید را اینجا commit نکنید)
js/01-data.js         داده‌ی پیش‌فرض
js/02-utils.js        ذخیره‌سازی و ابزارهای قالب‌بندی
js/03-finance.js      موتور محاسبات مالی
js/04-price-engine.js موتور قیمت زنده
js/05-cfo-advisor.js  موتور مشاور CFO
js/06-render.js       رندر تب‌ها و نمودارها
js/07..10             وام، استرس‌تست، میز CFO، ناوبری/تم/بکاپ
data/*.json           قیمت‌ها، پورتفو و تاریخچه
scripts/update_prices.py  به‌روزرسانی سمت سرور
.github/workflows/update-prices.yml  اجرای خودکار هر ۳۰ دقیقه
```
ترتیب بارگذاری فایل‌های JS مهم است (در `index.html` تعیین شده).

## راه‌اندازی روی GitHub
1. مخزن را بسازید و همه‌ی فایل‌ها را push کنید.
2. Settings ← Pages ← Source: `main` / root.
3. Settings ← Secrets and variables ← Actions ← New secret با نام `BRS_API_KEY` (کلید جدید BrsApi).
4. Actions ← Update prices ← Run workflow برای اولین اجرا.

## اجرای محلی
```
python3 -m http.server 8000      # سپس http://localhost:8000
python3 scripts/update_prices.py --self-test
```

## یادداشت
داده‌ی ذخیره‌شده‌ی شما در مرورگر (localStorage) با نسخه‌ی قبل سازگار است و از بین نمی‌رود.
