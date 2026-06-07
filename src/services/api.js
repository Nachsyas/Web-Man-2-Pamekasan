const BASE_URL = import.meta.env.DEV ? '/api' : 'https://manda-library.vercel.app';


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
    if (response.status === 401 && !endpoint.includes('/auth/pustakawan/login') && !endpoint.includes('/auth/siswa/login')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('student');
      
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/siswa')) {
        window.location.href = '/siswa/access';
      } else {
        window.location.href = '/pustakawan/login';
      }
    }

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
    
  loginSiswa: (nisn, name) => 
    apiRequest('/auth/siswa/login', { 
      method: 'POST', 
      body: JSON.stringify({ nisn, name }) 
    }),
    
  checkIn: (nisn, name) => 
    apiRequest('/auth/checkin', { 
      method: 'POST', 
      body: JSON.stringify({ nisn, name }) 
    }),
    
  getNameByNisn: (nisn) => apiRequest(`/auth/getname?nisn=${nisn}`),
  searchSchoolStudents: (keyword) => apiRequest(`/auth/students/search?keyword=${encodeURIComponent(keyword)}`),

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

  getReturns: (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/loans/returns${queryStr}`);
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

  replaceBook: (loanId) => 
    apiRequest(`/loans/replacement/${loanId}`, { 
      method: 'POST' 
    }),

  // --- MEMBERS / STUDENTS MANAGEMENT ---
  getStudents: (search = '') => 
    apiRequest('/students' + (search ? `?search=${search}` : '')),

  createStudent: (studentData) => 
    apiRequest('/students', { 
      method: 'POST', 
      body: JSON.stringify(studentData) 
    }),

  deleteStudent: (nisn) => 
    apiRequest(`/students/${nisn}`, { 
      method: 'DELETE' 
    }),

  // --- REPORTS ---
  getReports: (type, startDate, endDate) => 
    apiRequest(`/reports?type=${type}&startDate=${startDate}&endDate=${endDate}`),

  // --- DASHBOARDS ---
  getDashboard: () => apiRequest('/dashboard'),

  getStudentDashboard: () => apiRequest('/student-dashboard/me'),

  // --- STUDENT COLLECTIONS ---
  getStudentCatalog: (category = '', search = '', subject = '') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (subject) params.append('subject', subject);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/student-catalog${queryStr}`);
  },

  getStudentCatalogDetail: (id) => 
    apiRequest(`/student-catalog/${id}`),

  getStudentHistory: (search = '', status = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/student-dashboard/me/history${queryStr}`);
  },

  // --- ACCOUNT PROFILE ---
  getAccountMe: () => apiRequest('/account/me'),

  updateAccountMe: (data) => 
    apiRequest('/account/me', { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),

  updatePasswordMe: (data) => 
    apiRequest('/account/me/password', { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
};
