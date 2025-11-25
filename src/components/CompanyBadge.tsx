import { motion } from 'framer-motion';
import menoraLogo from '@/assets/menora-logo.png';
import hachsharaLogo from '@/assets/hachshara-logo.png';

interface CompanyBadgeProps {
  company: 'menora' | 'hachshara';
  productName?: string;
}

const CompanyBadge = ({ company, productName }: CompanyBadgeProps) => {
  const isMenura = company === 'menora';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 p-4 rounded-lg border-2 ${
        isMenura 
          ? 'bg-menora-bg border-menora-secondary' 
          : 'bg-hachshara-bg border-hachshara-primary'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center ${
          isMenura ? 'bg-menora-primary' : 'bg-white'
        }`}>
          <img 
            src={isMenura ? menoraLogo : hachsharaLogo} 
            alt={isMenura ? 'מנורה מבטחים' : 'הכשרה'}
            className="w-16 h-16 object-contain"
          />
        </div>
        <div className="flex-1 text-right">
          <h3 className={`text-2xl font-bold ${
            isMenura ? 'text-menora-dark' : 'text-hachshara-primary'
          }`}>
            {isMenura ? 'מנורה מבטחים' : 'הכשרה'}
          </h3>
          {productName && (
            <p className={`text-lg ${
              isMenura ? 'text-menora-secondary' : 'text-hachshara-secondary'
            }`}>
              {productName}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyBadge;
