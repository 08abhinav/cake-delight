export const API_BASE_URL = "";

export const ENDPOINTS = {
  signup: "/api/user/auth/signup",
  verifyOtp: "/api/user/auth/verify-otp",
  resendOtp: "/api/user/auth/resend-otp",
  signin: "/api/user/auth/signin",
  signout: "/api/user/auth/signout",
  currentUser: "/api/user/auth/me",

  allCakes: "/api/cake/allCake",
  filterCakes: "/api/cake/filter",

  addCake: "/api/cake/addCake",
  myCakes: "/api/cake/myCakes",
  cakeById: (id) => `/api/cake/${id}`,
  updateCake: (id) => `/api/cake/updateEntry/${id}`,
  deleteCake: (id) => `/api/cake/deleteEntry/${id}`,

  averageRating: (productId) =>`/api/rating/order/average/${productId}`,
  submitRating: "/api/rating/order",

  cartItems: "/api/cart/items",
  checkout: "/api/order/checkout",
};

export const apiRequest = async ( endpoint, method = "GET", body = null ) => { 
  const options = {
     method, 
     credentials: "include", 
     headers: {}, 
    };
   if (body instanceof FormData) { 
    options.body = body; 
  } else if (body) { 
    options.headers["Content-Type"] = "application/json"; 
    options.body = JSON.stringify(body); 
  } 
  const response = await fetch( `${API_BASE_URL}${endpoint}`, options ); 
  const data = await response.json(); 
  if (!response.ok) { 
    throw new Error( data.message || data.errors?.[0]?.msg || "Something went wrong" );
  }
  return data;
};