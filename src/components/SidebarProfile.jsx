import React, { useState } from 'react';
import { C } from '../constants';

const SidebarProfile = ({ isOpen, onClose, userProfile, lang, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: userProfile?.first_name || '',
    current_weight: userProfile?.current_weight || '',
    height: userProfile?.height || '',
    age: userProfile?.age || '',
    target_weight: userProfile?.target_weight || '',
    activity_level: userProfile?.activity_level || '',
    health_conditions: userProfile?.health_conditions || '',
    country: userProfile?.country || '',
    diet_type: userProfile?.diet_type || 'لا شيء',
    allergies: userProfile?.allergies || 'لا شيء',
    medications: userProfile?.medications || 'لا شيء',
    eating_out: userProfile?.eating_out || '0-1'
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(formData);
    setIsSaving(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    background: C.cardLight,
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    color: C.text,
    fontSize: '14px',
    marginBottom: '8px',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '12px',
    color: C.muted,
    marginBottom: '4px',
    display: 'block'
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '340px',
        maxWidth: '85%',
        height: '100vh',
        background: C.bg,
        boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: C.text }}>{lang === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: C.muted }}>✕</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الاسم الأول' : 'First Name'}</label>
          <input type="text" value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
          <input type="number" value={formData.current_weight} onChange={(e) => handleChange('current_weight', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الطول (سم)' : 'Height (cm)'}</label>
          <input type="number" value={formData.height} onChange={(e) => handleChange('height', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'العمر' : 'Age'}</label>
          <input type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الوزن المستهدف (كجم)' : 'Target Weight (kg)'}</label>
          <input type="number" value={formData.target_weight} onChange={(e) => handleChange('target_weight', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'مستوى النشاط' : 'Activity Level'}</label>
          <select value={formData.activity_level} onChange={(e) => handleChange('activity_level', e.target.value)} style={inputStyle}>
            <option value="">{lang === 'ar' ? 'اختر' : 'Select'}</option>
            <option value="قليل">{lang === 'ar' ? 'قليل' : 'Low'}</option>
            <option value="متوسط">{lang === 'ar' ? 'متوسط' : 'Medium'}</option>
            <option value="عالي">{lang === 'ar' ? 'عالي' : 'High'}</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الأمراض المزمنة' : 'Chronic Diseases'}</label>
          <input type="text" value={formData.health_conditions} onChange={(e) => handleChange('health_conditions', e.target.value)} style={inputStyle} placeholder={lang === 'ar' ? 'سكري، ضغط، إلخ' : 'Diabetes, pressure, etc.'} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'البلد' : 'Country'}</label>
          <input type="text" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'النظام الغذائي' : 'Diet Type'}</label>
          <select value={formData.diet_type} onChange={(e) => handleChange('diet_type', e.target.value)} style={inputStyle}>
            <option value="لا شيء">{lang === 'ar' ? 'لا شيء' : 'None'}</option>
            <option value="نباتي">{lang === 'ar' ? 'نباتي' : 'Vegetarian'}</option>
            <option value="كيتو">{lang === 'ar' ? 'كيتو' : 'Keto'}</option>
            <option value="متوسطي">{lang === 'ar' ? 'متوسطي' : 'Mediterranean'}</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الحساسيات' : 'Allergies'}</label>
          <input type="text" value={formData.allergies} onChange={(e) => handleChange('allergies', e.target.value)} style={inputStyle} placeholder={lang === 'ar' ? 'لاكتوز، جلوتين، إلخ' : 'Lactose, gluten, etc.'} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الأدوية' : 'Medications'}</label>
          <input type="text" value={formData.medications} onChange={(e) => handleChange('medications', e.target.value)} style={inputStyle} placeholder={lang === 'ar' ? 'أدوية تؤثر على الوزن' : 'Medications affecting weight'} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{lang === 'ar' ? 'الأكل خارج المنزل (أسبوعياً)' : 'Eating out (per week)'}</label>
          <select value={formData.eating_out} onChange={(e) => handleChange('eating_out', e.target.value)} style={inputStyle}>
            <option value="0-1">0-1</option>
            <option value="2-3">2-3</option>
            <option value="4-5">4-5</option>
            <option value="أكثر من 5">{lang === 'ar' ? 'أكثر من 5' : 'more than 5'}</option>
          </select>
        </div>

        <button onClick={handleSave} disabled={isSaving} style={{
          width: '100%',
          background: C.teal,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          marginTop: '8px',
          opacity: isSaving ? 0.6 : 1
        }}>
          {isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
    </>
  );
};

export default SidebarProfile;
