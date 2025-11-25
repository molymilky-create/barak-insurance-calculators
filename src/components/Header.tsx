import logo from '@/assets/barak-logo.png';

const Header = () => {
  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-end gap-4" dir="rtl">
          <div className="flex flex-col text-right">
            <h1 className="text-xl font-bold text-primary">ברק ביטוחים</h1>
            <p className="text-xs text-muted-foreground">כלי עבודה פנימיים לסוכנות</p>
          </div>
          <img src={logo} alt="ברק ביטוחים" className="h-14 w-auto" />
        </div>
      </div>
    </header>
  );
};

export default Header;
