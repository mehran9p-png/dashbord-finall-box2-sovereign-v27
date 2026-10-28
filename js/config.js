// تنظیمات اختیاری سمت مرورگر.
// هشدار: هر چیزی اینجا برای همه‌ی بازدیدکنندگان قابل مشاهده است. کلید واقعی را اینجا commit نکنید.
// قیمت سهام در حالت پیش‌فرض توسط GitHub Action (scripts/update_prices.py) و با Secret به نام BRS_API_KEY
// به‌روز می‌شود و مرورگر فقط data/prices.json را می‌خواند.
window.APP_CONFIG = {
  BRS_API_KEY: '' // خالی = مرورگر مستقیم از BrsApi نمی‌خواند و از TSETMC / فایل prices.json استفاده می‌کند
};
