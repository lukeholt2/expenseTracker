'use server';
import { cookies } from "next/headers";

function baseEndpoint() {
  return `${process.env.NEXT_PUBLIC_API_URL}/expense`;
}

export async function getBudget() {
  // Fetch data from external API
  console.log('fetching budget')
  const cookieStore = await cookies();
  const endpoint = `${baseEndpoint()}/Budget`;
  const res = await fetch(endpoint, {
    headers: {
      'Content-type': 'application/json',
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    }
  });
  // Pass data to the page via props
  const budget = await res.json();
  return budget;
}

export async function updateBudget(budget: string) {
  // Fetch data from external API
  const cookieStore = await cookies();
  const endpoint = `${baseEndpoint()}/Budget`;
  const res = await fetch(endpoint, {
    body: budget,
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      "Authorization": `Bearer ${cookieStore.get('token')?.value}`
    }
  });
  const updated = await res.json();
  return updated;
}