const API = import.meta.env.VITE_API_BASE_URL || '/api';

function headers(adminKey?: string): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (adminKey) (h as Record<string, string>)['x-admin-key'] = adminKey;
  return h;
}

export interface ApiProduct {
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
  stock?: number;
  createdAt?: string;
}

export interface ApiStudent {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API}/products`);
  if (!res.ok) return [];
  return res.json();
}

export async function addProduct(
  body: Partial<ApiProduct> & { name: string; price: number; image: string; category: string; subcategory: string; fabric: string; stock?: number },
  adminKey: string
): Promise<{ product: ApiProduct; notification: { sent: number; failed: number } }> {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: headers(adminKey),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function fetchStudents(adminKey: string): Promise<ApiStudent[]> {
  const res = await fetch(`${API}/students`, { headers: headers(adminKey) });
  if (!res.ok) return [];
  return res.json();
}

export async function addStudent(
  body: { email: string; name?: string },
  adminKey: string
): Promise<ApiStudent> {
  const res = await fetch(`${API}/students`, {
    method: 'POST',
    headers: headers(adminKey),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}
export async function subscribeStudent(body: { email: string; name: string }) {
  const res = await fetch(`${API}/students/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function registerStudentApi(body: { email: string; name: string; password: string }): Promise<ApiStudent> {
  const res = await fetch(`${API}/students/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function loginStudentApi(body: { email: string; password: string }): Promise<ApiStudent> {
  const res = await fetch(`${API}/students/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}
export async function updateProduct(
  id: string,
  updates: { price?: number; stock?: number },
  adminKey: string
): Promise<ApiProduct> {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers: headers(adminKey),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function deleteProduct(id: string, adminKey: string): Promise<void> {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers: headers(adminKey),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
}
export async function broadcastNotification(
  body: { subject: string; message: string },
  adminKey: string
): Promise<{ success: boolean; notification: { sent: number; failed: number } }> {
  const res = await fetch(`${API}/students/broadcast`, {
    method: 'POST',
    headers: headers(adminKey),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function uploadImage(file: File, adminKey: string): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API}/products/upload`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey }, // Note: We do NOT set Content-Type here, let the browser set it for FormData
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

// ── Order APIs ──────────────────────────────────────────────────

export interface ApiOrder {
  id: string;
  orderId: string;
  items: Array<{ productId?: string; name: string; image?: string; price: number; size?: string; color?: string; quantity: number }>;
  customItems: Array<{ clubName?: string; productType?: string; size?: string; color?: string; quantity: number; price: number }>;
  userDetails: { name: string; rollNumber: string; department: string; mobile: string; email: string };
  totalPrice: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  statusHistory: Array<{ status: string; timestamp: string }>;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}

export async function placeOrderApi(orderData: {
  items: Array<{ productId?: string; name: string; image?: string; price: number; size?: string; color?: string; quantity: number }>;
  customItems: Array<{ clubName?: string; collegeName?: string; productType?: string; fabricType?: string; color?: string; gender?: string; size?: string; quantity: number; price: number; nameOnBack?: string; numberOnBack?: string }>;
  userDetails: { name: string; rollNumber: string; department: string; mobile: string; email: string };
  totalPrice: number;
}): Promise<ApiOrder> {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function fetchOrdersByEmail(email: string): Promise<ApiOrder[]> {
  const res = await fetch(`${API}/orders?email=${encodeURIComponent(email)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllOrders(adminKey: string): Promise<ApiOrder[]> {
  const res = await fetch(`${API}/orders/all`, { headers: headers(adminKey) });
  if (!res.ok) return [];
  return res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  adminKey: string
): Promise<ApiOrder> {
  const res = await fetch(`${API}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: headers(adminKey),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

// ── Razorpay Payment APIs ───────────────────────────────────────

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export async function createRazorpayOrder(amount: number): Promise<RazorpayOrderResponse> {
  const res = await fetch(`${API}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export async function verifyRazorpayPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: {
    items: Array<{ productId?: string; name: string; image?: string; price: number; size?: string; color?: string; quantity: number }>;
    customItems: Array<{ clubName?: string; collegeName?: string; productType?: string; fabricType?: string; color?: string; gender?: string; size?: string; quantity: number; price: number; nameOnBack?: string; numberOnBack?: string }>;
    userDetails: { name: string; rollNumber: string; department: string; mobile: string; email: string };
    totalPrice: number;
    paymentMethod: string;
  };
}): Promise<ApiOrder> {
  const res = await fetch(`${API}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}
