const BASE_URL = 'https://manda-library.vercel.app';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Terjadi kesalahan sistem';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // JSON parsing failed, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Handle empty/no-content response
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // --- AUTH & CHECK-IN ---
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  
  loginPustakawan: (email, password) => 
    apiRequest('/auth/pustakawan/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    }),
    
  loginSiswa: (nisn) => 
    apiRequest('/auth/siswa/login', { 
      method: 'POST', 
      body: JSON.stringify({ nisn }) 
    }),
    
  checkIn: (nisn, name) => 
    apiRequest('/auth/checkin', { 
      method: 'POST', 
      body: JSON.stringify({ nisn, name }) 
    }),
    
  getNameByNisn: (nisn) => apiRequest(`/auth/getname?nisn=${nisn}`),

  // --- KELOLA BUKU ---
  getBooks: (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category); // 'reguler' or 'paket'
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/books${queryStr}`);
  },
  
  getBookById: (id) => apiRequest(`/books/${id}`),
  
  createBook: (bookData) => 
    apiRequest('/books', { 
      method: 'POST', 
      body: JSON.stringify(bookData) 
    }),
    
  updateBook: (id, bookData) => 
    apiRequest(`/books/${id}`, { 
      method: 'PATCH', 
      body: JSON.stringify(bookData) 
    }),
    
  deleteBook: (id) => apiRequest(`/books/${id}`, { method: 'DELETE' }),
  
  getBookLabels: (id, quantity) => {
    const queryStr = quantity ? `?quantity=${quantity}` : '';
    return apiRequest(`/books/${id}/labels${queryStr}`);
  },

  // --- PEMINJAMAN (LOANS) ---
  getLoans: (category = '') => {
    const queryStr = category ? `?category=${category}` : '';
    return apiRequest(`/loans${queryStr}`);
  },
  
  getLoansByStatus: (category, status) => {
    return apiRequest(`/loans/${category}?status=${status}`);
  },
  
  searchStudentsForLoan: (keyword) => 
    apiRequest(`/loans/students/search?keyword=${encodeURIComponent(keyword)}`),
    
  getBooksForLoanModal: (category, search = '') => {
    const queryStr = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/loans/${category}/books${queryStr}`);
  },
  
  createRegularLoan: (nisn, bookId, dueDate) => 
    apiRequest('/loans/reguler', { 
      method: 'POST', 
      body: JSON.stringify({ nisn, bookId, dueDate }) 
    }),
    
  getLoansByNisn: (nisn) => 
    apiRequest(`/loans/nisn/${nisn}`),
    
  createPacketLoan: (bookId, dueDate, nisnList) => 
    apiRequest('/loans/paket', { 
      method: 'POST', 
      body: JSON.stringify({ bookId, dueDate, nisn: nisnList }) 
    }),
    
  returnBook: (loanId, condition) => 
    apiRequest(`/loans/return/${loanId}`, { 
      method: 'POST', 
      body: JSON.stringify({ loanId: parseInt(loanId), condition: condition.toLowerCase() }) 
    }),
};
