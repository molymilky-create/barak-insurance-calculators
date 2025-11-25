import logo from '@/assets/barak-logo.png';

const Header = () => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-end gap-4" dir="rtl">
          <div className="flex flex-col text-right">
            <p className="text-sm text-muted-foreground">ברק ביטוחים – כלים פנימיים לסוכנות</p>
          </div>
          <img src={logo} alt="ברק ביטוחים" className="h-16 w-auto" />
        </div>
      </div>
    </header>
  );
};

export default Header;
