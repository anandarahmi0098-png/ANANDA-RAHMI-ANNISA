import React from "react";
import { User } from "firebase/auth";
import { LogIn, LogOut, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface OAuthWidgetProps {
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const OAuthWidget: React.FC<OAuthWidgetProps> = ({
  user,
  needsAuth,
  isLoggingIn,
  onLogin,
  onLogout,
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-clay-light shadow-xs p-5 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-sage-deep font-serif tracking-tight">
            Integrasi Dokumen Google Drive & Docs
          </h3>
          <p className="text-xs text-clay-dark mt-1 max-w-md">
            Hubungkan akun Google Anda untuk mengekspor silabus dan modul ajar langsung menjadi dokumen Google Docs yang siap cetak dan dibagikan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-[#F9F6F0] p-2 pr-4 rounded-xl border border-clay-light">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Google User"}
                  className="w-8 h-8 rounded-full border border-clay"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-clay text-sage-deep flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-sage-deep truncate max-w-[150px]">
                  {user.displayName || "Ustazah"}
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] text-clay-dark truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>
              
              <button
                onClick={onLogout}
                title="Keluar Akun Google"
                className="ml-2 p-1.5 text-clay-dark hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-1.5 text-clay bg-[#F9F6F0] px-2.5 py-1 rounded-lg border border-clay/50 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Belum Terhubung</span>
              </div>
              
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button font-sans font-medium text-xs text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-hidden disabled:opacity-50 cursor-pointer flex items-center justify-center"
                style={{
                  height: "38px",
                  borderRadius: "10px",
                  padding: "0 16px",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                }}
              >
                <div className="gsi-material-button-content-wrapper flex items-center gap-2">
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-sage" />
                  ) : (
                    <div className="gsi-material-button-icon w-4 h-4 flex-shrink-0">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                  )}
                  <span className="gsi-material-button-contents text-sm font-medium">
                    {isLoggingIn ? "Menghubungkan..." : "Hubungkan Google Docs"}
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
