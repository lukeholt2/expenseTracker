'use server';
import { cookies } from "next/headers";

function baseEndpoint() {
  return `${process.env.NEXT_PUBLIC_API_URL}/expense`;
}


export async function getCategories(monthOfInterest?: number, yearOfInterest?: number) {
  const cookieStore = await cookies();
  let endpoint = `${baseEndpoint()}/Categories`;
  if (monthOfInterest !== undefined) {
    endpoint = `${endpoint}?monthOfInterest=${monthOfInterest}`;
  }
  if (yearOfInterest !== undefined) {
    endpoint = `${endpoint}?yearOfInterest=${yearOfInterest}`;
  }
  const res = await fetch(endpoint, {
    headers: {
      'Content-type': 'application/json',
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    },
  });
  return await res.json();
}

export async function getPaymentTypes() {
  const cookieStore = await cookies();
  const endpoint = `${baseEndpoint()}/PaymentTypes`;
  const res = await fetch(endpoint, {
    headers: {
      'Content-type': 'application/json',
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    },
  });
  return await res.json();
}


export async function getExpenses(monthOfInterest?: number, yearOfInterest?: number, category?: string) {
  let endpoint = `${baseEndpoint()}`;
  const cookieStore = await cookies();
  if (monthOfInterest !== undefined) {
    endpoint = `${endpoint}?monthOfInterest=${monthOfInterest}`;
  }
  if (yearOfInterest !== undefined) {
    endpoint = `${endpoint}?yearOfInterest=${yearOfInterest}`;
  }
  if (category) {
    endpoint = `${endpoint}?category=${category}`;
  }
  const res = await fetch(endpoint, {
    headers: {
      'Content-type': 'application/json',
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    },
  });
  return await res.json();
}

export async function addOrEditExpense(expense: string, update?: boolean) {
  const cookieStore = await cookies();
  const endpoint = baseEndpoint();
  const formData = new FormData();
  formData.append('expense', expense);
  const res = await fetch(endpoint, {
    method: update ? 'PUT' : 'POST',
    body: formData,
    headers: {
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    },
  });
  return await res.json();
}


