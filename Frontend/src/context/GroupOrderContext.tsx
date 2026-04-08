import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GroupOrder, GroupOrderMember } from '@/types';

interface GroupOrderContextType {
  groupOrders: GroupOrder[];
  activeGroupOrder: GroupOrder | null;
  createGroupOrder: (order: Omit<GroupOrder, 'id' | 'groupCode' | 'members' | 'status' | 'createdAt'>) => GroupOrder;
  joinGroupOrder: (groupCode: string, member: Omit<GroupOrderMember, 'id' | 'joinedAt'>) => boolean;
  getGroupOrderByCode: (code: string) => GroupOrder | undefined;
  closeGroupOrder: (groupCode: string) => void;
  checkoutGroupOrder: (groupCode: string, orderId: string) => void;
  setActiveGroupOrder: (order: GroupOrder | null) => void;
  removeMemberFromGroup: (groupCode: string, memberId: string) => void;
  updateMemberInGroup: (groupCode: string, memberId: string, updates: Partial<GroupOrderMember>) => void;
}

const GroupOrderContext = createContext<GroupOrderContextType | undefined>(undefined);

const generateGroupCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const GroupOrderProvider = ({ children }: { children: ReactNode }) => {
  const [groupOrders, setGroupOrders] = useState<GroupOrder[]>(() => {
    const saved = localStorage.getItem('groupOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeGroupOrder, setActiveGroupOrder] = useState<GroupOrder | null>(null);

  useEffect(() => {
    localStorage.setItem('groupOrders', JSON.stringify(groupOrders));
  }, [groupOrders]);

  const createGroupOrder = (orderData: Omit<GroupOrder, 'id' | 'groupCode' | 'members' | 'status' | 'createdAt'>): GroupOrder => {
    const newOrder: GroupOrder = {
      ...orderData,
      id: `GO-${Date.now()}`,
      groupCode: generateGroupCode(),
      members: [],
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setGroupOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getGroupOrderByCode = (code: string): GroupOrder | undefined => {
    return groupOrders.find(order => order.groupCode === code.toUpperCase());
  };

  const joinGroupOrder = (groupCode: string, memberData: Omit<GroupOrderMember, 'id' | 'joinedAt'>): boolean => {
    const order = getGroupOrderByCode(groupCode);
    if (!order || order.status !== 'open') return false;

    const newMember: GroupOrderMember = {
      ...memberData,
      id: `M-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      joinedAt: new Date().toISOString()
    };

    setGroupOrders(prev => prev.map(o => 
      o.groupCode === groupCode.toUpperCase() 
        ? { ...o, members: [...o.members, newMember] }
        : o
    ));
    return true;
  };

  const closeGroupOrder = (groupCode: string) => {
    setGroupOrders(prev => prev.map(o =>
      o.groupCode === groupCode.toUpperCase()
        ? { ...o, status: 'closed' }
        : o
    ));
  };

  const checkoutGroupOrder = (groupCode: string, orderId: string) => {
    const order = getGroupOrderByCode(groupCode);
    if (!order) return;

    const totalQuantity = order.members.reduce((sum, m) => sum + m.quantity, 0);
    const totalAmount = totalQuantity * order.basePrice;

    setGroupOrders(prev => prev.map(o =>
      o.groupCode === groupCode.toUpperCase()
        ? {
            ...o,
            status: 'checked_out',
            checkoutDetails: {
              totalAmount,
              totalQuantity,
              orderId,
              checkoutDate: new Date().toISOString()
            }
          }
        : o
    ));
  };

  const removeMemberFromGroup = (groupCode: string, memberId: string) => {
    setGroupOrders(prev => prev.map(o =>
      o.groupCode === groupCode.toUpperCase()
        ? { ...o, members: o.members.filter(m => m.id !== memberId) }
        : o
    ));
  };

  const updateMemberInGroup = (groupCode: string, memberId: string, updates: Partial<GroupOrderMember>) => {
    setGroupOrders(prev => prev.map(o =>
      o.groupCode === groupCode.toUpperCase()
        ? {
            ...o,
            members: o.members.map(m =>
              m.id === memberId ? { ...m, ...updates } : m
            )
          }
        : o
    ));
  };

  return (
    <GroupOrderContext.Provider value={{
      groupOrders,
      activeGroupOrder,
      createGroupOrder,
      joinGroupOrder,
      getGroupOrderByCode,
      closeGroupOrder,
      checkoutGroupOrder,
      setActiveGroupOrder,
      removeMemberFromGroup,
      updateMemberInGroup
    }}>
      {children}
    </GroupOrderContext.Provider>
  );
};

export const useGroupOrder = () => {
  const context = useContext(GroupOrderContext);
  if (!context) {
    throw new Error('useGroupOrder must be used within a GroupOrderProvider');
  }
  return context;
};
