import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DesignVerification } from '@/types';

interface VerificationContextType {
  verifications: DesignVerification[];
  submitForVerification: (data: Omit<DesignVerification, 'id' | 'status' | 'submittedAt' | 'expiresAt'>) => DesignVerification;
  reviewDesign: (id: string, review: {
    status: DesignVerification['status'];
    reviewNotes?: string;
    campusApproved?: boolean;
    collegeNameAllowed?: boolean;
    manufacturingFeasible?: boolean;
    estimatedExtraCost?: number;
  }) => void;
  getVerificationByProductId: (productId: string) => DesignVerification | undefined;
  getPendingVerifications: () => DesignVerification[];
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
  const [verifications, setVerifications] = useState<DesignVerification[]>(() => {
    const saved = localStorage.getItem('designVerifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('designVerifications', JSON.stringify(verifications));
  }, [verifications]);

  const submitForVerification = (data: Omit<DesignVerification, 'id' | 'status' | 'submittedAt' | 'expiresAt'>): DesignVerification => {
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const verification: DesignVerification = {
      ...data,
      id: `VER-${Date.now()}`,
      status: 'pending_review',
      submittedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };
    setVerifications(prev => [verification, ...prev]);
    return verification;
  };

  const reviewDesign = (id: string, review: {
    status: DesignVerification['status'];
    reviewNotes?: string;
    campusApproved?: boolean;
    collegeNameAllowed?: boolean;
    manufacturingFeasible?: boolean;
    estimatedExtraCost?: number;
  }) => {
    setVerifications(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, ...review, reviewedAt: new Date().toISOString() }
          : v
      )
    );
  };

  const getVerificationByProductId = (productId: string) =>
    verifications.find(v => v.customProductId === productId);

  const getPendingVerifications = () =>
    verifications.filter(v => v.status === 'pending_review' || v.status === 'under_review');

  return (
    <VerificationContext.Provider value={{
      verifications,
      submitForVerification,
      reviewDesign,
      getVerificationByProductId,
      getPendingVerifications,
    }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) throw new Error('useVerification must be used within VerificationProvider');
  return context;
};
