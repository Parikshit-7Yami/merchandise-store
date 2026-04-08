import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportTicket, TicketResponse } from '@/types';

interface SupportContextType {
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'responses'>) => SupportTicket;
  addResponse: (ticketId: string, message: string, isAdmin?: boolean) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  getTicketsByType: (type: 'return' | 'payment') => SupportTicket[];
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('supportTickets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('supportTickets', JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (data: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'responses'>): SupportTicket => {
    const now = new Date().toISOString();
    const ticket: SupportTicket = {
      ...data,
      id: `TKT-${Date.now()}`,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      responses: [],
    };
    setTickets(prev => [ticket, ...prev]);
    return ticket;
  };

  const addResponse = (ticketId: string, message: string, isAdmin = false) => {
    const response: TicketResponse = {
      id: `RES-${Date.now()}`,
      message,
      isAdmin,
      createdAt: new Date().toISOString(),
    };
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? { ...t, responses: [...t.responses, response], updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const getTicketsByType = (type: 'return' | 'payment') => tickets.filter(t => t.type === type);

  return (
    <SupportContext.Provider value={{ tickets, createTicket, addResponse, updateTicketStatus, getTicketsByType }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) throw new Error('useSupport must be used within SupportProvider');
  return context;
};
