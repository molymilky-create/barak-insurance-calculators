import logo from '@/assets/logo.png';

const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4" dir="rtl">
          <img src={logo} alt="ברק ביטוחים" className="h-12 w-auto" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">ברק ביטוחים</h1>
            <p className="text-sm text-muted-foreground">כלי עבודה פנימיים לסוכנות</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
