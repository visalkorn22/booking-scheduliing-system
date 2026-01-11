
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'km' | 'zh';

interface TranslationDict {
  [key: string]: {
    en: string;
    km: string;
    zh: string;
  };
}

const translations: TranslationDict = {
  // Navigation
  dashboard: { en: 'Dashboard', km: 'ផ្ទាំងគ្រប់គ្រង', zh: '仪表板' },
  my_bookings: { en: 'My Bookings', km: 'ការកក់របស់ខ្ញុំ', zh: '我的预订' },
  schedule: { en: 'Schedule', km: 'កាលវិភាគ', zh: '日程表' },
  offerings: { en: 'Offerings', km: 'សេវាកម្ម', zh: '服务项目' },
  directory: { en: 'Directory', km: 'បញ្ជីឈ្មោះ', zh: '目录' },
  staff_team: { en: 'Staff Team', km: 'ក្រុមការងារ', zh: '员工团队' },
  financials: { en: 'Financials', km: 'ហិរញ្ញវត្ថុ', zh: '财务' },
  system_prefs: { en: 'System Prefs', km: 'ការកំណត់', zh: '系统设置' },
  
  // Dashboard Labels
  welcome: { en: 'Welcome', km: 'សូមស្វាគមន៍', zh: '欢迎' },
  operational_overview: { en: 'Operational Overview', km: 'ទិដ្ឋភាពទូទៅនៃប្រតិបត្តិការ', zh: '运营概览' },
  live_bookings: { en: 'Live Bookings', km: 'ការកក់បច្ចុប្បន្ន', zh: '实时预订' },
  action_required: { en: 'Action Required', km: 'ត្រូវការសកម្មភាព', zh: '待办事项' },
  monthly_rev: { en: 'Monthly Rev', km: 'ចំណូលប្រចាំខែ', zh: '月收入' },
  client_rating: { en: 'Client Rating', km: 'ការវាយតម្លៃ', zh: '客户评分' },
  priority_schedule: { en: 'Priority Schedule', km: 'កាលវិភាគអាទិភាព', zh: '优先日程' },
  growth_vector: { en: 'Growth Vector', km: 'វ៉ិចទ័រលូតលាស់', zh: '增长向量' },
  
  // Actions
  new_booking: { en: 'New Booking', km: 'ការកក់ថ្មី', zh: '新预订' },
  view_reports: { en: 'View Reports', km: 'មើលរបាយការណ៍', zh: '查看报告' },
  pay_now: { en: 'Pay Now', km: 'បង់ប្រាក់ឥឡូវនេះ', zh: '立即支付' },
  save_changes: { en: 'Save Changes', km: 'រក្សាទុកការផ្លាស់ប្តូរ', zh: '保存更改' },
  logout: { en: 'Log Out System', km: 'ចាកចេញពីប្រព័ន្ធ', zh: '登出系统' },
  
  // Booking Wizard
  choose_service: { en: 'Choose a Service', km: 'ជ្រើសរើសសេវាកម្ម', zh: '选择服务' },
  select_specialist: { en: 'Select Specialist', km: 'ជ្រើសរើសអ្នកឯកទេស', zh: '选择专家' },
  pick_date_time: { en: 'Pick Date & Time', km: 'ជ្រើសរើសថ្ងៃ និងម៉ោង', zh: '选择日期和时间' },
  confirm_details: { en: 'Confirm Details', km: 'បញ្ជាក់ព័ត៌មាន', zh: '确认详情' },
  secure_payment: { en: 'Secure Payment', km: 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព', zh: '安全支付' },
  booking_confirmed: { en: 'Booking Confirmed!', km: 'ការកក់ត្រូវបានបញ្ជាក់!', zh: '预订已确认！' },

  // Recurrence
  recurring: { en: 'Recurring Session', km: 'វគ្គបន្តបន្ទាប់', zh: '定期会话' },
  none: { en: 'One-time', km: 'ម្ដងគត់', zh: '单次' },
  weekly: { en: 'Weekly', km: 'រៀងរាល់សប្តាហ៍', zh: '每周' },
  biweekly: { en: 'Bi-weekly', km: 'រៀងរាល់ ២ សប្តាហ៍', zh: '每两周' },
  monthly: { en: 'Monthly', km: 'រៀងរាល់ខែ', zh: '每月' },
  recurrence_options: { en: 'Recurrence Options', km: 'ជម្រើសនៃការកក់បន្តបន្ទាប់', zh: '重复选项' },
  ongoing_support: { en: 'Recommended for ongoing sessions', km: 'ណែនាំសម្រាប់វគ្គបន្តបន្ទាប់', zh: '建议持续会话' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
