import React from 'react';
import './Login.css';

export const AuthLayout = ({ children, authMode, imageSrc }) => {

  const isFormLeft = authMode === 'register';

  return (
    <div className="auth-outer-container">
      <div className={`auth-wrapper ${isFormLeft ? 'mode-register' : 'mode-login'}`}>
        {/* Lớp chứa nội dung  */}
        <div className="auth-inner-content">
          <div className="auth-side image-side">
            <div
              className="auth-image"
              style={{ backgroundImage: `url(${imageSrc})` }}
            >
              <div className="image-overlay">
                <h2>Chắp cánh ước mơ du học</h2>
                <p>Khám phá cơ hội mới tại những quốc gia hàng đầu thế giới cùng HTO.</p>
              </div>
            </div>
          </div>

          <div className="auth-side form-side">
            <div className="auth-form-container">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
