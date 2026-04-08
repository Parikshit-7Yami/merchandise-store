export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'boys' | 'girls' | 'teachers';
  subcategory: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  description?: string;
  eventName?: string;
  isEventMerch?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface CustomizedProduct {
  id: string;
  clubName: string;
  collegeName: string;
  productType: 'tshirt' | 'sweatshirt' | 'athletic' | 'sleeveless' | 'hoodie' | 'jersey' | 'blazer';
  fabricType: 'cotton' | 'polyester' | 'athletic';
  color: string;
  gender: 'boys' | 'girls' | 'unisex' | 'teachers';
  sizeType: 'standard' | 'custom';
  size: string;
  customSize?: {
    chest: number;
    length: number;
    shoulder: number;
  };
  clubLogo?: string;
  logoSource: 'predefined' | 'uploaded';
  customDesign?: string;
  quantity: number;
  price: number;
  nameOnBack?: string;
  numberOnBack?: string;
  eventName?: string;
  // Verification fields for uploaded designs
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationSubmittedAt?: string;
  verificationResolvedAt?: string;
  verificationNotes?: string;
  estimatedExtraCost?: number;
}

export interface GroupOrderMember {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  mobile: string;
  size: string;
  sizeType: 'standard' | 'custom';
  customSize?: {
    chest: number;
    length: number;
    shoulder: number;
  };
  color: string;
  productType: 'tshirt' | 'sweatshirt' | 'hoodie' | 'sleeveless' | 'jersey' | 'blazer';
  quantity: number;
  nameOnBack?: string;
  numberOnBack?: string;
  joinedAt: string;
}

export interface GroupOrder {
  id: string;
  groupCode: string;
  groupName: string;
  eventName?: string;
  creatorId: string;
  creatorName: string;
  baseProductType: 'tshirt' | 'sweatshirt' | 'hoodie' | 'sleeveless' | 'jersey' | 'blazer';
  allowedColors: string[];
  allowNameOnBack: boolean;
  allowNumberOnBack: boolean;
  clubName: string;
  collegeName: string;
  clubLogo?: string;
  logoSource: 'predefined' | 'uploaded';
  fabricType: 'cotton' | 'polyester' | 'athletic';
  basePrice: number;
  members: GroupOrderMember[];
  status: 'open' | 'closed' | 'checked_out';
  createdAt: string;
  checkoutDetails?: {
    totalAmount: number;
    totalQuantity: number;
    orderId: string;
    checkoutDate: string;
  };
}

export interface Order {
  id: string;
  orderId?: string;
  items: CartItem[];
  customItems: CustomizedProduct[];
  groupOrderId?: string;
  groupOrderMembers?: GroupOrderMember[];
  userDetails: UserDetails;
  totalPrice: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  statusHistory?: { status: string; timestamp: string }[];
  orderDate: string;
  eventName?: string;
}

export interface UserDetails {
  name: string;
  rollNumber: string;
  department: string;
  mobile: string;
  email: string;
}

export interface TrendingStats {
  mostOrderedProduct: {
    name: string;
    category: string;
    orders: number;
    image: string;
  };
  mostPopularColor: {
    color: string;
    colorName: string;
    orders: number;
  };
  topClubDesign: {
    clubName: string;
    orders: number;
    logo?: string;
  };
  totalOrdersThisMonth: number;
}

export interface EventCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

// Support Tickets
export interface SupportTicket {
  id: string;
  type: 'return' | 'payment';
  orderId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

// Design Verification
export interface DesignVerification {
  id: string;
  customProductId: string;
  designImage: string;
  clubName: string;
  productType: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'needs_changes';
  reviewNotes?: string;
  campusApproved?: boolean;
  collegeNameAllowed?: boolean;
  manufacturingFeasible?: boolean;
  estimatedExtraCost?: number;
  reviewedAt?: string;
  expiresAt: string; // 7 days from submission
}

// Notification Subscription
export interface NotificationSubscription {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  preferences: {
    newEvents: boolean;
    orderUpdates: boolean;
    promotions: boolean;
  };
}
